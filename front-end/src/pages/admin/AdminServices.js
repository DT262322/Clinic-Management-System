import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import ServiceService from '../../service/ServiceService';

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [name, setName] = useState('');
    const [status, setStatus] = useState(null);
    const toast = React.useRef(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await ServiceService.getAllServicesAdmin();
            console.log("Fetched services:", response.data); 
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch services.', life: 3000 });
        }
    };
    
    const openNew = () => {
        setSelectedService(null);
        setName('');
        setStatus(null); 
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    const addService = async () => {
        try {
            console.log("Adding service with data:", { name, status });
            const newService = {
                name,
                status,
            };
            await axios.post('/admin/Services/add', newService);
            toast.current.show({ severity: 'success', summary: 'Service Added', detail: 'Added successfully!', life: 3000 });
            fetchServices();
            hideModal();
        } catch (error) {
            console.error('Error adding service:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to add service.', life: 3000 });
        }
    };

    const editService = async () => {
        try {

            const updatedService = {
                id: selectedService.id, 
                name,
                status,
            };
            console.log("Editing service with data:", updatedService);
            await axios.put(`/admin/Services/edit/${selectedService.id}`, updatedService);
            toast.current.show({ severity: 'success', summary: 'Service Updated', detail: 'Updated successfully!', life: 3000 });
            fetchServices();
            hideModal();
        } catch (error) {
            console.error('Error updating service:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update service.', life: 3000 });
        }
    };
    

    const handleServiceSave = () => {
        if (selectedService) {
            editService();
        } else {
            addService();
        }
    };

    const editServiceDetails = (service) => {
        setSelectedService(service);
        setName(service.name || '');
        setStatus(service.status || null); 
        setVisible(true);
    };

    const deleteService = async (service) => {
        try {
            await axios.delete(`/admin/Services/delete/${service.id}`);
            fetchServices();
            toast.current.show({ severity: 'success', summary: 'Service Deleted', detail: `Deleted: ${service.name}`, life: 3000 });
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete service.', life: 3000 });
        }
    };

    const header = (
        <div className="table-header">
            <Button label="New" icon="pi pi-plus" onClick={openNew} />
        </div>
    );

    const statusBodyTemplate = (rowData) => {
        return rowData.status ? 'Hoạt động' : 'Không hoạt động';
    };

    return (
        <div>
            <Toast ref={toast} />
            <DataTable value={services} header={header} className="p-datatable-striped p-datatable-gridlines">
                <Column field="id" header="ID" />
                <Column field="name" header="Name" />
                <Column header="Status" body={statusBodyTemplate} />
                <Column header="Actions" body={(rowData) => (
                    <div>
                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editServiceDetails(rowData)} />
                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteService(rowData)} />
                    </div>
                )} />
            </DataTable>
                
            <Dialog header={selectedService ? "Edit Service" : "Add Service"} visible={visible} onHide={hideModal}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="name">Name</label>
                        <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="status">Status</label>
                        <Dropdown 
                            id="status" 
                            value={status} 
                            options={[{ label: 'Hoạt động', value: true }, { label: 'Không hoạt động', value: false }]} 
                            onChange={(e) => setStatus(e.value)} 
                        />
                    </div>
                </div>
                <div className="p-d-flex p-jc-between" style={{ marginTop: '20px' }}>
                    <Button label="Cancel" icon="pi pi-times" onClick={hideModal} className="p-button-text" />
                    <Button label="Save" icon="pi pi-check" onClick={handleServiceSave} />
                </div>
            </Dialog>
        </div>
    );
};

export default AdminServices;
