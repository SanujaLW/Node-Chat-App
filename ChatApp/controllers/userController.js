let User = require("../model/user.js");

function UserController(orm, chatRoom) {
  return {
    login: function(req, res) {
      res.redirect("/home");
    },
    logout: function(req, res) {
      req.logout();
      res.redirect("/");
    },
    get_user: function(req, res) {
      chatRoom.addUser(new User(req.user, req.sessionID), null);
      res.json(req.user);
    },
    on_connect: function(socket) {
      let authCode = socket.handshake.headers.cookie;
      let connectedUser = chatRoom.getUserByAuth(authCode);
      console.log(chatRoom.users.length);
      if (connectedUser != null) {
        connectedUser.socket = socket;
        console.log(connectedUser.name + " connected from " + socket);
        socket.emit("joined");
      } else {
        socket.emit("error");
      }
    },
    on_message_out: async function(message, socket) {
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
    },
    on_disconnect: function(socket) {
      chatRoom.removeUser(chatRoom.getUserBySocket(socket));
    }
  };
}

module.exports = UserController;
