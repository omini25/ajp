import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const Navigation = () => {
    const { user, logout } = useAuth();

    return (
        <nav>
            <ul>
                <li><Link to="/">Login</Link></li>
                {user ? (
                    <>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/clients">Clients</Link></li>
                        <li><Link to="/send-approval">Send Approval</Link></li>
                        <li><Link to="/approvals">Approvals</Link></li>

                        <li><button onClick={logout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};