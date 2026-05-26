const jwt = require("jsonwebtoken");

const authMiddleware = (
  req,
  res,
  next
) => {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({

        message: "No token provided"

      });

    }

    // EXTRACT TOKEN
    const token =
      authHeader.split(" ")[1];

    // VERIFY TOKEN
    const decoded = jwt.verify(

      token,

      "accesssecretkey"

    );

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({

      message: "Token expired"

    });

  }
};

module.exports = authMiddleware;