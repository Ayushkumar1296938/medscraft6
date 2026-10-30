import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import authRoute from "./Routes/auth.js";
import bookingRoute from "./Routes/booking.js";
import userRoute from "./Routes/user.js";
import doctorRoute from "./Routes/doctor.js";
import reviewRoute from "./Routes/review.js";
import chatRoute from "./Routes/message.js";
import insightRoute from "./Routes/insight.js";
import prescriptionRoute from "./Routes/prescription.js";
import patientRoute from "./Routes/patient.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8000;

// CORS configuration - allow all origins for API & credentials
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

// Database state tracking
let isDbConnected = false;
let dbErrorDetails = null;

// Health & Status Endpoints
const getHealthStatus = () => ({
  status: "online",
  service: "Doccure-MERN Backend API",
  database: isDbConnected ? "connected" : "disconnected",
  dbError: dbErrorDetails || undefined,
  timestamp: new Date().toISOString(),
  env: process.env.NODE_ENV || "development"
});

app.get("/", (req, res) => {
  res.status(200).json(getHealthStatus());
});

app.get("/health", (req, res) => {
  res.status(200).json(getHealthStatus());
});

app.get("/api/v1/health", (req, res) => {
  res.status(200).json(getHealthStatus());
});

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(cors(corsOptions));

// ==========================================
// 1. REGISTER API ROUTES FIRST (Crucial Fix)
// ==========================================
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/doctors", doctorRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/bookings", bookingRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/insights", insightRoute);
app.use("/api/v1/prescriptions", prescriptionRoute);
app.use("/api/v1/patients", patientRoute);

// ==========================================
// 2. SAFE CONDITIONAL STATIC FRONTEND SERVING
// ==========================================
const frontendDistPath = path.join(__dirname, "../Frontend/dist");
const frontendBuildPath = path.join(__dirname, "../Frontend/build");

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
} else {
  app.use((req, res, next) => {
    if (req.originalUrl.startsWith("/api/")) {
      return next();
    }
    res.status(200).send("Backend is running in API mode. Use Frontend dev server (npm start) for UI.");
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

// MongoDB Connection
mongoose.set("strictQuery", false);

mongoose.connection.on("connected", () => {
  isDbConnected = true;
  dbErrorDetails = null;
  console.log("✅ MongoDB database is connected successfully");
});

mongoose.connection.on("error", (err) => {
  isDbConnected = false;
  dbErrorDetails = err.message;
  console.error("❌ MongoDB connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  isDbConnected = false;
  console.warn("⚠️ MongoDB disconnected");
});

const connectDB = async () => {
  const dbUri =
    process.env.DB_URL ||
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL;

  if (!dbUri) {
    dbErrorDetails = "No database connection string found in environment variables.";
    console.warn("⚠️ Warning:", dbErrorDetails);
    return;
  }

  try {
    console.log("Attempting MongoDB connection...");
    await mongoose.connect(dbUri);
    isDbConnected = true;
    dbErrorDetails = null;
    console.log("✅ MongoDB database is connected");
  } catch (err) {
    isDbConnected = false;
    dbErrorDetails = err.message;
    console.error("❌ MongoDB connection failed:", err.message);
  }
};

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Doccure-MERN server is running on port: ${port}`);
  connectDB();
});