import axios from "axios";

// Admin
const getAllServicesAdmin = () =>{
    return axios.get('/admin/Services');
}
const editServiceAdmin = (idService, service) =>{
    return axios.put(`/admin/Services/edit/${idService}`, service);
}
const saveServiceAdmin = (serviceData) => {
    return  axios.post('/admin/Services/add', serviceData);
}
const deleteServiceAdmin =(serviceId) =>{
    return axios.delete(`/admin/Services/delete/${serviceId}`);
}

// User
const getAllServices = async () => {
    return await axios.get('/Services');
}

const ServiceService={
    getAllServices,
    getAllServicesAdmin,
    editServiceAdmin,
    saveServiceAdmin,
    deleteServiceAdmin
}
export default ServiceService;