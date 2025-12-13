import React, { useState, useEffect } from 'react';
import { bookingService } from '../../../services/bookingService';
import toast from 'react-hot-toast';
import { Loader2, CheckCircle, XCircle, User, Ticket, DollarSign, Mail } from 'lucide-react';

const BookingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchBookingRequests();
  }, []);

  const fetchBookingRequests = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getVendorBookingRequests();
      setBookings(response.data.bookings);
    } catch (error) {
      toast.error('Failed to load booking requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      await bookingService.acceptBooking(bookingId);
      toast.success('Booking accepted successfully');
      fetchBookingRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (bookingId) => {
    if (!window.confirm('Are you sure you want to reject this booking?')) {
      return;
    }

    setActionLoading(bookingId);
    try {
      await bookingService.rejectBooking(bookingId);
      toast.success('Booking rejected');
      fetchBookingRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject booking');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Requested Bookings</h1>
        <button
          onClick={fetchBookingRequests}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No booking requests</h2>
          <p className="text-gray-600">Booking requests will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Ticket
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Total Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{booking.user?.name}</p>
                        <p className="text-sm text-gray-500">{booking.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{booking.ticketSnapshot?.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-800 font-semibold">{booking.bookingQuantity}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 font-bold">৳{booking.totalPrice}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {booking.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(booking._id)}
                            disabled={actionLoading === booking._id}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center"
                          >
                            {actionLoading === booking._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Accept
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(booking._id)}
                            disabled={actionLoading === booking._id}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No action needed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-gray-200">
            {bookings.map((booking) => (
              <div key={booking._id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center mb-1">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-800">{booking.user?.name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="w-4 h-4 mr-2" />
                      {booking.user?.email}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Ticket className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-700">{booking.ticketSnapshot?.title}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Quantity: {booking.bookingQuantity}</span>
                  <span className="text-green-600 font-bold flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    ৳{booking.totalPrice}
                  </span>
                </div>

                {booking.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleAccept(booking._id)}
                      disabled={actionLoading === booking._id}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center"
                    >
                      {actionLoading === booking._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(booking._id)}
                      disabled={actionLoading === booking._id}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingRequests;