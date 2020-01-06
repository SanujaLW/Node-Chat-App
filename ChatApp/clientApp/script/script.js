$(document).ready(function() {
  var socket = io();

  socket.on("joined", function() {
    $(".message-box > *").prop("disabled", false);
  });

  $(".frm-join").submit(function(event) {
    event.preventDefault();
    socket.emit("join", $("#name").val(), $("#email").val());
    return false;
  });
});
