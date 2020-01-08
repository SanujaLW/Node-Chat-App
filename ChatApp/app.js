var express = require("express");
var app = express();

app.use(express.static("clientApp"));

app.use(require("./app-routing.js"));
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var db = require("./model/orm.js");

var User = require("./model/user.js");
var ChatRoom = require("./model/chat-room.js");
var chatRoom;

server.listen("3030", () => {
  chatRoom = new ChatRoom();
  console.log("Chat server started at 3030");
  db.initiate();
});

io.on("connection", function(socket) {
  socket.on("join", function(firstName, lastName, email) {
    chatRoom.addUser(new User(firstName, lastName, email, socket));
    socket.emit("joined");
  });
  socket.on("disconnect", function() {
    chatRoom.removerUser(chatRoom.getUserBySocket(socket));
  });
  socket.on("out-message", function(msg) {
    let sentBy = chatRoom.getUserBySocket(socket);
    chatRoom.users.forEach(u => {
      if (u != sentBy) {
        u.socket.emit("in-message", sentBy.name, msg);
      }
    });
  });
});
