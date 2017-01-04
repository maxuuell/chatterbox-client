// YOUR CODE HERE:
var app = {
  server : 'https://api.parse.com/1/classes/messages/',
  username : '',
  roomname : "lobby",
  messages : [],
  lastMessageId : 0,
  friends : {},

  init : function () {
    app.username = window.location.search.substr(10);

    app.$message = $("#message");
    app.$chats = $("#chats");
    app.$roomSelect = $("#roomSelect");
    app.$send = $("#send");

    app.$send.on('submit', app.handleSubmit);
    app.$roomSelect.on('change', app.handleRoomChange);
    // event delegation
    app.$chats.on('click', '.username', app.handleUsernameClick);

    app.fetch();

    setInterval(function(){
      app.fetch();
    }, 3000)
  },

  send : function (message) {

    $.ajax({
  // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),

      success: function (data) {
        app.$message.val('');
        app.fetch();
      },

      error: function (error) {
        console.error('chatterbox: Failed to send message', error);
      }
    });
  },

  handleSubmit : function(event) {
    var input = document.getElementById('message').value;

    var message = {
      username : app.username,
      text : input,
      roomname : app.roomname
    };

    app.send(message);
    event.preventDefault();
  },

  fetch : function () {

    $.ajax({
      url: app.server,
      type: 'GET',
      data: {option : '-createdAt'},

      success: function (data) {
        app.messages = data.results;
        console.log("These are messages: ", app.messages);
        
        var mostRecentMessage = app.messages[app.messages.length - 1];

        if (mostRecentMessage.objectId !== app.lastMessageId) {
          app.renderRoomList(app.messages);
          app.renderMessages(app.messages); 
        }
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  renderMessages : function(messages) {
    app.clearMessages();
    
    var filteredMessages = messages.filter(function(message){

      if (app.roomname === 'lobby' && !message.roomname) {
        return true;
      } else if (message.roomname === app.roomname) {
        return true;
      } else {
        return false;
      }
    });

    filteredMessages.forEach(app.renderMessage);
  },

  renderMessage : function (message) {
    var $chat = $('<div class="chat"/>');
    var $username = $('<h1 class="username"></h1>');
    var $text = $('<p class="text"></p>');

    $username.text(message.username).attr('data-username', message.username).appendTo($chat);

    if(app.friends[message.username] === true){
      $username.addClass('friend');
    }
    
    $text.text(message.text).appendTo($chat);
      
    app.$chats.append($chat);
   },

  renderRoomList : function (messages) {
    app.$roomSelect.html('<option value="newRoom">New room...</option></select>');

    if(messages){
      var rooms = {};

      messages.forEach(function(message){
        var roomname = message.roomname;

        if (roomname && !rooms[roomname]) {
          app.renderRoom(roomname);
          rooms[roomname] = true;
        }
      })
    }

    app.$roomSelect.val(app.roomname);
  },

  renderRoom : function (roomname) {
    var $option = $('<option/>').val(roomname).text(roomname);
    app.$roomSelect.append($option);
  },

  handleRoomChange : function (event) {
    var selectIndex = app.$roomSelect.prop('selectedIndex');

    if(selectIndex === 0) {
      var roomname = prompt('Enter new room name');

      if (roomname) {
        app.roomname = roomname;
        app.renderRoom(roomname);
        app.$roomSelect.val(roomname);
      }
    } else {
      app.roomname = app.$roomSelect.val();
    }

    app.renderMessages(app.messages);
  },

  handleUsernameClick : function (event) {
    var username = $(event.target).data('username');

    if(username !== undefined) {
      app.friends[username] = !app.friends[username];

      var selector = '[data-username="' + username + '"]';
      var $usernames = $(selector).toggleClass('friend');
    }

    
  },


  clearMessages : function () {
    app.$chats.empty();
  },

}