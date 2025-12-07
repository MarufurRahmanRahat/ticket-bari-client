import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <Navbar/>
            <div className='max-w-screen-2xl w-full flex-1'>
                <Outlet />
            </div>
            <Footer/>
        </div>
    );
};

export default MainLayout;