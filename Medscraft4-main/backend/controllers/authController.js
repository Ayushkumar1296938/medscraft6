
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendEmail } from "../Services/emailService.js";
import { succesRegistration } from "../emailContents/mailContents.js";
import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";

// ==================== GENERATE TOKEN ====================
const generateToken = (user) => {
  const jwtSecret =
    process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET_KEY or JWT_SECRET is missing in .env");
  }

  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    jwtSecret,
    { expiresIn: "15d" }
  );
};

// ==================== REGISTER ====================
export const register = async (req, res) => {
  console.log("REGISTER ROUTE HIT");

  try {
    const name =
      typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const password =
      typeof req.body?.password === "string" ? req.body.password : "";
    const role =
      typeof req.body?.role === "string"
        ? req.body.role.trim().toLowerCase()
        : "";

    const { photo, gender } = req.body || {};

    console.log("========== REGISTER DEBUG ==========");
    console.log("Database:", User.db.name);
    console.log("User collection:", User.collection.name);
    console.log("Doctor collection:", Doctor.collection.name);
    console.log("Name provided:", Boolean(name));
    console.log("Email provided:", Boolean(email));
    console.log("Role:", role || "Missing");

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    if (!["patient", "doctor"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Use patient or doctor.",
      });
    }

    const [existingUser, existingDoctor] = await Promise.all([
      User.findOne({ email }),
      Doctor.findOne({ email }),
    ]);

    if (existingUser || existingDoctor) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const Model = role === "patient" ? User : Doctor;
    const hashedPassword = await bcrypt.hash(password, 10);

    const account = new Model({
      name,
      email,
      password: hashedPassword,
      photo,
      gender,
      role,
    });

    await account.save();

    console.log("Registration successful.");
    console.log("Saved collection:", Model.collection.name);
    console.log("Saved account ID:", account._id.toString());
    console.log("Saved email:", account.email);

    let emailSent = true;

    try {
      const clientUrl = process.env.CLIENT_SITE_URL;

      if (!clientUrl) {
        throw new Error("CLIENT_SITE_URL is missing in .env");
      }

      await sendEmail({
        to: email,
        subject: "Confirm Your Email, Team Doccure",
        html: succesRegistration(
          name,
          email,
          `${clientUrl.replace(/\/+$/, "")}/confirm_email/${account._id}`
        ),
      });
    } catch (emailError) {
      emailSent = false;
      console.error("Registration email error:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: emailSent
        ? "Account created. Please check your email to verify it."
        : "Account created, but verification email could not be sent. Check backend email configuration.",
      emailSent,
    });
  } catch (error) {
    console.error("========== REGISTRATION ERROR ==========");
    console.error(error);
    console.error("========================================");

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed. Check the backend terminal.",
    });
  }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
  try {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const password =
      typeof req.body?.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required.",
      });
    }

    const [patient, doctor] = await Promise.all([
      User.findOne({ email }),
      Doctor.findOne({ email }),
    ]);

    const user = patient || doctor;

    console.log("========== LOGIN DEBUG ==========");
    console.log("Database:", User.db.name);
    console.log("User collection:", User.collection.name);
    console.log("Doctor collection:", Doctor.collection.name);
    console.log("User account found:", Boolean(patient));
    console.log("Doctor account found:", Boolean(doctor));
    console.log(
      "Stored password looks like bcrypt hash:",
      /^\$2[aby]\$\d{2}\$/.test(user?.password || "")
    );

    if (!user) {
      console.log("Login failed: account not found.");
      return res.status(401).json({
        status: false,
        message: "Invalid email or password.",
      });
    }

    if (typeof user.password !== "string" || !user.password) {
      return res.status(500).json({
        status: false,
        message: "Account password is not configured. Contact support.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("Password matched:", isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        status: false,
        message: "Please Verify Your Email.",
      });
    }

    const token = generateToken(user);
    const userData = user.toObject();

    delete userData.password;
    delete userData.__v;

    return res.status(200).json({
      status: true,
      message: "Successfully Login",
      token,
      data: userData,
      role: user.role,
      userId: user._id.toString(),
      isPremiumUser: user.isPremiumUser ?? false,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed To Login. Check backend terminal.",
    });
  }
};

// ==================== CONFIRM EMAIL ====================
export const confirmEmail = async (req, res) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findById(verificationToken);
    const doctor = await Doctor.findById(verificationToken);

    if (!user && !doctor) {
      return res.status(404).json({
        success: false,
        message: "No user found.",
      });
    }

    if (user && !user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }

    if (doctor && !doctor.emailVerified) {
      doctor.emailVerified = true;
      await doctor.save();
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to verify email. Check the verification link.",
    });
  }
};
