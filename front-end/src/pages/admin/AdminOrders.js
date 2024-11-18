import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from 'axios';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/admin/Orders');
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            showError('Không thể lấy danh sách đơn hàng: ' + err.message);
            setLoading(false);
        }
    };

    const updateOrderStatus = async (id, newStatus) => {
        try {
            await axios.put(`/admin/Order/update-status/${id}`, { status: newStatus });
            fetchOrders(); // Làm mới danh sách đơn hàng sau khi cập nhật
            showSuccess(`Trạng thái đơn hàng ${id} đã được cập nhật thành ${newStatus}`);
        } catch (err) {
            showError('Không thể cập nhật trạng thái đơn hàng: ' + err.message);
        }
    };

    const showSuccess = (message) => {
        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: message, life: 3000 });
    };

    const showError = (message) => {
        toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button
                    icon="pi pi-truck"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => updateOrderStatus(rowData.id, 'Đã giao')}
                    tooltip="Đánh dấu là đã giao"
                />
                <Button
                    icon="pi pi-check"
                    className="p-button-rounded p-button-info mr-2"
                    onClick={() => updateOrderStatus(rowData.id, 'Đang vận chuyển')}
                    tooltip="Đánh dấu là đang vận chuyển"
                />
            </>
        );
    };

    const dateBodyTemplate = (rowData, field) => {
        return rowData[field] ? new Date(rowData[field]).toLocaleString('vi-VN') : 'N/A';
    };

    const currencyBodyTemplate = (rowData) => {
        return `${rowData.total.toFixed(2)} VNĐ`;
    };

    const statusBodyTemplate = (rowData) => {
        return rowData.status === true ? 'Đã giao' : 'Đang vận chuyển';
    };

    const header = (
        <div className="table-header">
            Đơn hàng của Quản trị viên
        </div>
    );

    if (loading) {
        return (
            <div className="card flex justify-content-center">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div>
            <Toast ref={toast} />
            <Card title="Đơn hàng của Quản trị viên">
                <DataTable value={orders} paginator rows={10} header={header} responsive={true}>
                    <Column field="id" header="ID" sortable></Column>
                    <Column field="orderDate" header="Ngày Đặt Hàng" body={(rowData) => dateBodyTemplate(rowData, 'orderDate')} sortable></Column>
                    <Column field="deliveryDate" header="Ngày Giao Hàng" body={(rowData) => dateBodyTemplate(rowData, 'deliveryDate')} sortable></Column>
                    <Column field="paymentDate" header="Ngày Thanh Toán" body={(rowData) => dateBodyTemplate(rowData, 'paymentDate')} sortable></Column>
                    <Column field="total" header="Tổng Tiền" body={currencyBodyTemplate} sortable></Column>
                    <Column field="status" header="Trạng Thái" body={statusBodyTemplate} sortable></Column>
                    <Column field="userId" header="ID Người Dùng" sortable></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </Card>
        </div>
    );
};

export default AdminOrders;
