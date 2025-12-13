import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../../../services/ticketService';
import toast from 'react-hot-toast';
import {
  Loader2,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  DollarSign,
  Users,
} from 'lucide-react';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    setLoading(true);
    try {
      const response = await ticketService.getMyTickets();
      setTickets(response.data.tickets);
    } catch (error) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ticketId, status) => {
    if (status === 'rejected') {
      toast.error('Cannot delete rejected tickets');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this ticket?')) {
      return;
    }

    setDeleteLoading(ticketId);
    try {
      await ticketService.deleteTicket(ticketId);
      toast.success('Ticket deleted successfully');
      fetchMyTickets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete ticket');
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
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
        <h1 className="text-3xl font-bold text-gray-800">My Added Tickets</h1>
        <Link
          to="/dashboard/vendor/add-ticket"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Add New Ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No tickets yet</h2>
          <p className="text-gray-600 mb-6">Start adding tickets to see them here</p>
          <Link
            to="/dashboard/vendor/add-ticket"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Add Your First Ticket
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              getStatusBadge={getStatusBadge}
              handleDelete={handleDelete}
              deleteLoading={deleteLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TicketCard = ({ ticket, getStatusBadge, handleDelete, deleteLoading }) => {
  const isDisabled = ticket.verificationStatus === 'rejected';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <img
        src={ticket.image}
        alt={ticket.title}
        className="w-full h-40 object-cover"
      />

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2 flex-1">
            {ticket.title}
          </h3>
        </div>

        <div className="mb-2">{getStatusBadge(ticket.verificationStatus)}</div>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>
              {ticket.fromLocation} → {ticket.toLocation}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-1" />
              <span className="font-semibold text-blue-600">৳{ticket.price}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              <span>{ticket.quantity} seats</span>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            {new Date(ticket.departureDate).toLocaleDateString()} at {ticket.departureTime}
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <Link
            to={`/dashboard/vendor/edit-ticket/${ticket._id}`}
            className={`flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-center flex items-center justify-center ${
              isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
            }`}
          >
            <Edit className="w-4 h-4 mr-1" />
            Update
          </Link>
          <button
            onClick={() => handleDelete(ticket._id, ticket.verificationStatus)}
            disabled={isDisabled || deleteLoading === ticket._id}
            className={`flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center ${
              isDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {deleteLoading === ticket._id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyTickets;