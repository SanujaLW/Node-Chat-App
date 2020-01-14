function getRoutes(auth, orm, chatRoom) {
  let router = require("express").Router();
  let userController = require("./controllers/userController.js")(
    orm,
    chatRoom
  );
  let messageController = require("./controllers/messageController.js")(orm);

  return router
    .get("/", function(req, res) {
      res.sendFile(__dirname + "/clientApp/index.html");
    })
    .get(
      "/login",
      auth.Passport.authenticate("auth0", {
        scope: "openid email profile"
      }),
      (req, res) => {
        userController.login(req, res);
      }
    )
    .get("/authCallBack", (req, res, next) => {
      auth.Passport.authenticate("auth0", (err, user, info) => {
        if (err) {
          console.log("an error " + err);
          return next(err);
        }
        if (!user) {
          console.log("No user");
          return res.redirect("/login");
        }
        req.login(user, err => {
          if (err) {
            console.log("Session login error " + err);
            return next(err);
          }
          res.redirect("/home");
        });
      })(req, res, next);
    })
    .get("/logout", (req, res) => {
      userController.logout(req, res);
    })
    .get("/get-user", auth.AuthGuard, function(req, res) {
      userController.get_user(req, res);
    })
    .get("/favicon.ico", function(req, res) {
      res.set({
        "Content-Type": "image/x-icon"
      });
      res.sendStatus(200);
    })
    .get("/home", auth.AuthGuard, function(req, res) {
      res.sendFile(__dirname + "/clientApp/home/home.html");
    })
    .get("/messages", async function(req, res) {
      messageController.get_messages(req, res);
    });
}

module.exports = getRoutes;
