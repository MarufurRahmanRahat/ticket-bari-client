
import React from 'react';
import { Bus } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Column 1: Logo & Description */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Bus className="w-8 h-8 text-blue-500" />
                            <span className="text-2xl font-bold text-white">TicketBari</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Book bus, train, launch & flight tickets easily. Your trusted travel companion for seamless booking experience.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-gray-400 hover:text-blue-500 transition text-sm">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/all-tickets" className="text-gray-400 hover:text-blue-500 transition text-sm">
                                    All Tickets
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-gray-400 hover:text-blue-500 transition text-sm">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="/about" className="text-gray-400 hover:text-blue-500 transition text-sm">
                                    About
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Contact Info</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="text-gray-400">
                                <span className="font-medium text-white">Email:</span>
                                <br />
                                support@ticketbari.com
                            </li>
                            <li className="text-gray-400">
                                <span className="font-medium text-white">Phone:</span>
                                <br />
                                +880 1234-567890
                            </li>
                            <li className="text-gray-400">
                                <span className="font-medium text-white">Facebook:</span>
                                <br />
                                <a href="#" className="hover:text-blue-500 transition">
                                    fb.com/ticketbari
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Payment Methods */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Payment Methods</h3>
                        <div className="flex flex-wrap gap-3">
                            <div className="bg-white px-3 py-2 rounded shadow-sm">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                                    alt="Stripe"
                                    className="h-6"
                                />
                            </div>
                            <div className="bg-white px-3 py-2 rounded shadow-sm flex items-center">
                                <span className="text-blue-600 font-bold text-sm">VISA</span>
                            </div>
                            <div className="bg-white px-3 py-2 rounded shadow-sm flex items-center">
                                <span className="text-orange-600 font-bold text-sm">Mastercard</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-6 text-center">
                    <p className="text-gray-400 text-sm">
                        © 2025 TicketBari. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;