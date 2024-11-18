import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/user/Home';
import Products from '../pages/user/Products';
import ProductDetail from '../pages/user/ProductDetail';
import Cart from '../pages/user/Cart';
import OrderHistory from '../pages/user/OrderHistory';
import Appointment from '../pages/user/Appointment';
import Articles from '../pages/user/Articles';
import ArticleDetail from '../pages/user/ArticleDetail';
import Contact from '../pages/user/Contact';
import About from '../pages/user/About';
import UserLayout from '../components/user/UserLayout';
import AuthView from '../pages/user/AuthView';
import OrderConFirm from '../pages/user/OrderConFirm';

function UserRoutes() {
    return (
        <Routes>
            <Route path='/login' element={<AuthView />} />

            <Route element={<UserLayout />}>

                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/order-confirm" element={<OrderConFirm />} />
                <Route path="/appointment" element={<Appointment />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/article/:id" element={<ArticleDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
            </Route>
        </Routes>
    );
}

export default UserRoutes;
