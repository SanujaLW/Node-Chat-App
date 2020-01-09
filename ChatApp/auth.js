var expressSession = require("express-session");
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

var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: "http://localhost:3030/authCallBack"
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
  }
);

passport.use(strategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

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
      req.logIn(user, err => {
        if (err) {
          console.log("Session login error " + err);
          return next(err);
        }
        res.redirect("/home");
      });
    })(req, res, next);
  })
  .get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
  });

module.exports = {
  ExpressSession: expressSession(session),
  PassportInit: passport.initialize(),
  PassportSession: passport.session(),
  AuthRoutes: router
};
