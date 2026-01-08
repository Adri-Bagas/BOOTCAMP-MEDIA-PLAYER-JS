var express = require("express");
var router = express.Router();


/* POST login. */
router.post("/login", function (req, res, next) {
  res.status(500).json({
    success: false,
    message: "Route belum di implementasikan!",
    data: null,
  });
});

/* POST logout. */
router.post("/logout", function (req, res, next) {
  res.status(500).json({
    success: false,
    message: "Route belum di implementasikan!",
    data: null,
  });
});

module.exports = router;
