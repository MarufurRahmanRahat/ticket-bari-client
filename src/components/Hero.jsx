import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const heroSlides = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=600&fit=crop',
            title: 'Travel Made Easy',
            subtitle: 'Book Bus, Train, Launch & Flight Tickets',
            cta: 'Book Now'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&h=600&fit=crop',
            title: 'Best Prices Guaranteed',
            subtitle: 'Compare and Choose the Best Deals',
            cta: 'Explore Tickets'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop',
            title: 'Safe & Secure Booking',
            subtitle: 'Your Journey, Our Priority',
            cta: 'Get Started'
        }
    ];

    // Auto-slide for hero banner
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroSlides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };
    return (
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
            {heroSlides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
                        <div className="text-center text-white px-4">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fadeIn">
                                {slide.title}
                            </h1>
                            <p className="text-xl md:text-2xl mb-8 animate-fadeIn">
                                {slide.subtitle}
                            </p>
                            <Link
                                to="/all-tickets"
                                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
                            >
                                {slide.cta}
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-opacity-30 hover:bg-opacity-50 p-2 rounded-full transition"
            >
                <ChevronLeft className="w-12 h-12 text-white" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-opacity-30 hover:bg-opacity-50 p-2 rounded-full transition"
            >
                <ChevronRight className="w-12 h-12 text-white" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;