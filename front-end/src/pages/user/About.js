import React from 'react';
import { Card } from 'primereact/card';
import { Timeline } from 'primereact/timeline';
import { Accordion, AccordionTab } from 'primereact/accordion';
import '../css/About.css';

const About = () => {
    const historyEvents = [
        { year: '2010', event: 'Công ty được thành lập' },
        { year: '2015', event: 'Mở rộng ra 10 địa điểm' },
        { year: '2020', event: 'Ra mắt dịch vụ thuốc trực tuyến' },
        { year: '2023', event: 'Phục vụ 1 triệu bệnh nhân' },
    ];

    const teamMembers = [
        { name: 'Ông Nhân', role: 'Giám Đốc Y Khoa', image: '../img/DrNhan.jpg' },
        { name: 'Ông Duy', role: 'Giám Đốc Điều Hành', image: '../img/MrDuy.png' },
        { name: 'Bà Ngọc', role: 'Trưởng Dược Sĩ', image: '../img/DrNgoc.jpg' },
        { name: 'Ông Sơn', role: 'Trưởng Dược Sĩ', image: './img/DrSon.jpg' },
        { name: 'Ông Phước', role: 'Trưởng Dược Sĩ', image: './img/DrPhuoc.jpg' },
    ];

    return (
        <div className="about-page-container">
            <div className="about-content">
                <div className="p-grid p-mt-4">
                    <div className="p-col-12">
                        <h2>Lịch Sử Của Chúng Tôi</h2>
                        <Timeline value={historyEvents} content={(item) => item.event} />
                    </div>
                </div>

                <div className="p-grid p-mt-4">
                    <div className="p-col-12">
                        <h2>Đội Ngũ Của Chúng Tôi</h2>
                        <div className="p-grid">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="p-col-12 p-md-4">
                                    <Card>
                                        <div className="team-member">
                                            <div className="team-member-image-container">
                                                <img src={member.image} alt={member.name} className="team-member-image" />
                                            </div>
                                            <div className="team-member-info">
                                                <h3>{member.name}</h3>
                                                <p>{member.role}</p>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-grid p-mt-4">
                    <div className="p-col-12">
                        <h2>Khách Hàng Nói Gì</h2>
                        <Accordion>
                            <AccordionTab header="John D. - Bệnh Nhân Hài Lòng">
                                "Chăm sóc tôi nhận được là tuyệt vời. Nhân viên rất thân thiện và chuyên nghiệp."
                            </AccordionTab>
                            <AccordionTab header="Mary S. - Khách Hàng Thường Xuyên">
                                "Dịch vụ thuốc trực tuyến của họ đã giúp tôi quản lý đơn thuốc dễ dàng hơn rất nhiều!"
                            </AccordionTab>
                        </Accordion>
                    </div>
                </div>

                <div className="p-grid p-mt-4">
                    <div className="p-col-12">
                        <h2>Giải Thưởng và Công Nhận</h2>
                        <ul>
                            <li>Nhà Cung Cấp Chăm Sóc Sức Khỏe Tốt Nhất 2022 - Giải Thưởng Y Tế Thành Phố</li>
                            <li>Đổi Mới Trong Telemedicine 2021 - Hội Nghị Công Nghệ Y Tế Quốc Gia</li>
                        </ul>
                    </div>
                </div>

                <div className="p-grid p-mt-4">
                    <div className="p-col-12">
                        <h2>Tham Gia Cộng Đồng</h2>
                        <p>Chúng tôi tự hào hỗ trợ các sáng kiến sức khỏe địa phương và tham gia vào các hội chợ sức khỏe hàng năm để thúc đẩy sức khỏe trong cộng đồng của mình.</p>
                    </div>
                </div>

                <div className="p-grid p-mt-4">
                    <div className="p-col-12">
                        <h2>Các Địa Điểm Của Chúng Tôi</h2>
                        <p>Chúng tôi có các phòng khám ở trung tâm thành phố, ngoại ô và khu vực nông thôn để phục vụ bạn tốt hơn. Hãy truy cập trang Địa Điểm của chúng tôi để biết thêm thông tin chi tiết và bản đồ.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
