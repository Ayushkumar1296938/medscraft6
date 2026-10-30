import express from 'express';
import { authenticate } from '../auth/verifyToken.js';
import { 
    getCheckoutSession, 
    createBooking, 
    getAllBookings 
} from '../Controllers/bookingController.js';

const router = express.Router();

// 1. Routes for general booking management & dashboard creation
router.route('/')
    .get(authenticate, getAllBookings)
    .post(authenticate, createBooking);

// 2. Route for Stripe payment checkout sessions
router.post('/checkout-session/:doctorId', authenticate, getCheckoutSession);

export default router;