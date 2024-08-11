import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { Dashboard } from './components/Dashboard.jsx';
import { Clients } from './components/Clients';
import { SendApproval } from './components/SendApproval';
import { Approvals } from './components/Approvals';
import { Login } from './components/Login';
import {Register} from "./components/Register.jsx";
import {AddClient} from "./components/AddClient.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const App = () => {
    return (
        <Router>
            <ToastContainer />
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/send-approval" element={<SendApproval />} />
                    <Route path="/approvals" element={<Approvals />} />
                    <Route path="/add-client" element={<AddClient />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};
