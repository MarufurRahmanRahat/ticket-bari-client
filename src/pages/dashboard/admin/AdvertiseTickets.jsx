import React, { useState, useEffect } from 'react';
import { ticketService } from '../../../services/ticketService';
import toast from 'react-hot-toast';
import { Loader2, Star, StarOff } from 'lucide-react';

const AdvertiseTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await ticketService.getAllTicketsForAdmin();
      // Filter only approved tickets
      const approvedTickets = response.data.tickets.filter(
        (t) => t.verificationStatus === 'approved'
      );
      setTickets(approvedTickets);
    } catch (error) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdvertise = async (ticketId, isAdvertised) => {
    // Count currently advertised tickets
    const advertisedCount = tickets.filter((t) => t.isAdvertised).length;

    // Check if trying to advertise more than 6
    if (!isAdvertised && advertisedCount >= 6) {
      toast.error('Maximum 6 tickets can be advertised at a time');
      return;
    }

    setActionLoading(ticketId);
    try {
      await ticketService.toggleAdvertiseTicket(ticketId);
      toast.success(
        isAdvertised ? 'Ticket removed from advertisement' : 'Ticket advertised successfully'
      );
      fetchTickets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle advertise');
    } finally {
      setActionLoading(null);
    }
  };

  const advertisedCount = tickets.filter((t) => t.isAdvertised).length;

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
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Advertise Tickets</h1>
          <p className="text-gray-600 mt-1">
            {advertisedCount} of 6 tickets advertised
          </p>
        </div>
        <button
          onClick={fetchTickets}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* Warning if limit reached */}
      {advertisedCount >= 6 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 font-medium">
            ⚠️ Maximum advertisement limit reached. Remove an advertised ticket to add a new one.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ticket</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Route</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Advertise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={ticket.image}
                        alt={ticket.title}
                        className="w-16 h-16 rounded object-cover mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{ticket.title}</p>
                        <p className="text-sm text-gray-500">{ticket.transportType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">
                      {ticket.fromLocation} → {ticket.toLocation}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-600 font-bold">৳{ticket.price}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">{ticket.quantity} seats</span>
                  </td>
                  <td className="px-6 py-4">
                    {ticket.isAdvertised ? (
                      <span className="flex items-center text-yellow-600 font-medium text-sm">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        Advertised
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">Not advertised</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleAdvertise(ticket._id, ticket.isAdvertised)}
                      disabled={actionLoading === ticket._id}
                      className={`px-4 py-2 rounded font-semibold text-sm transition disabled:opacity-50 flex items-center ${
                        ticket.isAdvertised
                          ? 'bg-gray-600 text-white hover:bg-gray-700'
                          : 'bg-yellow-600 text-white hover:bg-yellow-700'
                      }`}
                    >
                      {actionLoading === ticket._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : ticket.isAdvertised ? (
                        <>
                          <StarOff className="w-4 h-4 mr-1" />
                          Unadvertise
                        </>
                      ) : (
                        <>
                          <Star className="w-4 h-4 mr-1" />
                          Advertise
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-gray-200">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="p-4 space-y-3">
              <div className="flex gap-3">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="w-20 h-20 rounded object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 mb-1">{ticket.title}</h3>
                  <p className="text-sm text-gray-500">{ticket.transportType}</p>
                  {ticket.isAdvertised && (
                    <span className="inline-flex items-center text-yellow-600 font-medium text-xs mt-1">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Advertised
                    </span>
                  )}
                </div>
              </div>

              <div className="text-sm space-y-1">
                <p className="text-gray-600">
                  <span className="font-medium">Route:</span> {ticket.fromLocation} → {ticket.toLocation}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Price:</span> <span className="text-green-600 font-bold">৳{ticket.price}</span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Quantity:</span> {ticket.quantity} seats
                </p>
              </div>

              <button
                onClick={() => handleToggleAdvertise(ticket._id, ticket.isAdvertised)}
                disabled={actionLoading === ticket._id}
                className={`w-full px-4 py-2 rounded font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center ${
                  ticket.isAdvertised
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
              >
                {actionLoading === ticket._id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : ticket.isAdvertised ? (
                  <>
                    <StarOff className="w-4 h-4 mr-1" />
                    Unadvertise
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-1" />
                    Advertise
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvertiseTickets;