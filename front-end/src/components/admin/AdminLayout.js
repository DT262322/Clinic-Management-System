import React from 'react';
import { Menu } from 'primereact/menu';
import { Outlet, useNavigate } from 'react-router-dom';
import '../css/AdminLayout.css';

function AdminLayout() {
    const navigate = useNavigate();

    const items = [
        { label: 'Dashboard', icon: 'pi pi-fw pi-home', command: () => { navigate('/admin'); } },
        { label: 'Products', icon: 'pi pi-fw pi-box', command: () => { navigate('/admin/products'); } },
        { label: 'Categories', icon: 'pi pi-fw pi-box', command: () => { navigate('/admin/categories'); } },
        {label: 'Orders', icon: 'pi pi-fw pi-shopping-cart', command: () => { navigate('/admin/orders'); } },
        { label: 'Articles', icon: 'pi pi-fw pi-file', command: () => { navigate('/admin/articles'); } },
        { label: 'Appointments', icon: 'pi pi-fw pi-calendar', command: () => { navigate('/admin/appointments'); } },
        { label: 'Services', icon: 'pi pi-fw pi-cog', command: () => { navigate('/admin/services'); } },
        { label: 'Pages', icon: 'pi pi-fw pi-trophy', command: () => { navigate('/'); } }
    ];

    return (
        <div className="admin-layout">
            <div className="sidebar">
                <h3>Admin Menu</h3>
                <Menu model={items} />
            </div>

            <div className="content">
                <Outlet /> {/* các route con */}
            </div>
        </div>
    );
}

export default AdminLayout;