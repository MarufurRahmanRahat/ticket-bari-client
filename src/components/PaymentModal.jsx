import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

// Load Stripe (get publishable key from backend)
const stripePromise = loadStripe('pk_test_51SdBEdJDZ4ttd5InCIrsiFqSELlh269yGSHLYfdCcoTX6d2vFNTeT4FLSfmgljkiWvjF3X2sCgVHmOtUxrAY1VxU00zFiKsewE');

const CheckoutForm = ({ bookingId, amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Create payment intent
      const { data: intentData } = await axios.post(
        'http://localhost:5000/api/payments/create-payment-intent',
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // 2. Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        intentData.data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // 3. Confirm payment on backend
      const { data: confirmData } = await axios.post(
        'http://localhost:5000/api/payments/confirm-payment',
        {
          bookingId,
          paymentIntentId: paymentIntent.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // 4. Success!
      onSuccess(confirmData.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded">
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
            },
          }}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay ৳${amount}`}
      </button>
    </form>
  );
};

const PaymentModal = ({ bookingId, amount, onSuccess, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
        <p className="text-gray-600 mb-6">Total Amount: ৳{amount}</p>

        <Elements stripe={stripePromise}>
          <CheckoutForm
            bookingId={bookingId}
            amount={amount}
            onSuccess={onSuccess}
          />
        </Elements>

        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;