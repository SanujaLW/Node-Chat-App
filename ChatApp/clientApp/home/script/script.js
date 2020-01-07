$(document).ready(function() {
  var socket = io();

  socket.on("joined", function() {
    $(".message-box > *").prop("disabled", false);
  });

  socket.on("in-message", function(name, msg) {
    $(".conversation").append(
      "<p class='message-in'>" + name + ": " + msg + "</p>"
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
      $(".conversation").append(
        "<p class='message-out'>me" + ": " + msg + "</p>"
      );
    }
  });
});
