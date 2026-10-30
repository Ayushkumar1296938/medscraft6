
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";

// CREATE DOCTOR
export const createDoctor = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      phone,
      specialization,
      bio,
      ticketPrice
    } = req.body;

    if (!email || !password || !name || !specialization) {
      return res.status(400).json({
        success: false,
        message: "Email, password, name and specialization are required."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingDoctor = await Doctor.findOne({
      email: normalizedEmail
    });

    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: "Doctor with this email already exists."
      });
    }

    const newDoctor = new Doctor({
      email: normalizedEmail,
      password,
      name: name.trim(),
      phone,
      specialization,
      bio,
      ticketPrice: ticketPrice || 100,
      isApproved: "pending"
    });

    await newDoctor.save();

    const safeDoctor = await Doctor.findById(newDoctor._id)
      .select("-password");

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully and is pending approval.",
      data: safeDoctor
    });
  } catch (error) {
    console.error("Create doctor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create doctor.",
      error: error.message
    });
  }
};

// UPDATE DOCTOR
export const updateDoctor = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "phone",
      "specialization",
      "bio",
      "ticketPrice"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully.",
      data: doctor
    });
  } catch (error) {
    console.error("Update doctor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update doctor.",
      error: error.message
    });
  }
};

// DELETE DOCTOR
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully."
    });
  } catch (error) {
    console.error("Delete doctor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete doctor.",
      error: error.message
    });
  }
};

// GET SINGLE DOCTOR
export const getSingleDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("reviews")
      .select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor found.",
      data: doctor
    });
  } catch (error) {
    console.error("Get doctor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve doctor.",
      error: error.message
    });
  }
};

// GET ALL APPROVED DOCTORS
export const getAllDoctor = async (req, res) => {
  try {
    const { query } = req.query;

    const filter = {
      isApproved: "approved"
    };

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { specialization: { $regex: query, $options: "i" } }
      ];
    }

    const doctors = await Doctor.find(filter)
      .select("-password")
      .sort({ averageRating: -1 });

    return res.status(200).json({
      success: true,
      message: "Doctors found.",
      data: doctors
    });
  } catch (error) {
    console.error("Get all doctors error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve doctors.",
      error: error.message
    });
  }
};

// GET UNAPPROVED DOCTORS
export const unapprovedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({
      isApproved: "pending"
    }).select("-password");

    return res.status(200).json({
      success: true,
      message: "Pending doctors retrieved.",
      data: doctors
    });
  } catch (error) {
    console.error("Get pending doctors error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve pending doctors.",
      error: error.message
    });
  }
};

// APPROVE DOCTOR
export const approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $set: { isApproved: "approved" } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor approved.",
      data: doctor
    });
  } catch (error) {
    console.error("Approve doctor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve doctor.",
      error: error.message
    });
  }
};

// REJECT DOCTOR
export const rejectDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $set: { isApproved: "rejected" } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor rejected.",
      data: doctor
    });
  } catch (error) {
    console.error("Reject doctor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject doctor.",
      error: error.message
    });
  }
};

// GET DOCTOR PROFILE
export const getDoctorProfile = async (req, res) => {
  try {
    const userId = req.userId || req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID missing from authentication."
      });
    }

    const doctor = await Doctor.findById(userId)
      .select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found."
      });
    }

    const appointments = await Booking.find({
      doctor: userId
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Doctor profile found.",
      data: {
        ...doctor.toObject(),
        appointments
      }
    });
  } catch (error) {
    console.error("Doctor profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve doctor profile.",
      error: error.message
    });
  }
};

// SEARCH DOCTORS
export const searchDoctor = async (req, res) => {
  try {
    const { query } = req.query;

    const filter = {
      isApproved: "approved"
    };

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { specialization: { $regex: query, $options: "i" } }
      ];
    }

    const doctors = await Doctor.find(filter)
      .select("-password");

    return res.status(200).json({
      success: true,
      message: "Doctors found.",
      data: doctors
    });
  } catch (error) {
    console.error("Search doctors error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search doctors.",
      error: error.message
    });
  }
};
