import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import Booking from '../models/BookingSchema.js';
import Stripe from 'stripe';
import { sendEmail } from '../Services/emailService.js';
import { bookingSuccessEmailDoctor, bookingSuccessEmailUser } from '../emailContents/mailContents.js';

// 1. Create a new booking directly from the dashboard form
export const createBooking = async (req, res) => {
    try {
        const bookingData = {
            patientName: req.body.patientName || `${req.body.firstName || ""} ${req.body.lastName || ""}`.trim(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobile: req.body.mobile,
            gender: req.body.gender,
            address: req.body.address,
            appointmentDate: req.body.date || req.body.appointmentDate,
            appointmentTime: req.body.time || `${req.body.startTime || ""} - ${req.body.endTime || ""}`.trim(),
            consultingDoctor: req.body.consultingDoctor || req.body.doctorName,
            treatment: req.body.treatment || "General Consultation",
            notes: req.body.notes,
            user: req.userId || req.body.userId || null,
            doctor: req.body.doctorId || null,
            status: "pending",
            isPaid: false,
            ...req.body
        };

        const newBooking = new Booking(bookingData);
        const savedBooking = await newBooking.save();

        res.status(200).json({
            success: true,
            message: "Appointment saved successfully to database!",
            data: savedBooking,
        });
    } catch (err) {
        console.error("Error creating booking in database:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to save appointment to database.",
        });
    }
};

// 2. Get all bookings for the appointment list
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (err) {
        console.error("Error fetching bookings:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch appointments from database.",
        });
    }
};

// 3. Create Stripe Checkout Session
export const getCheckoutSession = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.doctorId);
        const user = await User.findById(req.userId);

        if (!doctor || !user) {
            return res.status(404).json({ success: false, message: 'Doctor or User not found' });
        }

        const { appointmentDate, appointmentTime, firstName, lastName, mobile, email, address, treatment, notes } = req.body;

        const existingBookingsCount = await Booking.countDocuments({
            doctor: doctor._id,
            appointmentDate: {
                $gte: new Date(appointmentDate).setHours(0, 0, 0, 0),
                $lt: new Date(appointmentDate).setHours(23, 59, 59, 999),
            }
        });

        if (existingBookingsCount >= 10) {
            return res.status(400).json({ success: false, message: 'Appointment slots for this date are fully booked.' });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
            cancel_url: `${req.protocol}://${req.get('host')}/doctors/${doctor._id}`,
            customer_email: user.email,
            client_reference_id: req.params.doctorId,
            line_items: [{
                price_data: {
                    currency: 'inr',
                    unit_amount: doctor.ticketPrice * 100,
                    product_data: {
                        name: doctor.name,
                        description: doctor.bio || 'Consultation',
                        images: doctor.photo ? [doctor.photo] : []
                    },
                },
                quantity: 1
            }],
            billing_address_collection: 'auto',
            shipping_address_collection: {
                allowed_countries: ['IN']
            }
        });

        const booking = new Booking({
            doctor: doctor._id,
            user: user._id,
            patientName: `${firstName || user.name || ""} ${lastName || ""}`.trim(),
            firstName,
            lastName,
            mobile: mobile || user.phone,
            email: email || user.email,
            address,
            treatment: treatment || "General Consultation",
            notes,
            ticketPrice: doctor.ticketPrice,
            status: 'pending',
            isPaid: false,
            session: session.id,
            appointmentDate,
            appointmentTime
        });

        await booking.save();

        try {
            await sendEmail({
                to: doctor.email,
                subject: 'New Booking Notification',
                html: bookingSuccessEmailDoctor(doctor.name, user.name, appointmentDate, appointmentTime)
            });

            await sendEmail({
                to: user.email,
                subject: 'Booking Confirmation',
                html: bookingSuccessEmailUser(doctor.name, user.name, appointmentDate, appointmentTime)
            });
        } catch (emailErr) {
            console.error("Email notification error:", emailErr.message);
        }

        res.status(200).json({ success: true, message: 'Successfully Paid / Session Created', session });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ success: false, message: error.message || 'Error creating checkout session' });
    }
};