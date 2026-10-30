
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

// 1. Verify JWT token
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing.",
      });
    }

    const jwtSecret =
      process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("JWT secret is not configured.");

      return res.status(500).json({
        success: false,
        message: "Authentication service is not configured.",
      });
    }

    const decoded = jwt.verify(token, jwtSecret);

    // Support tokens containing either id or _id
    const userId = decoded.id || decoded._id;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload: valid user ID is missing.",
      });
    }

    req.userId = String(userId);
    req.role = decoded.role || null;
    req.user = decoded;

    return next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          error.name === "TokenExpiredError"
            ? "Your session has expired. Please log in again."
            : "Invalid authentication token.",
      });
    }

    console.error("Authentication error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

// 2. Check user's role against the database
export const restrict = (roles = []) => async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Please authenticate before accessing this resource.",
      });
    }

    if (!Array.isArray(roles) || roles.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Access roles are not configured.",
      });
    }

    const allowedRoles = roles.map((role) =>
      String(role).trim().toLowerCase()
    );

    // Find the account in either collection
    let account = await User.findById(req.userId).select("_id role");

    if (!account) {
      account = await Doctor.findById(req.userId).select("_id role");
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    const actualRole = String(account.role || "")
      .trim()
      .toLowerCase();

    console.log("Authorization check:", {
      userId: String(account._id),
      actualRole,
      allowedRoles,
    });

    if (!allowedRoles.includes(actualRole)) {
      return res.status(403).json({
        success: false,
        message: `You are not authorized to access this resource. Role: ${
          actualRole || "missing"
        }`,
      });
    }

    req.user = account;
    req.role = actualRole;

    return next();
  } catch (error) {
    console.error("Authorization middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify user permissions.",
    });
  }
};
