const express = require("express");

const router = express.Router();

const {
  loginAdmin,
  refreshToken,
  logoutAdmin
} = require("../Controller/authController");

// LOGIN
router.post(
  "/login",
  loginAdmin
);

// REFRESH TOKEN
router.post(
  "/refresh",
  refreshToken
);

// LOGOUT
router.post(
  "/logout",
  logoutAdmin
);

module.exports = router;