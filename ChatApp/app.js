var express = require("express");
var app = express();
var ORM = require("./model/orm.js");
var orm = new ORM();

app.use(express.static("clientApp"));


var chatRoom = require("./model/chat-room.js");
var User = require("./model/user.js");

var auth = require("./auth.js")(orm, chatRoom, User);
var bodyPasser = require("body-parser");
var expressSession = require("express-session");
app.use(expressSession(auth.Session));
app.use(bodyPasser.json());
app.use(
  bodyPasser.urlencoded({
    extended: false
  })
);
app.use(auth.Passport.initialize());
app.use(auth.Passport.session());
app.use(require("./app-routing.js")(auth.AuthGuard, orm));
app.use(auth.AuthRoutes);

var server = require("http").createServer(app);
var io = require("./socket.js")(server, chatRoom, orm);

server.listen("3030", () => {
  console.log("Chat server started at 3030");
});