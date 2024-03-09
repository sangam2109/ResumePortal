import React, { Component , useState } from 'react';
import Signup from './pages/Authentication/Signup';
import Dashboard from './pages/DashBoard';
import Login from './pages/Authentication/Login';
import Verify from './pages/Authentication/Verify';
import ForgotPassword from './pages/Authentication/Forgotpassword';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Admin from './pages/AdminDashboard/Admin'
import Navbar from './Components/Navbar/Navbar';
import ProtectedRoute from './Components/ProtectedRoute';

// import './App.css';
export const UserContext = React.createContext(null);

export default function App() {

  const[user, setUser] = useState(null);


    return (
      <div className="App">
        <BrowserRouter>
          <UserContext.Provider value={{ user: user, setUser: setUser }}>

        <Navbar />

          <Routes>
            {/* Redirect to the dashboard if user is authenticated */}
            <Route path="/" element={<Signup />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute path="/admin" component={Admin} />} />
            <Route path="/dashboard" element={<ProtectedRoute path="/dashboard" component={Dashboard} />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
          </Routes>
          </UserContext.Provider>

        </BrowserRouter>
      </div>
    );
  }


