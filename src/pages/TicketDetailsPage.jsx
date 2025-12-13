import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  Bus,
  Train,
  Ship,
  Plane,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react';


const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingQuantity, setBookingQuantity] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch ticket details
  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!ticket) return;

    const updateCountdown = () => {
      const departureDateTime = new Date(ticket.departureDate);
      const [hours, minutes] = ticket.departureTime.split(':');
      departureDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const now = new Date();
      const difference = departureDateTime - now;

      if (difference <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
       hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setCountdown({ days, hours, minutes, seconds, expired: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [ticket]);

  const fetchTicketDetails = async () => {
    setLoading(true);
    try {
      const response = await ticketService.getTicketById(id);
      setTicket(response.data.ticket);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error('Failed to load ticket details');
      navigate('/all-tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login', { state: { from: `/ticket/${id}` } });
      return;
    }

    if (user.role !== 'user') {
      toast.error('Only users can book tickets');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await bookingService.createBooking({
        ticketId: id,
        bookingQuantity,
      });

      toast.success(response.message);
      setShowBookingModal(false);
      navigate('/dashboard/my-bookings');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const getTransportIcon = (type) => {
    switch (type) {
      case 'Bus':
        return <Bus className="w-6 h-6" />;
      case 'Train':
        return <Train className="w-6 h-6" />;
      case 'Launch':
        return <Ship className="w-6 h-6" />;
      case 'Plane':
        return <Plane className="w-6 h-6" />;
      default:
        return <Bus className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Ticket not found</p>
          <Link
            to="/all-tickets"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Back to All Tickets
          </Link>
        </div>
      </div>
    );
  }

  const isBookingDisabled = countdown.expired || ticket.quantity === 0;
  const totalPrice = ticket.price * bookingQuantity;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/all-tickets')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to All Tickets
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image Section */}
          <div className="relative h-96">
            <img
              src={ticket.image}
              alt={ticket.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
              }}
            />
            {ticket.quantity === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white font-bold text-3xl">SOLD OUT</span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Title & Transport Type */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {ticket.title}
                </h1>
                <div className="flex items-center space-x-2 text-blue-600">
                  {getTransportIcon(ticket.transportType)}
                  <span className="text-lg font-medium">{ticket.transportType}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm mb-1">Price per person</p>
                <p className="text-4xl font-bold text-blue-600">৳{ticket.price}</p>
              </div>
            </div>

            {/* Countdown Timer */}
            {!countdown.expired ? (
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <p className="text-center text-gray-700 font-medium mb-3">
                  Departure in:
                </p>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {countdown.days}
                    </div>
                    <div className="text-sm text-gray-600">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {countdown.hours}
                    </div>
                    <div className="text-sm text-gray-600">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {countdown.minutes}
                    </div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {countdown.seconds}
                    </div>
                    <div className="text-sm text-gray-600">Seconds</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-600 font-medium">
                  This ticket has already departed
                </span>
              </div>
            )}

            {/* Ticket Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Route</p>
                    <p className="font-semibold text-gray-800">
                      {ticket.fromLocation} → {ticket.toLocation}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Departure Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(ticket.departureDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Departure Time</p>
                    <p className="font-semibold text-gray-800">{ticket.departureTime}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Users className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Available Seats</p>
                    <p className="font-semibold text-gray-800">
                      {ticket.quantity} seats remaining
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <DollarSign className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Vendor</p>
                    <p className="font-semibold text-gray-800">{ticket.vendorName}</p>
                    <p className="text-sm text-gray-500">{ticket.vendorEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Perks */}
            {ticket.perks && ticket.perks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Amenities & Perks
                </h3>
                <div className="flex flex-wrap gap-3">
                  {ticket.perks.map((perk, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="font-medium">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Book Now Button */}
            <div className="border-t pt-6">
              <button
                onClick={() => setShowBookingModal(true)}
                disabled={isBookingDisabled}
                className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {countdown.expired
                  ? 'Ticket Expired'
                  : ticket.quantity === 0
                  ? 'Sold Out'
                  : 'Book Now'}
              </button>
              {!user && !isBookingDisabled && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  Please login to book this ticket
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Book Your Tickets
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Tickets
              </label>
              <input
                type="number"
                min="1"
                max={ticket.quantity}
                value={bookingQuantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 && value <= ticket.quantity) {
                    setBookingQuantity(value);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Maximum: {ticket.quantity} tickets available
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Price per ticket:</span>
                <span className="font-semibold">৳{ticket.price}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-semibold">×{bookingQuantity}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-800">
                    Total Amount:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ৳{totalPrice}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-800">
                Your booking will be sent to the vendor for approval. You can pay
                after the vendor accepts your booking request.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetailsPage;