import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import{
    DashboardPage,
    HomePage,
    RegisterPage,
    ClientsPage,
    SendApprovalPage,
    ApprovalsPage,
    AddClientPage
} from "./Routes.js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const App = () => {
    return (
        <Router>
            <ToastContainer />
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/clients" element={<ClientsPage />} />
                    <Route path="/send-approval" element={<SendApprovalPage />} />
                    <Route path="/approvals" element={<ApprovalsPage />} />
                    <Route path="/add-client" element={<AddClientPage />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};
