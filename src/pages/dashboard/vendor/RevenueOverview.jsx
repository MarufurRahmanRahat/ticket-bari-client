import React, { useState, useEffect } from 'react';
import { bookingService } from '../../../services/bookingService';
import toast from 'react-hot-toast';
import { Loader2, DollarSign, Ticket, TrendingUp, Package } from 'lucide-react';

const RevenueOverview = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getVendorRevenue();
      setRevenueData(response.data);
    } catch (error) {
      toast.error('Failed to load revenue data');
    } finally {
      setLoading(false);
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Revenue Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<DollarSign className="w-8 h-8" />}
          title="Total Revenue"
          value={`৳${revenueData?.totalRevenue || 0}`}
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon={<Ticket className="w-8 h-8" />}
          title="Total Tickets Sold"
          value={revenueData?.totalTicketsSold || 0}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={<Package className="w-8 h-8" />}
          title="Total Tickets Added"
          value={revenueData?.totalTicketsAdded || 0}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Summary</h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <p className="text-sm text-gray-500">Average Revenue per Ticket</p>
              <p className="text-2xl font-bold text-gray-800">
                ৳
                {revenueData?.totalTicketsSold > 0
                  ? (revenueData.totalRevenue / revenueData.totalTicketsSold).toFixed(2)
                  : 0}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500" />
          </div>

          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <p className="text-sm text-gray-500">Sales Rate</p>
              <p className="text-2xl font-bold text-gray-800">
                {revenueData?.totalTicketsAdded > 0
                  ? ((revenueData.totalTicketsSold / revenueData.totalTicketsAdded) * 100).toFixed(
                      1
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{
                  width: `${
                    revenueData?.totalTicketsAdded > 0
                      ? (revenueData.totalTicketsSold / revenueData.totalTicketsAdded) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-2">💡 Tips to Increase Revenue</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Add more tickets during peak travel seasons</li>
              <li>• Offer competitive pricing to attract more customers</li>
              <li>• Respond quickly to booking requests</li>
              <li>• Provide excellent amenities and services</li>
              <li>• Keep your ticket information accurate and up-to-date</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, bgColor, iconColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`${bgColor} ${iconColor} p-3 rounded-lg`}>{icon}</div>
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default RevenueOverview;