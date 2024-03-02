import React from 'react';
import { jwtDecode } from "jwt-decode";
import { Navigate } from 'react-router-dom';
import Admin from '../Components/AdminDashboard/Admin';
// import Home from '../Components/Home';
import Dashboard from '../Components/DashBoard'

const ProtectedRoute = ({ component: Component, path, ...rest }) => {
    const authToken = localStorage.getItem('authtoken');

    if (!authToken) {
        return <Navigate to="/login" replace />;
    } else {
        try {
            const decodedToken = jwtDecode(authToken);
            const userRole = decodedToken.user.role;

            // Check if the user is authenticated and has the required role
            if (userRole === 'admin') {
                // Redirect admin to home if trying to access superadmin route

                return <Admin />;
            } else {
                // Redirect to home or another appropriate route if the user doesn't have the required role
                if (path === '/admin' || path === '/superadmin') {
                    return <Dashboard/>;
                }
                return <Component {...rest} />;
            }
        } catch (error) {
            // If there's an error decoding the token, redirect to login
            console.error('Error decoding token:', error);
            return <Navigate to="/login" replace />;
        }
    }
};

export default ProtectedRoute;
