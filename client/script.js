var $ = require('jquery');
var todoTemplate = require("../views/partials/todo.hbs");

var addTodo = function() {
   var text = $('#add-todo-text').val();
   $.ajax({
     url: '/api/todos',
     type: 'POST',
     data: {
       text: text
     },
     dataType: 'json',
     success: function(data) {
       var todo = data.todo[0];
       var newLiHtml = todoTemplate(todo);
       $('form + ul').append(newLiHtml);
       $('#add-todo-text').val('');
     }
   });
 };

var updateTodo = function(id, data, cb) {
  $.ajax({
    url: '/api/todos/'+id,
    type: 'POST',
    data: data,
    dataType: 'json',
    success: function(data) {
      cb();
    }
  });
};

var deleteTodo = function(id, cb) {
    $.ajax({
        url: '/api/todos/'+id,
        type: 'DELETE',
        data: {
            id: id
        },
        dataType: 'json',
        success: function(data) {
            cb();
        }
    });
};

var deleteTodoLi = function($li) {
    $li.remove();
};

$(function() {
    $(":button").on('click', addTodo);
    $(":text").on('keypress', function(e) {
        var key = e.keyCode;
        if( key == 13 || key == 169) {
            addTodo();
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });
    $('ul').on('change', 'li :checkbox', function() {
    var $this = $(this);
    var $input = $this[0];
    var $li = $this.parent();
    var id = $li.attr('id');
    var checked = $input.checked;
    var data = { done: checked };
    updateTodo(id, data, function(d) {
      $this.next().toggleClass('checked');
    });
  });
  $('ul').on('keydown', 'li span', function(e){
      var $this = $(this),
        $span = $this[0],
        $li = $this.parent(),
        id = $li.attr('id'),
        key = e.keyCode,
        target = e.target,
        text = $span.innerHTML,
        data = { text: text };
      $this.addClass('editing');
      if(key === 27) {
          $this.removeClass('editing');
          document.execCommand('undo');
          target.blur();
      } else if(key === 13) {
          updateTodo(id, data, function(d) {
              $this.removeClass('editing');
              target.blur();
          });
          e.preventDefault();
      }
  });
  $('ul').on('click', 'li a', function() {
      var $this = $(this),
      $input = $this[0],
      $li = $this.parent(),
      id = $li.attr('id');
      deleteTodo(id, function(e){
          deleteTodoLi($li);
      });
  });
});