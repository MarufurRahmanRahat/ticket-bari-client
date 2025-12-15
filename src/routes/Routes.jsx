import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import PrivateRoute from './PrivateRoute';

// all my pages
import Home from '../pages/Home';
import AllTicketsPage from '../pages/AllTicketsPage';
import TicketDetailsPage from '../pages/TicketDetailsPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import PaymentPage from '../pages/PaymentPage';

// User Dashboard
import UserProfile from '../pages/dashboard/UserProfile';
import MyBookings from '../pages/dashboard/MyBookings';
import TransactionHistory from '../pages/dashboard/TransactionHistory';

// Vendor Dashboard
import VendorProfile from '../pages/dashboard/vendor/VendorProfile';
import AddTicket from '../pages/dashboard/vendor/AddTicket';
import MyTickets from '../pages/dashboard/vendor/MyTickets';
import BookingRequests from '../pages/dashboard/vendor/BookingRequests';
import RevenueOverview from '../pages/dashboard/vendor/RevenueOverview';

// Admin Dashboard
import AdminProfile from '../pages/dashboard/admin/AdminProfile';
import ManageTickets from '../pages/dashboard/admin/ManageTickets';
import ManageUsers from '../pages/dashboard/admin/ManageUsers';
import AdvertiseTickets from '../pages/dashboard/admin/AdvertiseTickets';


// Error Page
const ErrorPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-gray-600 mb-4">Page not found</p>
      <a href="/" className="text-blue-600 hover:text-blue-700">Go back home</a>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'all-tickets',
        element: (
          <PrivateRoute>
            <AllTicketsPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'ticket/:id',
        element: (
          <PrivateRoute>
            <TicketDetailsPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
  {
    path: '/payment/:bookingId',
    element: (
      <PrivateRoute>
        <PaymentPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // User Routes
      {
        path: 'profile',
        element: (
          <PrivateRoute allowedRoles={['user']}>
            <UserProfile />
          </PrivateRoute>
        ),
      },
      {
        path: 'my-bookings',
        element: (
          <PrivateRoute allowedRoles={['user']}>
            <MyBookings />
          </PrivateRoute>
        ),
      },
      {
        path: 'transactions',
        element: (
          <PrivateRoute allowedRoles={['user']}>
            <TransactionHistory />
          </PrivateRoute>
        ),
      },
      // Vendor Routes
      {
        path: 'vendor/profile',
        element: (
          <PrivateRoute allowedRoles={['vendor']}>
            <VendorProfile />
          </PrivateRoute>
        ),
      },
      {
        path: 'vendor/add-ticket',
        element: (
          <PrivateRoute allowedRoles={['vendor']}>
            <AddTicket />
          </PrivateRoute>
        ),
      },
      {
        path: 'vendor/my-tickets',
        element: (
          <PrivateRoute allowedRoles={['vendor']}>
            <MyTickets />
          </PrivateRoute>
        ),
      },
      {
        path: 'vendor/booking-requests',
        element: (
          <PrivateRoute allowedRoles={['vendor']}>
            <BookingRequests />
          </PrivateRoute>
        ),
      },
      {
        path: 'vendor/revenue',
        element: (
          <PrivateRoute allowedRoles={['vendor']}>
            <RevenueOverview />
          </PrivateRoute>
        ),
      },
      // Admin Routes
      {
        path: 'admin/profile',
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            <AdminProfile />
          </PrivateRoute>
        ),
      },
      {
        path: 'admin/manage-tickets',
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            <ManageTickets />
          </PrivateRoute>
        ),
      },
      {
        path: 'admin/manage-users',
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            <ManageUsers />
          </PrivateRoute>
        ),
      },
      {
        path: 'admin/advertise',
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            <AdvertiseTickets />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

export default router;