function initializeSocket(server, chatRoom, orm) {
  let io = require("socket.io")(server);
  let userController = require("./controllers/userController.js")(
    orm,
    chatRoom
  );

  io.on("connection", function(socket) {
    userController.on_connect(socket);
    socket.on("out-message", async function(message) {
      userController.on_message_out(message, socket);
    });

    socket.on("disconnect", function() {
      userController.on_disconnect(socket);
    });
  });

  return io;
}

module.exports = initializeSocket;
