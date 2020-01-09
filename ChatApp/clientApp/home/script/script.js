$(document).ready(function() {
  jQuery.get("/get-user").then(user => {
    $(".username").html(user);
  });

  var socket = io();

  socket.on("in-message", function(name, msg) {
    $(".conversation").append(
      "<p class='message-in'>" + name + ": " + msg + "</p>"
    );
  });

  $("#btn-send").click(function(event) {
    let msg = $("#txt-msg").val();
    if (msg.length > 0) {
      socket.emit("out-message", msg);
      $(".conversation").append(
        "<p class='message-out'>me" + ": " + msg + "</p>"
      );
    }
  });
});
