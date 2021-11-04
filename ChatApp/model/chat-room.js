class ChatRoom {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    this.users.push(user);
  }

  removeUser(user) {
    this.users.splice(this.users.indexOf(user), 1);
  }

  getUserByName(name) {
    for (let user of this.users) {
      if (user.getResource().name === name) return user;
    }
  }

  getUserByEmail(email) {
    for (let user of this.users) {
      if (user.getResource().email === email) return user;
    }
  }

  getUserBySocket(socket) {
    for (let user of this.users) {
      if (user.socket === socket) return user;
    }
  }

  getUserByAuth(auth) {
    for (let user of this.users) {
      if (auth.indexOf(user.auth) !== -1) return user;
    }
  };
}

module.exports = new ChatRoom();