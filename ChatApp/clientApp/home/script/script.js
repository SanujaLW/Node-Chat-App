$(document).ready(function() {
  let isLoadingMessages = false;
  let loadedUpto = 0;
  let me;
  jQuery.get("/get-user").then(user => {
    me = user;
    $(".username").html(user.firstName + " " + user.lastName);
  });

  let socket = io();

  socket.on("in-message", function(name, msg) {
    $(".conversation").prepend(
      "<p class='message-in'>" + name + ": " + msg + "</p>"
    );
  });

  socket.on("joined", function() {
    jQuery
      .get("/messages", {
        upTo: loadedUpto
      })
      .then(data => {
        for (let message of data.messages) {
          if (message.sentBy.email == me.email) {
            $(".conversation").append(
              "<p class='message-out'>me" + ": " + message.msg + "</p>"
            );
          } else {
            $(".conversation").append(
              "<p class='message-in'>" +
                message.sentBy.firstName +
                ": " +
                message.msg +
                "</p>"
            );
          }
        }
        loadedUpto = data.hasUpto;
      });
  });

  socket.on("error", function(error) {
    alert(error);
  });

  $("#btn-send").click(function(event) {
    let msg = $("#txt-msg").val();
    if (msg.length > 0) {
      socket.emit("out-message", msg);
      $(".conversation").prepend(
        "<p class='message-out'>me" + ": " + msg + "</p>"
      );
    }
    $("#txt-msg").val("");
  });

  $(".conversation").scroll(function(event) {
    if ($(".conversation").scrollTop() == 0 && isLoadingMessages == false) {
      isLoadingMessages = true;
      jQuery
        .get("/messages", {
          upTo: loadedUpto
        })
        .then(data => {
          for (let message of data.messages) {
            if (message.sentBy.email == me.email) {
              $(".conversation").append(
                "<p class='message-out'>me" + ": " + message.msg + "</p>"
              );
            } else {
              $(".conversation").append(
                "<p class='message-in'>" +
                  message.sentBy.firstName +
                  ": " +
                  message.msg +
                  "</p>"
              );
            }
          }
          loadedUpto = data.hasUpto;
          isLoadingMessages = false;
        });
    }
  });
});
