import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '@mui/material';
import { Box } from '@mui/material';
import { IconButton } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { openBase64NewTab } from '../../utils/base64topdf';

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

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleViewCertificate = (row) => {
        if (row.original.userProfile.resume) {
            openBase64NewTab(row.original.userProfile.resume);
        }
    };

    const columns = [
        { accessorKey: "userProfile.firstName", header: "First Name" },
        { accessorKey: "userProfile.lastName", header: "Last Name" },
        { accessorKey: "userProfile.email", header: "Email" },
        { accessorKey: "userProfile.contact", header: "Contact" },
        {
            accessorKey: "userProfile.resume",
            header: "Resume", Cell: ({ row }) => (
                <PictureAsPdfIcon onClick={() => handleViewCertificate(row)} style={{ cursor: 'pointer' }} />
            )
        },
        {
            accessorKey: "userProfile.skills",
            header: "Skills", Cell: ({ row }) => (
                <div>{row.original.userProfile.skills.join(', ')}</div>
            )
        },
        { accessorKey: "userProfile.experience", header: "Experience" },
        {
            accessorKey: "userProfile.education",
            header: "Education",
            Cell: ({ row }) => (
                <div style={{ width: '220px' }}>
                    {row.original.userProfile.education.map((educationInfo, index) => {
                        const parts = educationInfo.split(" - ");
                        return (
                            <div key={index}>
                                {parts.map((part, index) => (
                                    <div key={index}>{part}</div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            )
        },
        {
            accessorKey: "userProfile.location",
            header: "Location",
            Cell: ({ row }) => {
                const locationInfo = row.original.userProfile.location;
                const [city, state, country] = locationInfo.split(", ");
                return (
                    <div>
                        <div>City: {city}</div>
                        <div>State: {state}</div>
                        <div>Country: {country}</div>
                    </div>
                );
            }
        },


    ];

    const table = useMaterialReactTable({
        data: users,
        columns,

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
