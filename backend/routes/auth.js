var express = require('express');
var router = express.Router();

/* POST login. */
router.post('/login', function(req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null,
  });
});

/* POST logout. */
router.post('/logout', function(req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null,
  });
});

module.exports = router;
