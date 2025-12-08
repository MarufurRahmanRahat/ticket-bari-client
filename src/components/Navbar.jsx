
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Menu, X, ChevronDown, User, LogOut, Bus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    // Handle logout
    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully!');
            navigate('/login');
            setIsDropdownOpen(false);
            setIsMobileMenuOpen(false);
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout');
        }
    };

    // Close mobile menu when clicking on a link
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);
    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <Bus className="w-8 h-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-800">TicketBari</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `text-gray-700 hover:text-blue-600 font-medium transition ${isActive ? 'text-blue-600' : ''
                                }`
                            }
                        >
                            Home
                        </NavLink>

                        {user && (
                            <>
                                <NavLink
                                    to="/all-tickets"
                                    className={({ isActive }) =>
                                        `text-gray-700 hover:text-blue-600 font-medium transition ${isActive ? 'text-blue-600' : ''
                                        }`
                                    }
                                >
                                    All Tickets
                                </NavLink>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        `text-gray-700 hover:text-blue-600 font-medium transition ${isActive ? 'text-blue-600' : ''
                                        }`
                                    }
                                >
                                    Dashboard
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Right Side - Auth */}
                    <div className="hidden md:flex items-center space-x-4">
                        {loading ? (
                            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                        ) : user ? (
                            <div className="relative dropdown-container">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-3 focus:outline-none hover:opacity-80 transition"
                                >
                                    <img
                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=3b82f6&color=fff`}
                                        alt={user.displayName || 'User'}
                                        className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                                    />
                                    <span className="text-gray-700 font-medium">
                                        {user.displayName || 'User'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border animate-fadeIn">
                                        <Link
                                            to="/dashboard/profile"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 transition"
                                        >
                                            <User className="w-4 h-4 mr-2" />
                                            My Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-blue-50 transition"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-gray-700 focus:outline-none"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden pb-4 space-y-3 animate-fadeIn">
                        <NavLink
                            to="/"
                            onClick={closeMobileMenu}
                            className={({ isActive }) =>
                                `block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition ${isActive ? 'bg-blue-50 text-blue-600' : ''
                                }`
                            }
                        >
                            Home
                        </NavLink>

                        {user ? (
                            <>
                                <NavLink
                                    to="/all-tickets"
                                    onClick={closeMobileMenu}
                                    className={({ isActive }) =>
                                        `block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition ${isActive ? 'bg-blue-50 text-blue-600' : ''
                                        }`
                                    }
                                >
                                    All Tickets
                                </NavLink>
                                <NavLink
                                    to="/dashboard"
                                    onClick={closeMobileMenu}
                                    className={({ isActive }) =>
                                        `block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition ${isActive ? 'bg-blue-50 text-blue-600' : ''
                                        }`
                                    }
                                >
                                    Dashboard
                                </NavLink>

                                {/* User Info in Mobile */}
                                <div className="flex items-center space-x-3 px-4 py-2 border-t border-gray-200 mt-2 pt-4">
                                    <img
                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=3b82f6&color=fff`}
                                        alt={user.displayName || 'User'}
                                        className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                                    />
                                    <span className="text-gray-700 font-medium">
                                        {user.displayName || 'User'}
                                    </span>
                                </div>

                                <Link
                                    to="/dashboard/profile"
                                    onClick={closeMobileMenu}
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition"
                                >
                                    My Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded transition font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={closeMobileMenu}
                                    className="block px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={closeMobileMenu}
                                    className="block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-center hover:bg-blue-700 transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* CSS for animations */}
            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
        </nav>
    );
};

export default Navbar;