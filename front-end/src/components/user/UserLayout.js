import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
const UserLayout = () => {
    return (
        <div className="flex flex-column min-h-screen">
            <Header />
            <div className="flex-grow-1 p-4">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default UserLayout;