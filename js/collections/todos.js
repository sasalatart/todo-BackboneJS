/*global Backbone */
var app = app || {};

(function() {
  'use strict';

  // Todo Collection
  // ---------------

  // The collection of todos is backed by *localStorage* instead of a remote
  // server.
  var Todos = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: app.Todo,

    // Property which decides whether to sort by priority or by order.
    sorting: 'priority', // [priority | order]

    // Save all of the todo items under the `"todos"` namespace.
    localStorage: new Backbone.LocalStorage('todos-backbone'),

    // Filter down the list of all todo items that are finished.
    completed: function() {
      return this.where({completed: true});
    },

    // Filter down the list to only todo items that are still not finished.
    remaining: function() {
      return this.where({completed: false});
    },

    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      var maxOrder = 0;
      app.todos.forEach(function(model) {
        maxOrder = (maxOrder < model.get('order')) ? model.get('order') : maxOrder;
      });

      return maxOrder + 1;
    },

    // Toggles the sorting property.
    toggleSorting: function() {
      this.sorting = (app.todos.sorting === 'priority')  ? 'order' : 'priority';
    },

    // Todos are sorted.
    comparator: function(todo) {
      return todo.get(this.sorting);
    },
  });

  // Create our global collection of **Todos**.
  app.todos = new Todos();
})();
