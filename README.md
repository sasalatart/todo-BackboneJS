# TodoMVC
## BackboneJS

> Patricio López ([@mrpatiwi](https://github.com/mrpatiwi)) y Sebastián Salata ([@sasalatart](https://github.com/sasalatart))

> Based on [TodoMVC's](http://todomvc.com/) implementation.

### Demo

http://sasalatart.github.io/todo-BackboneJS/

### Setup

```sh
  $ npm install
```

### Usage

```sh
  $ npm start
```

### Cambios implementados:

#### Los items pueden ser clasificados por prioridad:
  * now (0)
  * soon (1)
  * later (2)
  * some day (3)

Quisimos hacer un botón circular para cada *todo*, tal que al hacerle click
disminuya su prioridad (una unidad por click, partiendo desde 0, su valor por
defecto). Al llegar a 3, si se hace click nuevamente, el valor queda en 0.

Para comenzar, en el modelo `todo` (`todo.js`) agregamos el atributo `priority`:

```javascript
defaults: {
  title: '',
  priority: 0,
  completed: false,
}
```

Además, agregamos la función `increasePriority`, la cual, de paso, gatilla el
evento 'increase':

```javascript
increasePriority: function() {
  this.set('priority', (this.get('priority') + 1) % 4);
  this.save();
  this.trigger('increase');
}
```

Luego, en `index.html`, en el template de los `todo`, agregamos el botón para
cambiar este atributo:

```html
<script type="text/template" id="item-template">
  <div class="view">
    ...
    <button class="priority"><%= priority %></button>
    ...
  </div>
</script>
```

Después, en la vista `todo` (`todo-view.js`) declaramos la función
`changePriority`, la cual llama a `increasePriority` del modelo asociado (en
este caso, `todo`):

```javascript
changePriority: function() {
  this.model.increasePriority();
}
```

Finalmente, en la misma vista asociamos todo lo anterior a través del siguiente
evento:

```javascript
events: {
  'click .priority': 'changePriority',
  ...
}
```

... y para cambiar visualmente la lista cada vez que se cambia una prioridad,
declaramos el siguiente evento en la vista `app` (`app-view.js`):

```javascript
initialize: function() {
  ...
  this.listenTo(app.todos, 'increase', this.addAll);
  ...
  });
}
```

---

#### Ordenamiento por orden de ingreso o por prioridad

Comenzamos agregando la propiedad `sorting` (por defecto parte con el valor
'priority') a la coleccion `todos`. Esta propiedad decidirá si el orden por
defecto es por prioridad ('priority'), o bien por orden de creación ('order').

```javascript
sorting: 'priority'
```

Para alternar esta propiedad entre 'priority' y 'order', definimos la función
`toggleSorting` en la colección:

```javascript
toggleSorting: function() {
  this.sorting = (app.todos.sorting === 'priority')  ? 'order' : 'priority';
}
```

... y también redefinimos el comparador para que ordene correctamente:

```javascript
comparator: function(todo) {
  return todo.get(this.sorting);
}
```

Luego, en `index.html`, agregamos el botón para alternar la forma en que se
ordena:

```html
<div class="center-align">
  <button class="sort-toggle">Ordenar por orden de creación</button>
</div>
```

Además, en la vista `app` declaramos la función `toggleSortingButton`, la cual
se encarga de cambiar la propiedad `sorting` de la colección, como también el
texto que expone el botón antes mencionado, y de paso reordena la lista:

```javascript
toggleSortingButton: function() {
  app.todos.toggleSorting();
  var text = app.todos.sorting === 'priority' ? 'creación' : 'prioridad'
  this.$orderToggler.html('Ordenar por orden de ' + text);
  this.addAll();
}
```

...pero como el *orden de llegada* para cada *todo* se obtiene a partir del
método `nextOrder`, el cual originalmente solo retornaba el `order + 1` del
último `todo` en la colección (puesto que estaban ordenados por llegada),
debemos cambiar el método para que funcione correctamente para cualquier tipo de
orden:

```javascript
nextOrder: function() {
  var maxOrder = 0;
  app.todos.forEach(function(model) {
    maxOrder = (maxOrder < model.get('order')) ? model.get('order') : maxOrder;
  });

  return maxOrder + 1;
}
```

Finalmente, en la vista `app` asociamos todo lo anterior a través del siguiente
evento:

```javascript
events: {
  ...
  'click .sort-toggle': 'toggleSortingButton',
}
```

---

#### Selector en la base que permita seleccionar por prioridad

Aprovechamos todo el *pipeline* que ya existía para filtrar por estado de
'Activo' o 'Completado', para agregarle la opción de filtrar por prioridades
('0', '1', '2' y '3').

Así, en `index.html` agregamos los siguientes links que ejecutarán en el Router
el evento `filter` de `todos`:

```html
<script type="text/template" id="stats-template">
  ...
  <ul class="filters">
    ...
    <li>
      <a href="#/0">0</a>
    </li>
    <li>
      <a href="#/1">1</a>
    </li>
    <li>
      <a href="#/2">2</a>
    </li>
    <li>
      <a href="#/3">3</a>
    </li>
  </ul>
  ...
</script>
```

Finalmente, se da que:

  * El evento `filter` ejecuta `filterAll` en la la vista `app`.
  * `filterAll` ejecuta `filterOne` sobre cada `todo`.
  * `filterOne` gatilla el evento `visible` en la vista `todo`.
  * El evento `visible` ejecuta `toggleVisible`, función que esconde o muestra
  cada `todo` si `isHidden` retorna `true`.

Así, solo es necesario alterar la función `isHidden`, dejándola como sigue:

```javascript
isHidden: function () {
  if (app.TodoFilter === '0') {
    return this.model.get('priority') != 0;
  } else if (app.TodoFilter === '1') {
    return this.model.get('priority') != 1;
  } else if (app.TodoFilter === '2') {
    return this.model.get('priority') != 2;
  } else if (app.TodoFilter === '3') {
    return this.model.get('priority') != 3;
  }

  return this.model.get('completed') ?
    app.TodoFilter === 'active' :
    app.TodoFilter === 'completed';
}
```
