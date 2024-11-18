import React from 'react';
import '../css/Contact.css';

const Contact = () => {
    return (
        <div className="contact-page">
            <div className="contact-container">
                <h1>Liên Hệ Với Chúng Tôi</h1>
                <p className="intro">Chúng tôi sẵn sàng giúp đỡ! Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào, xin đừng ngần ngại liên hệ với chúng tôi.</p>

                <div className="contact-info">
                    <div className="info-section">
                        <h3>Địa Chỉ Của Chúng Tôi</h3>
                        <p>123 Đường Sức Khỏe<br />Thành Phố Wellness, Bang Y Tế 12345</p>
                    </div>

                    <div className="info-section">
                        <h3>Điện Thoại</h3>
                        <p>Chính: +1 (123) 456-7890<br />Hỗ Trợ: +1 (987) 654-3210</p>
                    </div>

                    <div className="info-section">
                        <h3>Email</h3>
                        <p><a href="mailto:info@healthclinic.com">info@healthclinic.com</a><br />
                            <a href="mailto:support@healthclinic.com">support@healthclinic.com</a></p>
                    </div>

                    <div className="info-section">
                        <h3>Giờ Làm Việc</h3>
                        <p>Thứ Hai - Thứ Sáu: 8:00 AM - 8:00 PM<br />
                            Thứ Bảy: 9:00 AM - 5:00 PM<br />
                            Chủ Nhật: Đóng Cửa</p>
                    </div>
                </div>

                <div className="map-section">
                    <h3>Tìm Chúng Tôi</h3>
                    <div className="map-placeholder">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31348.697940409547!2d106.62692147431643!3d10.842865800000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529302ab56163%3A0x9bf5f1aaf14b7c2d!2zTmhhzIAgdGh1w7TMgWMgUGhhcm1hY2l0eQ!5e0!3m2!1svi!2s!4v1726044907452!5m2!1svi!2s"
                            width="700" height="300" style={{ border: 1 }}
                        >
                        </iframe>
                    </div>
                </div>

                <div className="social-media">
                    <h3>Theo Dõi Chúng Tôi</h3>
                    <div className="social-icons">
                        <a href="#" className="social-icon">Facebook</a>
                        <a href="#" className="social-icon">Twitter</a>
                        <a href="#" className="social-icon">Instagram</a>
                        <a href="#" className="social-icon">LinkedIn</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
