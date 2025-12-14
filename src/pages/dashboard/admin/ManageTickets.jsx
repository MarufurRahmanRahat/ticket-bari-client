import React, { useState, useEffect } from 'react';
import { ticketService } from '../../../services/ticketService';
import toast from 'react-hot-toast';
import {
  Loader2,
  CheckCircle,
  XCircle,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Clock,
} from 'lucide-react';

const ManageTickets = () => {
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
      setTickets(response.data.tickets);
    } catch (error) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (ticketId) => {
    setActionLoading(ticketId);
    try {
      await ticketService.approveTicket(ticketId);
      toast.success('Ticket approved successfully');
      fetchTickets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve ticket');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (ticketId) => {
    if (!window.confirm('Are you sure you want to reject this ticket?')) {
      return;
    }

    setActionLoading(ticketId);
    try {
      await ticketService.rejectTicket(ticketId);
      toast.success('Ticket rejected');
      fetchTickets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject ticket');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Pending</span>;
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Approved</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Rejected</span>;
      default:
        return null;
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
        <h1 className="text-3xl font-bold text-gray-800">Manage Tickets</h1>
        <button
          onClick={fetchTickets}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ticket</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Vendor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Route</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
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
                    <p className="text-sm font-medium text-gray-800">{ticket.vendorName}</p>
                    <p className="text-xs text-gray-500">{ticket.vendorEmail}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <MapPin className="w-4 h-4 mr-1" />
                      {ticket.fromLocation} → {ticket.toLocation}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-600 font-bold">৳{ticket.price}</span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(ticket.verificationStatus)}</td>
                  <td className="px-6 py-4">
                    {ticket.verificationStatus === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(ticket._id)}
                          disabled={actionLoading === ticket._id}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center"
                        >
                          {actionLoading === ticket._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(ticket._id)}
                          disabled={actionLoading === ticket._id}
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
                  {getStatusBadge(ticket.verificationStatus)}
                </div>
              </div>

              <div className="text-sm space-y-1">
                <p className="text-gray-600">
                  <span className="font-medium">Vendor:</span> {ticket.vendorName}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Route:</span> {ticket.fromLocation} → {ticket.toLocation}
                </p>
                <p className="text-green-600 font-bold">৳{ticket.price}</p>
              </div>

              {ticket.verificationStatus === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleApprove(ticket._id)}
                    disabled={actionLoading === ticket._id}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center"
                  >
                    {actionLoading === ticket._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(ticket._id)}
                    disabled={actionLoading === ticket._id}
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
    </div>
  );
};

export default ManageTickets;