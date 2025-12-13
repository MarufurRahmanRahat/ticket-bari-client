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
        element: <PrivateRoute><UserProfile /></PrivateRoute>
      },
      {
        path: 'my-bookings',
        element: <PrivateRoute><MyBookings /></PrivateRoute>
      },
      {
        path: 'transactions',
        element: <PrivateRoute><TransactionHistory /></PrivateRoute>
      },

    ]
  },
]);

export default router;