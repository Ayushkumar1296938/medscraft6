
import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
    },

    photo: {
      type: String,
    },

    ticketPrice: {
      type: Number,
      default: 100,
    },

    role: {
      type: String,
      enum: ["doctor", "admin"],
      default: "doctor",
      lowercase: true,
      trim: true,
    },

    specialization: {
      type: String,
    },

    qualifications: {
      type: Array,
      default: [],
    },

    experiences: {
      type: Array,
      default: [],
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    bio: {
      type: String,
      maxlength: 50,
    },

    about: {
      type: String,
    },

    timeSlots: {
      type: Array,
      default: [],
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    averageRating: {
      type: Number,
      default: 0,
    },

    totalRating: {
      type: Number,
      default: 0,
    },

    isApproved: {
      type: String,
      enum: ["pending", "approved", "cancelled", "rejected"],
      default: "pending",
    },

    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", DoctorSchema);
