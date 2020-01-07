var http = require("http");
var fs = require("fs");
var server = http.createServer();
var io = require("socket.io")(server);
var chatRoom;

var fileRoot = "clientApp";

server.on("request", (request, response) => {
  const { method, url } = request;

  request.on("error", err => {
    console.log(err.stack);
  });

  response.on("error", err => {
    console.log(err.stack);
  });

  if (url === "/favicon.ico") {
    response.writeHead(200, { "Content-Type": "image/x-icon" });
    response.end();
  }

  if (url.indexOf(".js") != -1) {
    let filePath = fileRoot + url;
    fs.readFile(filePath, function(err, data) {
      response.writeHead(200, { "Content-Type": "text/javascript" });
      response.write(data);
      response.end();
    });
  }

  if (url.indexOf(".css") != -1) {
    let filePath = fileRoot + url;
    fs.readFile(filePath, function(err, data) {
      response.writeHead(200, { "Content-Type": "text/css" });
      response.write(data);
      response.end();
    });
  }

  if (url == "/") {
    fs.readFile("clientApp/index.html", function(err, data) {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    });
  }
});

io.on("connection", function(socket) {
  socket.on("join", function(name, email) {
    chatRoom.addUser(new User(name, email, socket));
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

server.listen("3030", () => {
  chatRoom = new ChatRoom();
  console.log("Chat server started at 3030");
});

class User {
  constructor(name, email, socket) {
    this.name = name;
    this.email = email;
    this.socket = socket;
  }
}

class ChatRoom {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    this.users.push(user);
  }

  removerUser(user) {
    this.users.splice(this.users.indexOf(user), 1);
  }

  getUserByName(name) {
    for (let user of this.users) {
      if (user.name === name) return user;
    }
  }

  getUserByEmail(email) {
    for (let user of this.users) {
      if (user.email === email) return user;
    }
  }

  getUserBySocket(socket) {
    for (let user of this.users) {
      if (user.socket === socket) return user;
    }
  }
}
