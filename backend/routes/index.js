var express = require('express');
var router = express.Router();

/* GET index. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    message: "Api Media Player v1",
    success: true,
    data: null,
  });
});

module.exports = router;
