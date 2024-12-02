import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Index/home';
import Confirm from './components/Confirm';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import HomePage from './components/Dashboard/Dashboard';
import TODO from './components/To-Do/To_DO';
import ForgotPassword from './components/ForgotPassword';
import ChangePassword from './components/ChangePassword';
import WastePickUp from './components/WastePickUp/Wastepickup';
import Paynow from './components/Payment/Paynow';
import AllBookings from './components/AllBookings/AllBookings';
import Admin from './components/Admin/Admin';
import AdminPanel from './components/Admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<Home/>} />
        <Route path="/home/:userId" element={<HomePage />} />
        <Route path="/confirm/:token" element={<Confirm />} />
        <Route path="/TODO" element={<TODO />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/changepassword/:token' element={<ChangePassword />} />
        <Route path='/wastepickup/:userId' element={<WastePickUp />} />
        <Route path='/paynow' element={<Paynow />} />
        <Route path='/bookings/:userId' element={<AllBookings />} />
        <Route path='/admin' element={<Admin/>} />
        <Route path='/admin/dashboard/:token' element={<AdminPanel/>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes> 
    </Router>
  );
}

export default App;
