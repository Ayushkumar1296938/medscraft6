
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const sendMail = require('../utils/mailer');

// CREATE APPOINTMENT
exports.createAppointment = async (req, res) => {
  try {
    console.log('Current User Role:', req.user?.role);
    console.log('Current User ID:', req.user?.userId);

    const { patientName, doctorName, date, reason } = req.body;

    // Validate required fields
    if (!patientName || !doctorName || !date) {
      return res.status(400).json({
        success: false,
        message: 'Patient name, doctor name and date are required.'
      });
    }

    // Only doctors can create appointments
    if (req.user?.role !== 'Doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only doctors can create appointments.'
      });
    }

    // Find patient
    const patient = await User.findOne({
      username: patientName.trim(),
      role: 'Patient'
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found. Check the exact username.'
      });
    }

    // Find doctor
    const doctor = await User.findOne({
      username: doctorName.trim(),
      role: 'Doctor'
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found. Check the exact username.'
      });
    }

    // Validate date
    const appointmentDate = new Date(date);

    if (Number.isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment date.'
      });
    }

    // Save appointment in MongoDB
    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
      date: appointmentDate,
      reason: reason || ''
    });

    // Return populated appointment for React
    const savedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'username email')
      .populate('doctor', 'username email');

    // Send email without failing the appointment request
    if (patient.email) {
      try {
        await sendMail(
          patient.email,
          'New Appointment',
          `You have a new appointment with Dr. ${doctor.username} on ${appointmentDate.toLocaleString()}.`
        );
      } catch (emailError) {
        console.error('Appointment saved, but email failed:', emailError);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Appointment created successfully.',
      appointment: savedAppointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create appointment.',
      error: error.message
    });
  }
};


// GET APPOINTMENTS
exports.getAppointments = async (req, res) => {
  try {
    const filter = {};

    // Doctors see their own appointments.
    // Admins see all appointments.
    if (req.user?.role === 'Doctor') {
      const doctorId = req.user.userId || req.user.id || req.user._id;

      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor ID is missing from the authenticated user.'
        });
      }

      filter.doctor = doctorId;
    } else if (req.user?.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'username email')
      .populate('doctor', 'username email')
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error('Get appointments error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments.'
    });
  }
};


// GET SINGLE APPOINTMENT
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'username email')
      .populate('doctor', 'username email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    // Restrict doctors to their own appointments.
    if (req.user?.role === 'Doctor') {
      const doctorId = req.user.userId || req.user.id || req.user._id;

      if (String(appointment.doctor?._id) !== String(doctorId)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied.'
        });
      }
    } else if (req.user?.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    return res.status(200).json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error('Get appointment error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment.'
    });
  }
};


// HELPER FOR EXISTING EJS VIEW ROUTES
exports.getAppointmentById = async (id) => {
  return Appointment.findById(id)
    .populate('patient', 'username email')
    .populate('doctor', 'username email');
};


// UPDATE APPOINTMENT
exports.updateAppointment = async (req, res) => {
  try {
    const { patient, doctor, date, reason } = req.body;

    if (!patient || !doctor || !date) {
      return res.status(400).json({
        success: false,
        message: 'Patient, doctor and date are required.'
      });
    }

    const appointmentDate = new Date(date);

    if (Number.isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment date.'
      });
    }

    const foundPatient = await User.findOne({
      username: patient.trim(),
      role: 'Patient'
    });

    if (!foundPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.'
      });
    }

    const foundDoctor = await User.findOne({
      username: doctor.trim(),
      role: 'Doctor'
    });

    if (!foundDoctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.'
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        patient: foundPatient._id,
        doctor: foundDoctor._id,
        date: appointmentDate,
        reason: reason || ''
      },
      {
        new: true,
        runValidators: true
      }
    )
      .populate('patient', 'username email')
      .populate('doctor', 'username email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment updated successfully.',
      appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update appointment.'
    });
  }
};


// DELETE APPOINTMENT
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    // Doctors can delete only their own appointments.
    if (req.user?.role === 'Doctor') {
      const doctorId = req.user.userId || req.user.id || req.user._id;

      if (String(appointment.doctor) !== String(doctorId)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied.'
        });
      }
    } else if (req.user?.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully.'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete appointment.'
    });
  }
};
