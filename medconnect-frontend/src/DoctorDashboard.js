import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoctorAppointments, updateAppointmentStatus } from './api';

function DoctorDashboard() {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const doctorId = 2;

    // Reusable fetch function to reload data after updates
    const fetchAppointments = async () => {
        try {
            const response = await getDoctorAppointments(doctorId);
            setAppointments(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching doctor appointments", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Click handler for updating status rows
    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            await updateAppointmentStatus(appointmentId, newStatus);
            // Refresh the list immediately from MySQL to reflect state change
            fetchAppointments();
        } catch (err) {
            console.error("Failed to update appointment status", err);
            alert("Error updating appointment.");
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <header className="nav-header">
                <div className="nav-brand">🏥 MedConnect</div>
                <div className="nav-user">
                    <span className="user-badge doctor">Doctor Portal</span>
                    <button className="btn-logout" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <div className="dashboard-wrapper">
                <h1 className="dashboard-title">Doctor Schedule Dashboard</h1>
                <p className="dashboard-subtitle">Welcome back, Doctor. Below are your scheduled patient appointments.</p>

                <div className="dashboard-card card-3d" style={{ maxWidth: '100%' }}>
                    <h3>📅 Upcoming Patient Appointments</h3>

                    {loading ? (
                        <div className="spinner-3d-wrapper">
                            <div className="spinner-3d">
                                <div className="spinner-ring"></div>
                                <div className="spinner-ring"></div>
                                <div className="spinner-ring"></div>
                            </div>
                            <div className="loading-text">Loading Schedule...</div>
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="empty-indicator">No appointments booked yet.</div>
                    ) : (
                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Patient Name</th>
                                        <th>Date & Time</th>
                                        <th>Current Status</th>
                                        <th style={{ textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map(appt => {
                                        let statusClass = 'pending';
                                        if (appt.status === 'accepted') statusClass = 'accepted';
                                        if (appt.status === 'rejected') statusClass = 'rejected';

                                        return (
                                            <tr key={appt.id}>
                                                <td style={{ fontWeight: '600' }}>
                                                    {appt.patient_name}
                                                </td>
                                                <td>
                                                    {new Date(appt.appointment_date).toLocaleString()}
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${statusClass}`}>
                                                        {appt.status}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    {appt.status === 'pending' ? (
                                                        <>
                                                            <button 
                                                                onClick={() => handleStatusUpdate(appt.id, 'accepted')} 
                                                                className="btn-action-accept"
                                                            >
                                                                Accept
                                                            </button>
                                                            <button 
                                                                onClick={() => handleStatusUpdate(appt.id, 'rejected')} 
                                                                className="btn-action-reject"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                                                            Processed
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <footer className="portal-footer">
                <p>Developer Name: <strong>Arpit Wasnik</strong> &bull; Gmail: <a href="mailto:arpitwasni25@gmail.com">arpitwasni25@gmail.com</a></p>
            </footer>
        </div>
    );
}

export default DoctorDashboard;