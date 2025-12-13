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
}