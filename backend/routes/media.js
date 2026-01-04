var express = require('express');
var router = express.Router();

/* GET all media. */
router.get('/', function(req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null
  });
});

/* GET all video. */
router.get('/videos', function(req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null
  });
});

/* POST videos. */
router.post('/videos', function(req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null
  });
});

/* UPDATE a videos. */
router.put('/videos/:id', function(req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null
  });
});

/* DELETE a videos. */
router.delete("/videos/:id", function (req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null
  });
});

/* GET all photos. */
router.get('/photos', function(req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null
  });
});

/* POST photos. */
router.post("/photos", function (req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null,
  });
});

/* UPDATE a photos. */
router.put("/photos/:id", function (req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null,
  });
});

/* DELETE a photos. */
router.delete("/photos/:id", function (req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null,
  });
});

/* GET all audios. */
router.get('/audios', function(req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null
  });
});

/* POST audios. */
router.post("/audios", function (req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null,
  });
});

/* UPDATE a audios. */
router.put("/audios/:id", function (req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null,
  });
});

/* DELETE a audios. */
router.delete("/audios/:id", function (req, res, next) {
  res.status(501).json({
    message: "Route belum di implementasi!",
    success: false,
    data: null,
  });
});


module.exports = router;
