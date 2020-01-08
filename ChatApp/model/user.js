class User {
  constructor(firstName, lastName, email, socket) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.name = firstName + " " + lastName;
    this.email = email;
    this.socket = socket;
  }

  getResource() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    };
  }

  setFromResource(data) {
    this.lastName = data[lastName];
    this.firstName = data[firstName];
    this.name = firstName + " " + lastName;
    this.email = data[email];
  }
}

module.exports = User;
