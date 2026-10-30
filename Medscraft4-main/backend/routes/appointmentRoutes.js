
const express = require("express");
const router = express.Router();

const appointmentController = require("../controllers/appointmentController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// All appointment routes require authentication
router.use(auth);

// GET: Fetch all appointments
router.get(
  "/",
  role(["Doctor", "Admin"]),
  appointmentController.getAppointments
);

// POST: Create an appointment
router.post(
  "/",
  role(["Doctor"]),
  appointmentController.createAppointment
);

// GET: Fetch one appointment by ID
router.get(
  "/:id",
  role(["Doctor", "Admin"]),
  appointmentController.getAppointment
);

// PUT: Update an appointment
router.put(
  "/update/:id",
  role(["Doctor"]),
  appointmentController.updateAppointment
);

// DELETE: Delete an appointment
router.delete(
  "/delete/:id",
  role(["Doctor"]),
  appointmentController.deleteAppointment
);

// GET: Render create appointment page (if using server-rendered views)
router.get(
  "/create",
  role(["Doctor"]),
  (req, res) => {
    res.render("createAppointment", {
      csrfToken: req.csrfToken()
    });
  }
);

// GET: Render update appointment page
router.get(
  "/update/:id",
  role(["Doctor"]),
  async (req, res) => {
    try {
      const appointment =
        await appointmentController.getAppointmentById(req.params.id);

      if (!appointment) {
        return res.status(404).send("Appointment not found");
      }

      return res.render("updateAppointment", {
        appointment,
        csrfToken: req.csrfToken()
      });
    } catch (error) {
      console.error("Error loading appointment:", error);
      return res.status(500).send("Server error");
    }
  }
);

// GET: Render delete confirmation page
router.get(
  "/delete/:id",
  role(["Doctor", "Admin"]),
  async (req, res) => {
    try {
      const appointment =
        await appointmentController.getAppointmentById(req.params.id);

      if (!appointment) {
        return res.status(404).send("Appointment not found");
      }

      return res.render("deleteAppointment", {
        appointment,
        csrfToken: req.csrfToken()
      });
    } catch (error) {
      console.error("Error loading appointment:", error);
      return res.status(500).send("Server error");
    }
  }
);

module.exports = router;
