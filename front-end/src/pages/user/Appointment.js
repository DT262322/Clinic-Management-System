import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../css/Appointment.css';
import ServiceService from "../../service/ServiceService";
import AppointmentService from "../../service/AppointmentService";

const Appointment = () => {
    const [appointmentDate, setAppointmentDate] = useState(null);
    const [serviceId, setServiceId] = useState(null);
    const [description, setDescription] = useState('');
    const [services, setServices] = useState([]);
    const [visible, setVisible] = useState(false);
    const [appointmentHistory, setAppointmentHistory] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const [thankYouVisible, setThankYouVisible] = useState(false);

    const userId = localStorage.getItem('userId');

    const fetchServices = useCallback(async () => {
        try {
            const response = await ServiceService.getAllServices();
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    }, []); 

    const fetchAppointmentHistory = useCallback(async () => {
        try {
            const response = await AppointmentService.getAllAppointmentsAdmin();
            console.log('Response data:', response.data);
            const filteredAppointments = response.data.filter(appointment => {
                console.log('Appointment userId:', appointment.userId);
                return appointment.userId === userId;
            });
            setAppointmentHistory(filteredAppointments);
        } catch (error) {
            console.error('Error fetching appointment history:', error);
        }
    }, [userId]); 

    useEffect(() => {
        fetchServices();
        fetchAppointmentHistory();
    }, [fetchServices, fetchAppointmentHistory]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!appointmentDate || !serviceId || !description) {
            alert('Please fill in all fields.');
            return;
        }
        try {
            const payload = {
                appointmentDate: appointmentDate.toISOString(),
                description: description,
                serviceId: serviceId.id,
                status: false,
                userId: userId
            };
            await AppointmentService.saveAppointment(payload);
            setThankYouVisible(true);
            await fetchAppointmentHistory();
            setAppointmentDate(null);
            setServiceId(null);
            setDescription('');
        } catch (error) {
            console.error('Error booking appointment:', error.response ? error.response.data : error);
            alert('Dịch vụ không tồn tại');
        }
    };

    const onAppointmentSelect = (e) => {
        setSelectedAppointment(e.data);
        setDetailVisible(true);
    };

    return (
        <div className="appointment-container">
            <div className="appointment-frame">
                <h1>Đặt lịch hẹn</h1>
                <form onSubmit={handleSubmit} className="appointment-form">
                    <div className="p-field">
                        <label htmlFor="appointmentDate">Ngày hẹn</label>
                        <Calendar id="appointmentDate" value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.value)} showTime hourFormat="24" />
                    </div>
                    <div className="p-field">
                        <label htmlFor="service">Dịch vụ</label>
                        <Dropdown id="service" value={serviceId} options={services}
                            onChange={(e) => setServiceId(e.value)} optionLabel="name"
                            placeholder="Chọn dịch vụ" />
                    </div>
                    <div className="p-field">
                        <label htmlFor="description">Mô tả</label>
                        <InputTextarea id="description" value={description}
                            onChange={(e) => setDescription(e.target.value)} rows={5} />
                    </div>
                    <Button type="submit" label="Đặt lịch hẹn" className="p-mt-3" />
                </form>

                <Button label="Lịch sử lịch hẹn đã đặt" icon="pi pi-history" onClick={() => setVisible(true)}
                    className="p-mt-3 history-button" />

                <Dialog header="Lịch sử đặt lịch" visible={visible} onHide={() => setVisible(false)} style={{ width: '50vw' }}>
                    <DataTable value={appointmentHistory} selectionMode="single" onRowSelect={onAppointmentSelect}>
                        <Column field="appointmentDate" header="Ngày"
                            body={(rowData) => new Date(rowData.appointmentDate).toLocaleString('vi-VN', {
                                day: 'numeric',
                                month: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric'
                            })} />
                        <Column field="description" header="Mô tả" />
                        <Column field="status" header="Trạng thái"
                            body={(rowData) => rowData.status ? 'Đã xác nhận' : 'Chưa xác nhận'} />
                    </DataTable>
                </Dialog>

                <Dialog header="Chi tiết lịch hẹn" visible={detailVisible} onHide={() => setDetailVisible(false)} style={{ width: '30vw' }}>
                    {selectedAppointment && (
                        <div>
                            <p><strong>Ngày hẹn:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleString('vi-VN')}</p>
                            <p><strong>Mô tả:</strong> {selectedAppointment.description}</p>
                            <p><strong>Trạng thái:</strong> {selectedAppointment.status ? 'Đã xác nhận' : 'Chưa xác nhận'}</p>
                        </div>
                    )}
                </Dialog>

                <Dialog header="Cảm ơn bạn" visible={thankYouVisible} onHide={() => setThankYouVisible(false)} style={{ width: '30vw' }}>
                    <p>Cảm ơn bạn đã đặt lịch hẹn. Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.</p>
                </Dialog>
            </div>
        </div>
    );
}

export default Appointment;
