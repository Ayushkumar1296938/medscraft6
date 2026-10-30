
import express from "express";

import {
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAllDoctor,
  getSingleDoctor,
  getDoctorProfile,
  searchDoctor,
  unapprovedDoctors,
  approveDoctor,
  rejectDoctor,
} from "../Controllers/doctorController.js";

import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRouter from "./review.js";

const router = express.Router();

// Doctor reviews
router.use("/:doctorId/reviews", reviewRouter);

// Create doctor
router.post(
  "/",
  authenticate,
  restrict(["Admin", "admin", "Doctor", "doctor"]),
  createDoctor
);

// Specific GET routes must come before /:id
router.get(
  "/unapproved",
  authenticate,
  restrict(["Admin", "admin"]),
  unapprovedDoctors
);

router.get("/searchresult", searchDoctor);

router.get(
  "/profile/me",
  authenticate,
  restrict(["doctor", "Doctor"]),
  getDoctorProfile
);

// List doctors
router.get("/", getAllDoctor);

// Approve and reject
router.put(
  "/approve/:id",
  authenticate,
  restrict(["Admin", "admin"]),
  approveDoctor
);

router.put(
  "/reject/:id",
  authenticate,
  restrict(["Admin", "admin"]),
  rejectDoctor
);

// Single doctor
router.get("/:id", getSingleDoctor);

// Update doctor
router.put(
  "/:id",
  authenticate,
  restrict(["doctor", "Doctor"]),
  updateDoctor
);

// Delete doctor
router.delete(
  "/:id",
  authenticate,
  restrict(["doctor", "Doctor"]),
  deleteDoctor
);

export default router;
