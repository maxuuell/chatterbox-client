// YOUR CODE HERE:
var app = {
  server : 'https://api.parse.com/1/classes/messages',
  messages : [],
  // $message = $('#message');

  init : function () {
    // determine the username
    // determine the roomname
    // invoke fetch, and render based on the roomname
    //
  },

  send : function () {
    var input = document.getElementById('message').value;
    var room =
    var message = {
      message : input,
      username : window.location.search,
      roomname :
    }

    $.ajax({
  // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        app.fetch();
        app.clearMessages();
        app.renderMessage();
      },
      error: function (error) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', error);

      }
    });
  },

  fetch : function () {

    $.ajax({
      url: app.server,
      type: 'GET',
      data: '',
      contentType: 'application/json',
      success: function (data) {
        app.messages = data.results;
        console.log("These are messages: ",app.messages);
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  renderMessage : function () {
    for(var i = 0; i < app.messages.length; i++) {
      if(app.messages[i].roomname === 'lobby') {
        $('#chats').append("<div class='chat'><h1 class='chat username'>" + app.messages[i].username + "</h1><p>" + app.messages[i].text + "</p></div>")
      }
    }
  },

  clearMessages : function () {
    $('#chats').empty()
  },

  renderRoom : function () {

  },

}