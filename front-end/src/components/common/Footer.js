import React from 'react';
import {Button} from 'primereact/button';
import {Divider} from 'primereact/divider';
import '../css/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Về Chúng Tôi</h3>
                    <p>Chúng tôi cam kết cung cấp dịch vụ và sản phẩm chăm sóc sức khỏe chất lượng cao đến tay khách
                        hàng.</p>
                </div>
                <div className="footer-section">
                    <h3>Liên Kết Nhanh</h3>
                    <ul>
                        <li><a href="/">Trang Chủ</a></li>
                        <li><a href="/products">Sản Phẩm</a></li>
                        <li><a href="/articles">Tài Nguyên Sức Khỏe</a></li>
                        <li><a href="/appointments">Lịch Hẹn</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Liên Hệ Chúng Tôi</h3>
                    <p>Email: info@yourcompany.com</p>
                    <p>Điện thoại: (123) 456-7890</p>
                    <p>Địa chỉ: 123 Health Street, Medical City, MC 12345</p>
                </div>
            </div>

            <Divider/>

            <div className="footer-bottom">
                <p>&copy; 2023 Công Ty Của Bạn. Bảo lưu tất cả quyền.</p>
                <div className="footer-links">
                    <Button label="Chính Sách Bảo Mật" className="p-button-link"/>
                    <Button label="Điều Khoản Dịch Vụ" className="p-button-link"/>
                    <Button label="Liên Hệ" className="p-button-link"/>
                </div>
                <div className="social-icons">
                    <Button icon="pi pi-facebook" className="p-button-rounded p-button-text"/>
                    <Button icon="pi pi-twitter" className="p-button-rounded p-button-text"/>
                    <Button icon="pi pi-instagram" className="p-button-rounded p-button-text"/>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
