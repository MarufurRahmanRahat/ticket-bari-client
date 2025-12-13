import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "./PrivateRoute";
import AllTicketsPage from "../pages/AllTicketsPage";
import TicketDetailsPage from "../pages/TicketDetailsPage";
import DashboardLayout from "../layouts/DashboardLayout";
import UserProfile from "../pages/dashboard/UserProfile";
import MyBookings from "../pages/dashboard/MyBookings";
import TransactionHistory from "../pages/dashboard/TransactionHistory";
import VendorProfile from '../pages/dashboard/vendor/VendorProfile';
import AddTicket from '../pages/dashboard/vendor/AddTicket';
import MyTickets from '../pages/dashboard/vendor/MyTickets';
import BookingRequests from '../pages/dashboard/vendor/BookingRequests';
import RevenueOverview from '../pages/dashboard/vendor/RevenueOverview';

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,

    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: "login",
        Component: Login
      },
      {
        path: "register",
        Component: Register
      },
      {
        path: '/all-tickets',
        element: <PrivateRoute><AllTicketsPage /></PrivateRoute>
      },
      {
        path: '/ticket/:id',
        element: <PrivateRoute><TicketDetailsPage /></PrivateRoute>
      },
      {
        path: '/dashboard',
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>
      },
      {
        path: 'profile',
        element: <PrivateRoute allowedRoles={['user']}><UserProfile /></PrivateRoute>
      },
      {
        path: 'my-bookings',
        element: <PrivateRoute allowedRoles={['user']}><MyBookings /></PrivateRoute>
      },
      {
        path: 'transactions',
        element: <PrivateRoute allowedRoles={['user']}><TransactionHistory /></PrivateRoute>
      },
      {
        path: 'vendor/profile',
        element: <PrivateRoute allowedRoles={['vendor']}><VendorProfile /></PrivateRoute>
      },
      {
        path: 'vendor/add-ticket',
        element: <PrivateRoute allowedRoles={['vendor']}><AddTicket /></PrivateRoute>
      },
      {
        path: 'vendor/my-tickets',
        element: <PrivateRoute allowedRoles={['vendor']}><MyTickets /></PrivateRoute>
      },
      {
        path: 'vendor/booking-requests',
        element: <PrivateRoute allowedRoles={['vendor']}><BookingRequests /></PrivateRoute>
      },
      {
        path: 'vendor/revenue',
        element: <PrivateRoute allowedRoles={['vendor']}><RevenueOverview /></PrivateRoute>
      },

    ]
  },
]);

export default router;