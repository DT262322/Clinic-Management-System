import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../css//OrderConfirm.css';

const OrderConfirm = () => {
    const [messageInfo, setMessageInfo] = useState({ severity: '', summary: '', detail: '' });
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get('message');
        console.log(status);
        switch (status) {
            case 'success':
                setMessageInfo({
                    severity: 'success',
                    summary: 'Giao dịch thành công',
                    detail: 'Đơn hàng của bạn đã được xác nhận.'
                });
                break;
            case 'error':
                setMessageInfo({
                    severity: 'error',
                    summary: 'Lỗi không xác định',
                    detail: 'Đã xảy ra lỗi trong quá trình xử lý đơn hàng.'
                });
                break;
            default:
                setMessageInfo({
                    severity: 'warn',
                    summary: 'Giao dịch thất bại',
                    detail: 'Đơn hàng của bạn không thể hoàn tất.'
                });
        }
    }, [location]);

    const footer = (
        <div className="button-container">
            <Button label="Trang chủ" icon="pi pi-home" onClick={() => navigate('/')} />
            <Button label="Xem đơn hàng" icon="pi pi-list" onClick={() => navigate('/order-history')} className="p-button-secondary" />
        </div>
    );

    return (
        <div className="order-confirm-container">
            <Card title="Thông báo đơn hàng" footer={footer} className="order-confirm-card">
                <Message severity={messageInfo.severity} text={messageInfo.summary} />
                <p className="message-detail">{messageInfo.detail}</p>
                <p className="thank-you-message">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
            </Card>
        </div>
    );
}

export default OrderConfirm;