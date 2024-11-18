import axios from "axios";


//Admin
const getAllAppointmentsAdmin = () => {
    return axios.get('/admin/Appointments')
}

const updateAppointmentAdmin = (appointment) => {
    return axios.put(`/admin/Appointments/${appointment.id}`, appointment);
}

const getAppointmentByUserName = (userId) => {
    return axios.get(`/api/Users/${userId}`);
}

const updateStatus = (id) => {
    return axios.put(`/admin/Appointments/update-status/${id}`)
}
const deleteAppointmentAdmin = (id) => {
    return axios.delete(`/admin/Appointments/${id}`);
}
const saveAppointAdmin = (appointment) => {
    return axios.post('/admin/Appointments', appointment);
}

// User
const getAllAppointment = () => {
    return axios.get('/Appointments');
}

/**
 * payload:
 * */
const saveAppointment = (appointment) => {
    return axios.post('/Appointments/add', appointment);
}

const getAppointment = (data) => {
}


const AppointmentService = {
    getAppointment,
    getAllAppointment,
    saveAppointment,
    updateStatus,
    getAppointmentByUserName,
    getAllAppointmentsAdmin,
    updateAppointmentAdmin,
    deleteAppointmentAdmin,
    saveAppointAdmin
}
export default AppointmentService;