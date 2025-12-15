import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import toast from 'react-hot-toast';
import {
  Loader2,
  CreditCard,
  Lock,
  CheckCircle,
  ArrowLeft,
  Ticket,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
} from 'lucide-react';

// Load Stripe (will fetch publishable key from backend)
let stripePromise = null;

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeStripe();
    fetchBooking();
  }, [bookingId]);

  const initializeStripe = async () => {
    try {
      const response = await paymentService.getStripeConfig();
      stripePromise = loadStripe(response.data.publishableKey);
    } catch (error) {
      console.error('Failed to load Stripe:', error);
      toast.error('Payment system unavailable');
    }
  };

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getBookingById(bookingId);
      const bookingData = response.data.booking;

      // Validate booking can be paid
      if (bookingData.status !== 'accepted') {
        toast.error('This booking cannot be paid yet');
        navigate('/dashboard/my-bookings');
        return;
      }

      if (bookingData.paymentStatus === 'paid') {
        toast.error('This booking is already paid');
        navigate('/dashboard/my-bookings');
        return;
      }

      // Check if expired
      const departureDateTime = new Date(bookingData.ticketSnapshot.departureDate);
      const [hours, minutes] = bookingData.ticketSnapshot.departureTime.split(':');
      departureDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      if (departureDateTime < new Date()) {
        toast.error('Cannot pay for expired ticket');
        navigate('/dashboard/my-bookings');
        return;
      }

      setBooking(bookingData);
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Failed to load booking details');
      navigate('/dashboard/my-bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stripePromise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/dashboard/my-bookings')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to My Bookings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Details</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Ticket</label>
                <p className="font-semibold text-gray-800">{booking.ticketSnapshot.title}</p>
              </div>

              <div className="flex items-center text-gray-700">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span>
                  {booking.ticketSnapshot.fromLocation} → {booking.ticketSnapshot.toLocation}
                </span>
              </div>

              <div className="flex items-center text-gray-700">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span>
                  {new Date(booking.ticketSnapshot.departureDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center text-gray-700">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <span>{booking.ticketSnapshot.departureTime}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <Ticket className="w-4 h-4 mr-2 text-gray-400" />
                <span>{booking.bookingQuantity} tickets</span>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Price per ticket:</span>
                  <span className="font-semibold">৳{booking.ticketSnapshot.unitPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-semibold">×{booking.bookingQuantity}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800">
                      Total Amount:
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      ৳{booking.totalPrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Payment</h2>
              <Lock className="w-5 h-5 text-green-600" />
            </div>

            <Elements stripe={stripePromise}>
              <CheckoutForm booking={booking} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutForm = ({ booking }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Create payment intent
      const intentResponse = await paymentService.createPaymentIntent(booking._id);

      // Step 2: Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        intentResponse.data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        toast.error(stripeError.message);
        setLoading(false);
        return;
      }

      // Step 3: Confirm payment on backend
      await paymentService.confirmPayment(booking._id, paymentIntent.id);

      // Success!
      setPaymentSuccess(true);
      toast.success('Payment successful! 🎉');

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard/my-bookings');
      }, 2000);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-4">Your booking is confirmed.</p>
        <p className="text-sm text-gray-500">Redirecting to your bookings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <CreditCard className="w-4 h-4 inline mr-1" />
          Card Details
        </label>
        <div className="p-4 border border-gray-300 rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Lock className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Secure Payment</p>
            <p>Your payment information is encrypted and secure.</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay ৳${booking.totalPrice}`
        )}
      </button>

      <p className="text-xs text-center text-gray-500">
        Test Card: 4242 4242 4242 4242 | Exp: Any future date | CVC: Any 3 digits
      </p>
    </form>
  );
};

export default PaymentPage;