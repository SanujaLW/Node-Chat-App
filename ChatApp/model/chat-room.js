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

module.exports = ChatRoom;
