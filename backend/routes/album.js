var express = require("express");

var router = express.Router();

router.get("/", async function (req, res, next) {
  res.status(500).json({
    success: false,
    message: "Route belum di implementasikan!",
    data: null,
  });
});

router.get("/selection", async function (req, res, next) {
  res.status(500).json({
    success: false,
    message: "Route belum di implementasikan!",
    data: null,
  });
});

router.post("/", async function (req, res, next) {
  res.status(500).json({
    success: false,
    message: "Route belum di implementasikan!",
    data: null,
  });
});

router.get("/show/:id", async function (req, res, next) {
  res.status(500).json({
    success: false,
    message: "Route belum di implementasikan!",
    data: null,
  });
});

router.get("/get/cover/:id", async function (req, res, next) {
  res.status(500).json({
    success: false,
    message: "Route belum di implementasikan!",
    data: null,
  });
});

router.patch("/update/:id", async function (req, res, next) {
  res.status(500).json({
    success: false,
    message: "Route belum di implementasikan!",
    data: null,
  });
});

module.exports = router;
