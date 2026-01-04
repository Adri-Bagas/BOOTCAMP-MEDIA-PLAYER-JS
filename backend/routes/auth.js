var express = require("express");
var router = express.Router();

// DISCLAIMER: UNTUK PARA PESERTA BOOTCAMP JANGAN PERNAH PAKE CARA INI BUAT APLIKASI KALIAN,
// CUMA BUAT LATIHAN DOANG!!!

/* POST login. */
router.post("/login", function (req, res, next) {
  const { password } = req.body;
  const SECRET = process.env.SUPER_SECRET_PASSPRASE_TEHEE;

  if (!SECRET) {
    res.status(501).json({
      message: "Secret password belum dibuat!",
      success: false,
      data: null,
    });
  }

  if (password === SECRET) {
    const SECRET_KEY = process.env.SUPER_SECRET_KEY;

    if (!SECRET_KEY) {
      res.status(501).json({
        message: "Secret key belum dibuat!",
        success: false,
        data: null,
      });
    }

    res.cookie("x-a-very-secret-key", SECRET_KEY, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Anda berhasil login!",
      data: null,
    });
  }

  res.status(401).json({
    message: "Password salah!",
    success: false,
    data: null,
  });
});

/* POST logout. */
router.post("/logout", function (req, res, next) {
  res.clearCookie("x-a-very-secret-key");

  return res.status(200).json({
    success: true,
    message: "Anda berhasil Logout!",
    data: null,
  });
});

module.exports = router;
