var express = require("express");

var router = express.Router();

/* GET all media. */
router.get("/", async function (req, res, next) {
  res.status(500).json({
    success: false,
    message: "Route belum di implementasikan!",
    data: null,
  });
});

router.get("/:id", async function (req, res, next) {
  res.status(500).json({
    success: false,
    message: "Route belum di implementasikan!",
    data: null,
  });
});

router.get("/get/:id", async function (req, res, next) {
  res.status(500).json({
    success: false,
    message: "Route belum di implementasikan!",
    data: null,
  });
});

router.get("/get/thumbnail/:id", async function (req, res, next) {
  res.status(500).json({
    success: false,
    message: "Route belum di implementasikan!",
    data: null,
  });
});

router.post("/store/video", async function (req, res, next) {
  res.status(500).json({
    success: false,
    message: "Route belum di implementasikan!",
    data: null,
  });
});

router.post("/store/image", async function (req, res, next) {
  res.status(500).json({
    success: false,
    message: "Route belum di implementasikan!",
    data: null,
  });
});

router.post(
  "/store/audio",
  upload.fields([{ name: "audio", maxCount: 1 }]),
  async function (req, res, next) {
    res.status(500).json({
      success: false,
      message: "Route belum di implementasikan!",
      data: null,
    });
  }
);

router.patch(
  "/update/:id",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  async function (req, res, next) {
    res.status(500).json({
      success: false,
      message: "Route belum di implementasikan!",
      data: null,
    });
  }
);

router.delete("/delete/:id", async function (req, res, next) {
  res.status(500).json({
    success: false,
    message: "Route belum di implementasikan!",
    data: null,
  });
});

router.patch("/restore/:id", async function (req, res, next) {
  res.status(500).json({
    success: false,
    message: "Route belum di implementasikan!",
    data: null,
  });
});

router.delete("/purge/:id", async function (req, res, next) {
  res.status(500).json({
    success: false,
    message: "Route belum di implementasikan!",
    data: null,
  });
});

module.exports = router;
