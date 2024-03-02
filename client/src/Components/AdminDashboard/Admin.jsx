import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '@mui/material';
import { Box } from '@mui/material';
import { IconButton } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { openBase64NewTab } from '../../CommonComponent/base64topdf';

const AdminForm = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('authtoken');
                const response = await axios.get('http://localhost:8000/api/users/getallusers/', {
                    headers: {
                        "auth-token": token // Include the authentication token in the request headers
                    }
                });
                const filteredUsers = response.data.data
                    .filter(user => user.role === 'user') // Filter by user role
                    .filter(user => user.userProfile.firstName !== undefined);
                setUsers(filteredUsers);
                console.log(users)
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleViewCertificate = (resume) => {
        if (resume) {
            openBase64NewTab(resume);
        }
    };

    const columns = [
        { accessorKey: "userProfile.firstName", header: "First Name" },
        { accessorKey: "userProfile.lastName", header: "Last Name" },
        { accessorKey: "userProfile.email", header: "Email" },
        { accessorKey: "userProfile.contact", header: "Contact" },
        { accessorKey: "userProfile.experience", header: "Experience" },
        { accessorKey: "userProfile.education", header: "Education" },
        { accessorKey: "userProfile.skills", header: "Skills", renderCell: ({ row }) => row.original.userProfile.skills.join(', ') },
        { accessorKey: "userProfile.location", header: "Location" },
    ];

    const table = useMaterialReactTable({
        data: users,
        columns,
        enableRowActions: true,
        renderRowActions: ({ row }) => (
            <Box>
                <IconButton onClick={() => handleViewCertificate(row.original.userProfile.resume)}>
                    <PdfIcon />
                </IconButton>
            </Box>
        ),
    });

    return (
        <div style={{ marginTop: '100px', padding: '0 20px' }}>
            <Card variant="outlined" style={{ marginBottom: '50px' }}>
                <MaterialReactTable table={table} />
            </Card>
        </div>
    );
};

export default AdminForm;
