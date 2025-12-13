import React from 'react';
import Hero from '../components/Hero';
import HomePage from '../components/HomePage';


const Home = () => {
    return (
        <div className="bg-gray-50">
            <Hero/>
            <HomePage/>
        </div>
    );
};

export default Home;