var router = require("express").Router();

router
  .get("/", function(req, res) {
    res.sendFile(__dirname + "/clientApp/login/login.html");
  })
  .get("/favicon.ico", function(req, res) {
    res.set({ "Content-Type": "image/x-icon" });
    res.sendStatus(200);
  });

module.exports = router;
