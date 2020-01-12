function getAuth(orm, chatRoom, User) {
  var passport = require("passport");
  var Auth0Strategy = require("passport-auth0");
  var router = require("express").Router();
  require("dotenv").config();

  var session = {
    secret: "BkL5u26IPS",
    cookie: {},
    resave: false,
    saveUninitialized: false
  };

  var strategy = new Auth0Strategy({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: "http://localhost:3030/authCallBack"
    },
    async function (accessToken, refreshToken, extraParams, profile, done) {
      try {
        let loggedUser;
        let result = await new orm.schema.ChatUser({
          email: profile._json.email
        }).fetch({
          require: false
        });
        if (result == null) {
          loggedUser = await new orm.schema.ChatUser({
            firstName: profile._json.given_name,
            lastName: profile._json.family_name,
            email: profile._json.email
          }).save();
          console.log("Added new user with email " + profile._json.email);
        } else {
          loggedUser = result;
        }

        profile.loggedUser = loggedUser;

      } catch (err) {
        return done(err, profile);
      }
      return done(null, profile);
    }
  );

  passport.use(strategy);

  passport.serializeUser(function (user, done) {
    done(null, user.loggedUser);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  var authGuard = function (req, res, next) {
    if (req.user) {
      return next();
    }
    res.redirect("/");
  };

  router
    .get(
      "/login",
      passport.authenticate("auth0", {
        scope: "openid email profile"
      }),
      (req, res) => {
        res.redirect("/home");
      }
    )
    .get("/authCallBack", (req, res, next) => {
      passport.authenticate("auth0", (err, user, info) => {
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
      req.logout();
      res.redirect("/");
    })
    .get("/get-user", authGuard, function (req, res) {
      chatRoom.addUser(new User(req.user, req.sessionID), null);
      res.json(req.user);
    });

  return {
    Session: session,
    Passport: passport,
    AuthRoutes: router,
    AuthGuard: authGuard
  };
}

module.exports = getAuth;