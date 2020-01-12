class User {
  constructor(chatUser, auth, socket) {
    this.chatUser = chatUser;
    this.name = chatUser.firstName + " " + chatUser.lastName;
    this.auth = auth;
    this.socket = socket;
  }

  getResource() {
    return {
      firstName: this.chatUser.firstName,
      lastName: this.chatUser.lastName,
      name: this.name,
      email: this.chatUser.email
    };
  }
}

module.exports = User;