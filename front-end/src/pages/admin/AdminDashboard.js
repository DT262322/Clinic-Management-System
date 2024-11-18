import React, { useState, useEffect } from 'react';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import axios from 'axios';
import '../css/AdminDashboard.css';


const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [ setUsers] = useState([]);
    const [revenueData, setRevenueData] = useState({});

    useEffect(() => {
        fetchOrders();
        fetchProducts();
        fetchUsers();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/admin/Orders');
            const updatedOrders = response.data.map(order => ({
                ...order,
                status: order.status ? 'Thành công' : 'Đang chờ'
            }));
            setOrders(updatedOrders);
            processRevenueData(updatedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/admin/Products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/admin/User');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } 
    };

    const processRevenueData = (orders) => {
        const monthlyRevenue = {};
        orders.forEach(order => {
            const month = new Date(order.orderDate).getMonth();
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.total;
        });

        const labels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
        const data = labels.map((_, index) => monthlyRevenue[index] || 0);

        setRevenueData({
            labels: labels,
            datasets: [
                {
                    label: 'Doanh thu',
                    data: data,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                },
            ],
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const recentOrdersTemplate = (rowData) => {
        return (
            <div>
                <strong>Đơn hàng #{rowData.id}</strong> - {formatCurrency(rowData.total)}
                <br />
                <small>{new Date(rowData.orderDate).toLocaleString()}</small>
            </div>
        );
    };

    const statusTemplate = (rowData) => {
        return (
            <span className={`order-status ${rowData.status === 'Thành công' ? 'success' : 'pending'}`}>
                {rowData.status}
            </span>
        );
    };

    return (
        <div className="admin-dashboard">
            <h1>Bảng điều khiển</h1>
            <Panel header="Chào mừng đến với Bảng điều khiển Quản trị!">
                <p>Ở đây bạn có thể quản lý ứng dụng của mình.</p>
            </Panel>
            
            <Panel header="Thống kê">
                <div className="stats">
                    <div className="stat-item">
                        <h3>Tổng sản phẩm</h3>
                        <p>{products.length}</p>
                    </div>
                    <div className="stat-item">
                        <h3>Tổng đơn hàng</h3>
                        <p>{orders.length}</p>
                    </div>
                    <div className="stat-item">
                        <h3>Tổng người dùng</h3>
                        <p>10</p>
                    </div>
                </div>
            </Panel>

            <Panel header="Biểu đồ doanh thu">
                <Chart type="bar" data={revenueData} />
            </Panel>

            <Panel header="Đơn hàng gần đây">
                <DataTable value={orders.slice(0, 5)} className="p-datatable-gridlines">
                    <Column body={recentOrdersTemplate} header="Thông tin đơn hàng" />
                    <Column body={statusTemplate} header="Trạng thái" />
                </DataTable>
            </Panel>
        </div>
    );
};

export default AdminDashboard;