function getAuth(orm, chatRoom, User) {
  let passport = require("passport");
  let Auth0Strategy = require("passport-auth0");

  let session = {
    secret: "BkL5u26IPS",
    cookie: {},
    resave: false,
    saveUninitialized: false
  };

  let strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL
    },
    async function(accessToken, refreshToken, extraParams, profile, done) {
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

  passport.serializeUser(function(user, done) {
    done(null, user.loggedUser);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  let authGuard = function(req, res, next) {
    if (req.user) {
      return next();
    }
    res.redirect("/");
  };

  return {
    Session: session,
    Passport: passport,
    AuthGuard: authGuard
  };
}

module.exports = getAuth;
