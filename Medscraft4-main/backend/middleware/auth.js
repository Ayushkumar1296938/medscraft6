
import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  try {
    // 1. Token Authorization header se lo
    const authHeader = req.headers.authorization;

    // Bearer token ko support karo; existing cookie bhi accept hogi
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please log in first.",
      });
    }

    // 2. Wahi secret use karo jo login controller use karta hai
    const jwtSecret =
      process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("JWT_SECRET_KEY or JWT_SECRET is missing.");

      return res.status(500).json({
        success: false,
        message: "Authentication is not configured.",
      });
    }

    // 3. Token verify karo
    const decoded = jwt.verify(token, jwtSecret);

    // 4. User details request mein attach karo
    const userId = decoded.id || decoded._id || decoded.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token: user ID is missing.",
      });
    }

    req.user = decoded;
    req.userId = userId;
    req.role = decoded.role;

    // 5. Next route/controller execute karo
    return next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          error.name === "TokenExpiredError"
            ? "Session expired. Please log in again."
            : "Invalid token. Please log in again.",
      });
    }

    console.error("Authentication error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Authentication failed.",
    });
  }
}
