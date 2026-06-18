const jwt = require("jsonwebtoken");

function authMiddleware(
  req,
  res,
  next
) {
  try {
    const token =
      req.headers.authorization;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}

module.exports = authMiddleware;