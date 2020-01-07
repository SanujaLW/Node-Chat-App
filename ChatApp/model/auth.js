class Authenticator {
  constructor() {
    this.AUTH_TYPES = Object.freeze({
      PASSWORD: Symbol("password")
    });
  }
}

class Authorizor {}
