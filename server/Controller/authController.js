const jwt = require("jsonwebtoken");

// ==========================
// ACCESS TOKEN
// ==========================

const generateAccessToken = (email) => {

  return jwt.sign(

    { email },

    "accesssecretkey",

    { expiresIn: "5s" }

  );
};

// ==========================
// REFRESH TOKEN
// ==========================

const generateRefreshToken = (email) => {

  return jwt.sign(

    { email },

    "refreshsecretkey",

    { expiresIn: "7d" }

  );
};

// ==========================
// LOGIN
// ==========================

const loginAdmin = async (req, res) => {

  try {

    const { email, password } = req.body;

   if (
  (
    email === "admin@gmail.com" ||
    email === "user@gmail.com"
  ) &&
  password === "12345"
) {

      // CREATE TOKENS
      const accessToken =
        generateAccessToken(email);

      const refreshToken =
        generateRefreshToken(email);

      // SAVE REFRESH TOKEN IN COOKIE
      res.cookie(
        "refreshToken", //This saves refresh token in browser cookie."refreshToken" is the cookie name.
        refreshToken,
        {
          httpOnly: true, //JavaScript cannot access cookie.
          secure: false, //Cookie works on HTTP, true if its https
          sameSite: "strict"
        }
      );

      // SEND ACCESS TOKEN
      return res.json({

        accessToken,

        message: "Login successful"

      });
    }

    res.status(401).json({
      message: "Invalid credentials"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// ==========================
// REFRESH TOKEN API
// ==========================

const refreshToken = (req, res) => {

  try {

    // GET COOKIE
    const token =
      req.cookies.refreshToken;

    // NO TOKEN
    if (!token) {

      return res.status(401).json({
        message: "No refresh token"
      });

    }

    // VERIFY REFRESH TOKEN
    const decoded = jwt.verify(

      token,

      "refreshsecretkey"

    );

    // CREATE NEW ACCESS TOKEN
    const newAccessToken =
      generateAccessToken(decoded.email);

    // SEND NEW ACCESS TOKEN
    res.json({

      accessToken: newAccessToken

    });

  } catch (error) {

    res.status(403).json({
      message: "Invalid refresh token"
    });

  }
};

// ==========================
// LOGOUT
// ==========================

const logoutAdmin = (req, res) => {

  res.clearCookie("refreshToken");

  res.json({
    message: "Logout successful"
  });
};

module.exports = {
  loginAdmin,
  refreshToken,
  logoutAdmin
};