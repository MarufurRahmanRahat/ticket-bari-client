import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import toast from 'react-hot-toast';
import { 
  Bus, 
  Train, 
  Ship, 
  Plane, 
  Shield, 
  CreditCard, 
  HeadphonesIcon,
  Award,
  MapPin,
  Users,
  Loader2
} from 'lucide-react';

const HomePage = () => {
  const [advertisedTickets, setAdvertisedTickets] = useState([]);
  const [latestTickets, setLatestTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      // Fetch both advertised and latest tickets
      const [advertisedResponse, latestResponse] = await Promise.all([
        ticketService.getAdvertisedTickets(),
        ticketService.getLatestTickets(6),
      ]);

      setAdvertisedTickets(advertisedResponse.data.tickets);
      setLatestTickets(latestResponse.data.tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const getTransportIcon = (type) => {
    switch (type) {
      case 'Bus': return <Bus className="w-5 h-5" />;
      case 'Train': return <Train className="w-5 h-5" />;
      case 'Launch': return <Ship className="w-5 h-5" />;
      case 'Plane': return <Plane className="w-5 h-5" />;
      default: return <Bus className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-gray-50">
      
      {/* Advertisement Section - 6 Admin Selected Tickets */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Featured Tickets
          </h2>
          <p className="text-gray-600 text-lg">
            Handpicked deals selected just for you
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : advertisedTickets.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No featured tickets available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisedTickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}
      </section>

      {/* Latest Tickets Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Latest Tickets
            </h2>
            <p className="text-gray-600 text-lg">
              Recently added travel options
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          ) : latestTickets.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No tickets available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestTickets.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why Choose TicketBari?
          </h2>
          <p className="text-gray-600 text-lg">
            Your trusted travel partner
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Shield className="w-12 h-12 text-blue-600" />}
            title="Safe & Secure"
            description="Your data and payments are protected with industry-standard encryption"
          />
          <FeatureCard
            icon={<CreditCard className="w-12 h-12 text-blue-600" />}
            title="Easy Payment"
            description="Multiple payment options with instant booking confirmation"
          />
          <FeatureCard
            icon={<HeadphonesIcon className="w-12 h-12 text-blue-600" />}
            title="24/7 Support"
            description="Our customer support team is always ready to help you"
          />
          <FeatureCard
            icon={<Award className="w-12 h-12 text-blue-600" />}
            title="Best Prices"
            description="Get the best deals and discounts on all routes"
          />
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Popular Routes
            </h2>
            <p className="text-gray-600 text-lg">
              Most traveled destinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RouteCard
              from="Dhaka"
              to="Chittagong"
              price={800}
              passengers="2.5K+ travelers"
            />
            <RouteCard
              from="Dhaka"
              to="Sylhet"
              price={650}
              passengers="1.8K+ travelers"
            />
            <RouteCard
              from="Dhaka"
              to="Cox's Bazar"
              price={4200}
              passengers="3.2K+ travelers"
            />
            <RouteCard
              from="Dhaka"
              to="Rajshahi"
              price={750}
              passengers="1.5K+ travelers"
            />
            <RouteCard
              from="Dhaka"
              to="Khulna"
              price={600}
              passengers="1.2K+ travelers"
            />
            <RouteCard
              from="Dhaka"
              to="Rangpur"
              price={900}
              passengers="1K+ travelers"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// Ticket Card Component
const TicketCard = ({ ticket }) => {
  const getTransportIcon = (type) => {
    switch (type) {
      case 'Bus': return <Bus className="w-5 h-5" />;
      case 'Train': return <Train className="w-5 h-5" />;
      case 'Launch': return <Ship className="w-5 h-5" />;
      case 'Plane': return <Plane className="w-5 h-5" />;
      default: return <Bus className="w-5 h-5" />;
    }
  };

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
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {ticket.title}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-blue-600">
            {getTransportIcon(ticket.transportType)}
            <span className="text-sm font-medium">{ticket.transportType}</span>
          </div>
          <span className="text-sm text-gray-500">
            {ticket.quantity} seats
          </span>
        </div>

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

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

// Route Card Component
const RouteCard = ({ from, to, price, passengers }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-bold text-gray-800">{from}</p>
            <p className="text-sm text-gray-500">to</p>
            <p className="font-bold text-gray-800">{to}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Starting from</p>
          <p className="text-2xl font-bold text-blue-600">৳{price}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center text-sm text-gray-500">
          <Users className="w-4 h-4 mr-1" />
          {passengers}
        </div>
        <Link
          to="/all-tickets"
          className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
        >
          View Tickets →
        </Link>
      </div>
    </div>
  );
};

export default HomePage;