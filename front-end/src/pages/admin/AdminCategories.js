import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import CategoryService from "../../service/CategoryService";

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const toast = React.useRef(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await CategoryService.getAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch categories.', life: 3000 });
        }
    };

    const openNew = () => {
        setSelectedCategory(null);
        setName('');
        setStatus('');
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    const saveCategory = async () => {
        try {
            const categoryData = { name, status };

            if (selectedCategory) {
                categoryData.id = selectedCategory.id;
                await CategoryService.editCategory(selectedCategory.id,categoryData);
                toast.current.show({ severity: 'success', summary: 'Category Updated', detail: 'Updated successfully!', life: 3000 });
            } else {
                await CategoryService.saveCategory(categoryData)
                toast.current.show({ severity: 'success', summary: 'Category Added', detail: 'Added successfully!', life: 3000 });
            }
            fetchCategories();
            hideModal();
        } catch (error) {
            console.error('Error saving category:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save category.', life: 3000 });
        }
    };

    const editCategory = (category) => {
        setSelectedCategory(category);
        setName(category.name || '');
        setStatus(category.status || '');
        setVisible(true);
    };

    const deleteCategory = async (category) => {
        try {
            await CategoryService.deleteCategory(category.id)
            fetchCategories();
            toast.current.show({ severity: 'success', summary: 'Category Deleted', detail: `Deleted: ${category.name}`, life: 3000 });
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete category.', life: 3000 });
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
            <DataTable value={categories} header={header}>
                <Column field="id" header="ID" />
                <Column field="name" header="Name" />
                <Column header="Status" body={statusBodyTemplate} />
                <Column header="Hành Động" body={(rowData) => (
                    <div>
                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editCategory(rowData)} />
                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteCategory(rowData)} />
                    </div>
                )} />
            </DataTable>

            <Dialog header={selectedCategory ? "Edit Category" : "Add Category"} visible={visible} onHide={hideModal}>
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
                            options={[
                                { label: 'Hoạt Động', value: true },
                                { label: 'Không hoạt động', value: false }
                            ]}
                            onChange={(e) => setStatus(e.value)}
                        />
                    </div>
                </div>
                <div className="p-d-flex p-jc-between" style={{ marginTop: '20px' }}>
                    <Button label="Cancel" icon="pi pi-times" onClick={hideModal} className="p-button-text" />
                    <Button label="Save" icon="pi pi-check" onClick={saveCategory} />
                </div>
            </Dialog>
        </div>
    );
};

export default AdminCategories;
