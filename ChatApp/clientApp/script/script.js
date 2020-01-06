$(document).ready(function() {
  var socket = io();

  socket.on("joined", function() {
    $(".message-box > *").prop("disabled", false);
  });

  socket.on("in-message", function(name, msg) {
    $(".chat-room").append(
      "<p class='align-self-start'>" + name + ": " + msg + "</p>"
    );
  });

  $(".frm-join").submit(function(event) {
    event.preventDefault();
    socket.emit("join", $("#name").val(), $("#email").val());
    return false;
  });

  $("#btn-send").click(function(event) {
    let msg = $("#txt-msg").val();
    if (msg.length > 0) {
      socket.emit("out-message", msg);
      $(".chat-room").append(
        "<p class='align-self-end'>me" + ": " + msg + "</p>"
      );
    }
  });
});
