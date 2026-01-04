var express = require('express');
var router = express.Router();

/* GET all album */
router.get("/", function (req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null,
  });
});

/* CREATE an album */
router.post("/", function (req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null,
  });
});

/* GET all album in a format that good for select component */
router.get("/selection", function (req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null,
  });
});

/* Show album content */
router.get("/:id", function (req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null,
  });
});

/* Put media to an album */
router.put("/media/put", function () {
    res.status(501).json({
      message: "Route belum di implementasi!",
      success: false,
      data: null,
    });
});

module.exports = router;
