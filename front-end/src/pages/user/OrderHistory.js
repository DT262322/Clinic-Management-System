import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';

const OrderView = () => {
    const [orders, setOrders] = useState([]);
    const [orderHistory, setOrderHistory] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [displayHistory, setDisplayHistory] = useState(false);
    const [displayOrderDetails, setDisplayOrderDetails] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('Người dùng chưa đăng nhập');
                return;
            }

            const response = await axios.get(`/Orders/user/${userId}`);
            setOrders(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', error);
            setError(error.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách đơn hàng');
        }
    };

    const fetchOrderHistory = async (orderId) => {
        try {
            const response = await axios.get(`/Orders/${orderId}/history`);
            setOrderHistory(response.data);
            setDisplayHistory(true);
        } catch (error) {
            console.error('Lỗi khi lấy lịch sử đơn hàng:', error);
        }
    };

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(`/OrderDetail/${orderId}`);
            setOrderDetails(response.data);
            setDisplayOrderDetails(true);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
        }
    };

    const dateBodyTemplate = (rowData, field) => {
        return new Date(rowData[field]).toLocaleDateString('vi-VN');
    };

    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rowData.total);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button
                    icon="pi pi-history"
                    className="p-button-rounded p-button-info"
                    onClick={() => fetchOrderHistory(rowData.id)}
                    tooltip="Xem lịch sử đơn hàng"
                />
                <Button
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-success"
                    onClick={() => fetchOrderDetails(rowData.id)}
                    tooltip="Xem chi tiết đơn hàng"
                />
            </>
        );
    };

    const historyItemTemplate = (item) => {
        return (
            <Card title={item.status} subTitle={new Date(item.date).toLocaleString('vi-VN')}>
                <p>{item.description}</p>
            </Card>
        );
    };

    const orderDetailsTemplate = () => {
        return orderDetails.length > 0 ? (
            <div>
                {orderDetails.map((detail, index) => (
                    <div key={index}>
                        <p><strong>Tên sản phẩm:</strong> {detail.productName}</p>
                        <p><strong>Số lượng:</strong> {detail.quantity}</p>
                        <p><strong>Đơn giá:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.unitPrice)}</p>
                        <p><strong>Order ID:</strong> {detail.orderId}</p>
                        <hr />
                    </div>
                ))}
            </div>
        ) : (
            <p>Không có chi tiết đơn hàng.</p>
        );
    };
    

    if (error) {
        return <Message severity="error" text={error} />;
    }

    return (
        <div className="card">
            <h1>Đơn hàng của bạn</h1>
            <DataTable value={orders} responsiveLayout="scroll">
                <Column field="id" header="Mã đơn hàng"></Column>
                <Column field="orderDate" header="Ngày đặt hàng" body={(rowData) => dateBodyTemplate(rowData, 'orderDate')}></Column>
                <Column field="deliveryDate" header="Ngày giao hàng" body={(rowData) => dateBodyTemplate(rowData, 'deliveryDate')}></Column>
                <Column field="paymentDate" header="Ngày thanh toán" body={(rowData) => dateBodyTemplate(rowData, 'paymentDate')}></Column>
                <Column field="total" header="Tổng tiền" body={priceBodyTemplate}></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
            </DataTable>

            <Dialog
                header="Lịch sử đơn hàng"
                visible={displayHistory}
                style={{ width: '50vw' }}
                onHide={() => setDisplayHistory(false)}
            >
                <Timeline value={orderHistory} content={historyItemTemplate} />
            </Dialog>

            <Dialog
                header="Chi tiết đơn hàng"
                visible={displayOrderDetails}
                style={{ width: '50vw' }}
                onHide={() => setDisplayOrderDetails(false)}
            >
                {orderDetailsTemplate()}
            </Dialog>
        </div>
    );
};

export default OrderView;
