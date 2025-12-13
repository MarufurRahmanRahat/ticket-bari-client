import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import toast from 'react-hot-toast';
import {
  Bus,
  Train,
  Ship,
  Plane,
  Search,
  Filter,
  ArrowUpDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const AllTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 0,
  });

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    transportType: 'all',
    sortBy: '',
  });

  // Temporary search input (for controlled input)
  const [searchInput, setSearchInput] = useState('');

  // Fetch tickets when filters or page changes
  useEffect(() => {
    fetchTickets();
  }, [filters, pagination.page]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      // Add search if exists
      if (filters.search) {
        params.search = filters.search;
      }

      // Add transport type filter if not 'all'
      if (filters.transportType !== 'all') {
        params.transportType = filters.transportType;
      }

      // Add sort if exists
      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
      }

      const response = await ticketService.getAllTickets(params);
      setTickets(response.data.tickets);
      setPagination((prev) => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchInput });
    setPagination({ ...pagination, page: 1 }); // Reset to page 1
  };

  // Handle transport type filter
  const handleTransportTypeChange = (type) => {
    setFilters({ ...filters, transportType: type });
    setPagination({ ...pagination, page: 1 }); // Reset to page 1
  };

  // Handle sort change
  const handleSortChange = (sortType) => {
    setFilters({ ...filters, sortBy: sortType });
    setPagination({ ...pagination, page: 1 }); // Reset to page 1
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      transportType: 'all',
      sortBy: '',
    });
    setSearchInput('');
    setPagination({ ...pagination, page: 1 });
  };

  const getTransportIcon = (type) => {
    switch (type) {
      case 'Bus':
        return <Bus className="w-5 h-5" />;
      case 'Train':
        return <Train className="w-5 h-5" />;
      case 'Launch':
        return <Ship className="w-5 h-5" />;
      case 'Plane':
        return <Plane className="w-5 h-5" />;
      default:
        return <Bus className="w-5 h-5" />;
    }
  };
return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            All Tickets
          </h1>
          <p className="text-gray-600">
            Browse and book your tickets from {pagination.total} available options
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search by Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="From or To location..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Transport Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Filter by Transport
              </label>
              <select
                value={filters.transportType}
                onChange={(e) => handleTransportTypeChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
                <option value="Launch">Launch</option>
                <option value="Plane">Plane</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ArrowUpDown className="w-4 h-4 inline mr-1" />
                Sort by Price
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filters & Clear Button */}
          {(filters.search || filters.transportType !== 'all' || filters.sortBy) && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Search: "{filters.search}"
                  </span>
                )}
                {filters.transportType !== 'all' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Type: {filters.transportType}
                  </span>
                )}
                {filters.sortBy && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Sort: {filters.sortBy === 'price-low' ? 'Low to High' : 'High to Low'}
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : tickets.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg mb-4">No tickets found</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Tickets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {tickets.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} getTransportIcon={getTransportIcon} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total tickets)
                </div>

                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= pagination.page - 1 && page <= pagination.page + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded-lg transition ${
                              page === pagination.page
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === pagination.page - 2 || page === pagination.page + 2) {
                        return <span key={page} className="px-2">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Ticket Card Component
const TicketCard = ({ ticket, getTransportIcon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <img
          src={ticket.image}
          alt={ticket.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        {ticket.quantity === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">SOLD OUT</span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
          {ticket.title}
        </h3>

        {/* Route */}
        <div className="flex items-center text-gray-600 mb-3 text-sm">
          <span className="font-medium">{ticket.fromLocation}</span>
          <span className="mx-2">→</span>
          <span className="font-medium">{ticket.toLocation}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-blue-600">
            {getTransportIcon(ticket.transportType)}
            <span className="text-sm font-medium">{ticket.transportType}</span>
          </div>
          <span className="text-sm text-gray-500">{ticket.quantity} seats</span>
        </div>

        {/* Perks */}
        {ticket.perks && ticket.perks.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {ticket.perks.slice(0, 3).map((perk, index) => (
              <span
                key={index}
                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded"
              >
                {perk}
              </span>
            ))}
          </div>
        )}

        {/* Departure Info */}
        <div className="text-sm text-gray-500 mb-4">
          <span>
            {new Date(ticket.departureDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            at {ticket.departureTime}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-blue-600">৳{ticket.price}</span>
            <span className="text-sm text-gray-500 ml-1">/person</span>
          </div>
          <Link
            to={`/ticket/${ticket._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            See Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AllTicketsPage;