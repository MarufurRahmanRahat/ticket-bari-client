# TicketBari - Online Ticket Booking Platform (Frontend)

A modern, full-featured online ticket booking platform built with React, enabling users to discover and book travel tickets for Bus, Train, Launch, and Plane services.

## 🌐 Live Demo

- **Live Site**: [https://ticket-bari-client.web.app/]
- **Backend API**: [https://ticket-bari-server-psi.vercel.app/]

## 📋 Project Purpose

TicketBari is designed to streamline the ticket booking process for travelers while providing vendors with a platform to manage their services and admins with comprehensive control over the entire system. The platform features role-based dashboards, real-time booking management, and secure payment processing.

## ✨ Key Features

### 🎫 User Features
- **Browse & Search Tickets**: Search by location, filter by transport type, and sort by price
- **Advanced Filtering**: Filter tickets by transport type (Bus/Train/Launch/Plane)
- **Real-time Countdown**: Live countdown timer for ticket departure
- **Secure Booking**: Book tickets with quantity selection
- **Stripe Payment**: Integrated Stripe payment gateway
- **Booking Management**: Track booking status (Pending → Accepted → Paid)
- **Transaction History**: View complete payment history
- **Profile Management**: Update personal information and photo

### 🏪 Vendor Features
- **Add Tickets**: Create new tickets with images, perks, and detailed information
- **Ticket Management**: View, update, and delete own tickets
- **Booking Requests**: Accept or reject user booking requests
- **Revenue Dashboard**: Track total revenue, tickets sold, and performance metrics
- **Status Tracking**: Monitor ticket verification status (Pending/Approved/Rejected)

### 🛡️ Admin Features
- **Ticket Approval**: Approve or reject vendor-submitted tickets
- **User Management**: Promote users to vendor or admin roles
- **Fraud Detection**: Mark vendors as fraud and hide their tickets
- **Advertisement Control**: Feature up to 6 tickets on homepage
- **User Statistics**: View comprehensive user and vendor statistics
- **System Oversight**: Full control over the entire platform

### 🚀 Additional Features
- **Role-based Dashboards**: Separate interfaces for User, Vendor, and Admin
- **Responsive Design**: Fully responsive on mobile, tablet, and desktop
- **Firebase Authentication**: Secure login with email/password and Google Sign-in
- **Image Upload**: ImgBB integration for ticket images
- **Loading States**: Smooth loading indicators throughout the app
- **Toast Notifications**: Real-time feedback for all user actions
- **Pagination**: Efficient ticket browsing with 9 tickets per page
- **Protected Routes**: Route guards based on authentication and roles

## 🛠️ Technologies Used

### Core
- **React** (v18.3.1) - UI library
- **React Router DOM** (v7.1.1) - Routing
- **Vite** (v6.0.5) - Build tool

### Authentication & API
- **Firebase** (v11.1.0) - Authentication
- **Axios** (v1.7.9) - HTTP client

### Payment
- **@stripe/stripe-js** (v5.2.0) - Stripe payment integration
- **@stripe/react-stripe-js** (v2.10.0) - Stripe React components

### UI & Icons
- **Tailwind CSS** (v3.4.17) - Styling
- **Lucide React** (v0.468.0) - Icons
- **React Hot Toast** (v2.4.1) - Notifications

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📦 NPM Packages
```json
{
   "dependencies": {
    "@stripe/react-stripe-js": "^5.4.1",
    "@stripe/stripe-js": "^8.5.3",
    "@tailwindcss/vite": "^4.1.17",
    "axios": "^1.13.2",
    "firebase": "^12.6.0",
    "lucide-react": "^0.556.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-hot-toast": "^2.6.0",
    "react-router-dom": "^7.10.1",
    "tailwindcss": "^4.1.17"
  },
}
```

