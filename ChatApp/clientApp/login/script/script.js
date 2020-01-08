var webAuth = new auth0.WebAuth({
  domain: "dev-ssin9xj8.auth0.com",
  clientID: "1IJLEaGzMiLAqZyUAt5HfVxw0y71menA"
});

webAuth.authorize({
  connection: "google-oauth2",
  responseType: "token",
  redirectUri: "http://localhost:3030/home"
});
