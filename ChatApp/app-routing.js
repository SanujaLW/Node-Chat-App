var router = require("express").Router();

router
  .get("/", function(req, res) {
    res.sendFile(__dirname + "/clientApp/index.html");
  })
  .get("/favicon.ico", function(req, res) {
    res.set({ "Content-Type": "image/x-icon" });
    res.sendStatus(200);
  })
  .get("/home", function(req, res) {
    res.sendFile(__dirname + "/clientApp/home/home.html");
  });

module.exports = router;
