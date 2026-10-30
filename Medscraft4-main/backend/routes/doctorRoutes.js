import express from 'express';
import {
  createDoctor,
  getDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorById
} from '../Controllers/doctorController.js';
import { authenticate, restrict } from '../auth/verifyToken.js';

const router = express.Router();

// ==========================
// View Routes (If using server-rendered templates)
// ==========================

router.get('/create', authenticate, restrict(['Admin', 'Doctor']), (req, res) => {
  res.render('createDoctor');
});

router.get('/update/:id', authenticate, restrict(['Admin', 'Doctor']), async (req, res) => {
  try {
    const doctor = await getDoctorById(req.params.id);
    if (!doctor) {
      return res.status(404).render('error', { message: 'Doctor not found' });
    }
    res.render('updateDoctor', { doctor });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Server Error' });
  }
});

router.get('/delete/:id', authenticate, restrict(['Admin', 'Doctor']), async (req, res) => {
  try {
    const doctor = await getDoctorById(req.params.id);
    if (!doctor) {
      return res.status(404).render('error', { message: 'Doctor not found' });
    }
    res.render('deleteDoctor', { doctor });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Server Error' });
  }
});

// ==========================
// API Routes
// ==========================

// Allow both Admin and Doctor roles to create new doctors from the UI form
router.post('/', authenticate, restrict(['Admin', 'Doctor']), createDoctor);

router.get('/', authenticate, restrict(['Doctor', 'Admin']), getDoctors);
router.get('/:id', authenticate, restrict(['Doctor', 'Admin']), getDoctor);
router.put('/:id', authenticate, restrict(['Admin', 'Doctor']), updateDoctor);
router.delete('/:id', authenticate, restrict(['Admin', 'Doctor']), deleteDoctor);

export default router;