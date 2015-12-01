/*global Backbone */
var app = app || {};

(function() {
  'use strict';

  // Todo Model
  // ----------

  // Our basic **Todo** model has `title`, `order`, and `completed` attributes.
  app.Todo = Backbone.Model.extend({
    // Default attributes for the todo
    // and ensure that each todo created has `title` and `completed` keys.
    defaults: {
      title: '',
      priority: 0,
      completed: false,
    },

    // Increases the priority by one unit, and turns into 0 if its previous
    // priority was 3.
    increasePriority: function() {
      this.set('priority', (this.get('priority') + 1) % 4);
      this.save();
      this.trigger('increase');
    },

    // Toggle the `completed` state of this todo item.
    toggle: function() {
      this.save({
        completed: !this.get('completed'),
      });
    },
  });
})();
