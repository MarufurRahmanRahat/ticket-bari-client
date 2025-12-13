import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import toast from 'react-hot-toast';
import {
  Ticket,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getMyBookings();
      setBookings(response.data.bookings);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'paid':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Booked Tickets</h1>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No bookings yet</h2>
          <p className="text-gray-600 mb-6">
            Start booking tickets to see them here
          </p>
          <Link
            to="/all-tickets"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Browse Tickets
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const BookingCard = ({ booking, getStatusColor, getStatusIcon }) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    if (booking.status === 'rejected') return;

    const updateCountdown = () => {
      const departureDateTime = new Date(booking.ticketSnapshot.departureDate);
      const [hours, minutes] = booking.ticketSnapshot.departureTime.split(':');
      departureDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const now = new Date();
      const difference = departureDateTime - now;

      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((difference / 1000 / 60) % 60);
      const secs = Math.floor((difference / 1000) % 60);

      setCountdown({ days, hours: hrs, minutes: mins, seconds: secs, expired: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [booking]);

  const canPay = booking.status === 'accepted' && !countdown.expired;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <img
        src={booking.ticket?.image || 'https://via.placeholder.com/400x200'}
        alt={booking.ticketSnapshot.title}
        className="w-full h-40 object-cover"
      />

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {booking.ticketSnapshot.title}
        </h3>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>
              {booking.ticketSnapshot.fromLocation} → {booking.ticketSnapshot.toLocation}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {new Date(booking.ticketSnapshot.departureDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>{booking.ticketSnapshot.departureTime}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Ticket className="w-4 h-4 mr-2" />
            <span>{booking.bookingQuantity} tickets</span>
          </div>

          <div className="flex items-center text-blue-600 font-semibold">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>৳{booking.totalPrice}</span>
          </div>
        </div>

        {/* Countdown */}
        {booking.status !== 'rejected' && !countdown.expired && (
          <div className="bg-blue-50 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-600 mb-1 text-center">Departure in:</p>
            <div className="grid grid-cols-4 gap-1 text-center">
              <div>
                <div className="text-sm font-bold text-blue-600">{countdown.days}</div>
                <div className="text-xs text-gray-600">Days</div>
              </div>
              <div>
                <div className="text-sm font-bold text-blue-600">{countdown.hours}</div>
                <div className="text-xs text-gray-600">Hrs</div>
              </div>
              <div>
                <div className="text-sm font-bold text-blue-600">{countdown.minutes}</div>
                <div className="text-xs text-gray-600">Min</div>
              </div>
              <div>
                <div className="text-sm font-bold text-blue-600">{countdown.seconds}</div>
                <div className="text-xs text-gray-600">Sec</div>
              </div>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="mt-auto">
          <div
            className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor(
              booking.status
            )}`}
          >
            {getStatusIcon(booking.status)}
            <span className="text-sm font-semibold capitalize">{booking.status}</span>
          </div>

          {/* Pay Now Button */}
          {canPay && (
            <Link
              to={`/payment/${booking._id}`}
              className="w-full mt-3 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition text-center block"
            >
              Pay Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;