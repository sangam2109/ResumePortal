import React, { Component } from 'react';
import Signup from './Components/Authentication/Signup';
import DashBoard from './Components/DashBoard';
import Login from './Components/Authentication/Login';
import Verify from './Components/Authentication/Verify';
import ForgotPassword from './Components/Authentication/Forgotpassword';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Admin from "./Components/AdminDashboard/Admin";
import Navbar from './Components/Navbar/Navbar';
import ProtectedRoute from './CommonComponent/ProtectedRoute';

// import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
        <Navbar />

          <Routes>
            {/* Redirect to the dashboard if user is authenticated */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute path="/admin" component={Admin} />} />
            <Route path="/dashboard" element={<ProtectedRoute path="/dashboard" component={DashBoard} />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
