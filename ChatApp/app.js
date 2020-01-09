var express = require("express");
var app = express();
var db = require("./model/orm.js");
db.initiate();

app.use(express.static("clientApp"));

var auth = require("./auth.js")(db);
var bodyPasser = require("body-parser");
app.use(require("express-session")(auth.Session));
app.use(bodyPasser.json());
app.use(bodyPasser.urlencoded({ extended: false }));
app.use(auth.Passport.initialize());
app.use(auth.Passport.session());
app.use(require("./app-routing.js")(auth.AuthGuard));
app.use(auth.AuthRoutes);

var server = require("http").createServer(app);
var io = require("./socket.js")(server);

var User = require("./model/user.js");
var ChatRoom = require("./model/chat-room.js");
var chatRoom;

server.listen("3030", () => {
  console.log("Chat server started at 3030");
});
