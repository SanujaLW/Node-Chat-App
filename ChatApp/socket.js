function initializeSocket(server, chatRoom, orm) {
  var io = require("socket.io")(server);

  io.on("connection", function (socket) {
    let auth = socket.handshake.headers.cookie;
    let connectedUser = chatRoom.getUserByAuth(auth);
    console.log(chatRoom.users.length);
    if (connectedUser != null) {
      connectedUser.socket = socket;
      console.log(connectedUser.name + " connected from " + socket);
    }
    socket.emit("joined");

    socket.on("out-message", async function (message) {
      try {
        let sentBy = chatRoom.getUserBySocket(socket);
        let profile = await new orm.schema.ChatUser({
          email: sentBy.getResource().email
        }).fetch();
        let time = Date.now();
        let sentMsg = await new orm.schema.ChatMessage({
          msg: message,
          timeSent: time,
          userId: profile.toJSON().id,
          threadId: 1
        }).save();
        chatRoom.users.forEach(u => {
          if (u != sentBy) {
            u.socket.emit("in-message", sentBy.name, sentMsg.toJSON().msg);
          }
        });
      } catch (err) {
        chatRoom.users.forEach(u => {
          u.socket.emit("error", err);
        });
      }
    });

    socket.on("disconnect", function () {
      chatRoom.removeUser(chatRoom.getUserBySocket(socket));
    });
  });

  return io;
}

module.exports = initializeSocket;