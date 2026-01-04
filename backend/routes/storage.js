var express = require("express");
var router = express.Router();



/* Get actual uploaded media data. */
router.get("/storage/view-media/:type/:filename", function (req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null,
  });
});

module.exports = router;
