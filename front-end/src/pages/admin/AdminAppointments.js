import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { ToggleButton } from 'primereact/togglebutton';
import { Checkbox } from 'primereact/checkbox';
import AppointmentService from '../../service/AppointmentService';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showIncomplete, setShowIncomplete] = useState(false); 
  const toast = useRef(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchUserName = async (userId) => {
    try {
      const response = await AppointmentService.getAppointmentByUserName(userId);
      return response.data.name; 
    } catch (error) {
      console.error('Error fetching user name:', error);
      return 'Unknown User';
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await AppointmentService.getAllAppointmentsAdmin();
      const appointmentsWithUserNames = await Promise.all(
        response.data.map(async (appointment) => {
          const userName = await fetchUserName(appointment.userId);
          return { ...appointment, userName };
        })
      );
      setAppointments(appointmentsWithUserNames);
    } catch (error) {
      showError('Không thể tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const showError = (message) => {
    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 });
  };

  const showSuccess = (message) => {
    toast.current.show({ severity: 'success', summary: 'Thành công', detail: message, life: 3000 });
  };

  const updateAppointmentStatus = async (id) => {
    try {
      await AppointmentService.updateStatus(id);
      showSuccess('Cập nhật trạng thái lịch hẹn thành công');
      fetchAppointments();
    } catch (error) {
      showError('Không thể cập nhật trạng thái lịch hẹn');
    }
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <ToggleButton
        checked={rowData.status === true}
        onChange={(e) => updateAppointmentStatus(rowData.id)}
        onLabel="Hoàn thành"
        offLabel="Chưa hoàn thành"
      />
    );
  };

  const formatDate = (value) => {
    return new Date(value).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredAppointments = showIncomplete 
    ? appointments.filter(appointment => !appointment.status) 
    : appointments;

  return (
    <div>
      <Toast ref={toast} />
      <h1>Quản lý lịch hẹn</h1>

      <div className="p-field-checkbox">
        <Checkbox 
          inputId="showIncomplete" 
          checked={showIncomplete} 
          onChange={(e) => setShowIncomplete(e.checked)} 
        />
        <label htmlFor="showIncomplete">Hiển thị các lịch hẹn chưa hoàn thành</label>
      </div>

      <DataTable value={filteredAppointments} loading={loading} paginator rows={10} className="p-datatable-striped">
        <Column field="id" header="ID" />
        <Column field="appointmentDate" header="Ngày hẹn" body={(rowData) => formatDate(rowData.appointmentDate)} />
        <Column field="status" header="Trạng thái" body={statusBodyTemplate} />
        <Column field="description" header="Mô tả" />
        <Column field="serviceId" header="Mã dịch vụ" />
        <Column field="userId" header="Tên người dùng" />
      </DataTable>
    </div>
  );
};

export default AdminAppointments;
