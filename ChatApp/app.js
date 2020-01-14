let express = require("express");
let app = express();
let ORM = require("./model/orm.js");
require("dotenv").config();
let orm = new ORM();

app.use(express.static("clientApp"));
app.use(express.static(__dirname + "/node_modules/"));

let chatRoom = require("./model/chat-room.js");
let User = require("./model/user.js");

let auth = require("./auth.js")(orm, chatRoom, User);
let bodyPasser = require("body-parser");
let expressSession = require("express-session");
app.use(expressSession(auth.Session));
app.use(bodyPasser.json());
app.use(
  bodyPasser.urlencoded({
    extended: false
  })
);
app.use(auth.Passport.initialize());
app.use(auth.Passport.session());
app.use(require("./app-routing.js")(auth, orm, chatRoom));

let server = require("http").createServer(app);
let io = require("./socket.js")(server, chatRoom, orm);

server.listen("3030", () => {
  console.log("Chat server started at 3030");
});
