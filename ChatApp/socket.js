function initializeSocket(server) {
  var io = require("socket.io")(server);

  io.on("connection", function(socket) {
    socket.on("join", function(firstName, lastName, email) {
      /*chatRoom.addUser(new User(firstName, lastName, email, socket));
      socket.emit("joined");*/
    });
    socket.on("disconnect", function() {
      /*chatRoom.removerUser(chatRoom.getUserBySocket(socket));*/
    });
    socket.on("out-message", function(msg) {
      /*let sentBy = chatRoom.getUserBySocket(socket);
      chatRoom.users.forEach(u => {
        if (u != sentBy) {
          u.socket.emit("in-message", sentBy.name, msg);
        }
      });*/
    });
  });

  return io;
}

module.exports = initializeSocket;
