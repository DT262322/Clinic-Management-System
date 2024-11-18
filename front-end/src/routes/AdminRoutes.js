import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminArticles from '../pages/admin/AdminArticles';
import AdminAccounts from '../pages/admin/AdminAccounts';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminServices from '../pages/admin/AdminServices';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminAppointments from '../pages/admin/AdminAppointments';
import AdminOrders from '../pages/admin/AdminOrders';

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="articles" element={<AdminArticles />} />
        <Route path="accounts" element={<AdminAccounts />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path='categories' element={<AdminCategories />} />
        <Route path='appointments' element={<AdminAppointments />} />
        <Route path="services" element={<AdminServices />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
