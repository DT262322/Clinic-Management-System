import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const AdminAccounts = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/admin/User');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="admin-accounts">
            <h1>Accounts</h1>
            <DataTable value={users} loading={loading} responsiveLayout="scroll">
                <Column field="userName" header="User Name" sortable></Column>
                <Column field="email" header="Email" sortable></Column>
                <Column field="emailConfirmed" header="Email Confirmed" sortable></Column>
                <Column field="phoneNumber" header="Phone Number"></Column>
            </DataTable>
        </div>
    );
};

export default AdminAccounts;
