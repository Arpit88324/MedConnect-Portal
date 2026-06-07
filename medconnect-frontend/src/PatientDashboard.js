import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoctors, bookAppointment } from './api';

function PatientDashboard() {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [message, setMessage] = useState('');

    // Fetch doctors list automatically when the component loads
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await getDoctors();
                setDoctors(response.data);
            } catch (err) {
                console.error("Error fetching doctors", err);
            }
        };
        fetchDoctors();
    }, []);

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                patient_id: 1, // Static placeholder for testing data relationships
                doctor_id: selectedDoctor,
                appointment_date: appointmentDate
            };

            const response = await bookAppointment(payload);
            setMessage(response.data.message);
        } catch (err) {
            setMessage("Failed to book appointment.");
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <header className="nav-header">
                <div className="nav-brand">🏥 MedConnect</div>
                <div className="nav-user">
                    <span className="user-badge patient">Patient Portal</span>
                    <button className="btn-logout" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <div className="dashboard-wrapper">
                <h1 className="dashboard-title">Patient Health Portal</h1>
                <p className="dashboard-subtitle">Select a practitioner and schedule your medical slot</p>

                <div className="dashboard-grid">
                    <div className="dashboard-card card-3d">
                        <h3>🩺 Available Practitioners</h3>
                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Doctor Name</th>
                                        <th>Specialization</th>
                                        <th>Consultation Fee</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctors.map(doc => (
                                        <tr key={doc.id}>
                                            <td style={{ fontWeight: '600' }}>{doc.name}</td>
                                            <td>{doc.specialization}</td>
                                            <td style={{ fontWeight: '700', color: 'var(--color-primary)' }}>₹{doc.fees}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="dashboard-card card-3d">
                        <h3>📅 Book an Appointment</h3>
                        {message && (
                            <div className="alert-message alert-success">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleBooking}>
                            <div className="form-group">
                                <label className="form-label">Select Doctor</label>
                                <select 
                                    className="form-input" 
                                    required 
                                    onChange={(e) => setSelectedDoctor(e.target.value)}
                                >
                                    <option value="">-- Choose a Practitioner --</option>
                                    {doctors.map(doc => (
                                        <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Preferred Date & Time</label>
                                <input 
                                    type="datetime-local" 
                                    className="form-input" 
                                    required 
                                    onChange={(e) => setAppointmentDate(e.target.value)} 
                                />
                            </div>

                            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                                Confirm Appointment Slot
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <footer className="portal-footer">
                <p>Developer Name: <strong>Arpit Wasnik</strong> &bull; Gmail: <a href="mailto:arpitwasni25@gmail.com">arpitwasni25@gmail.com</a></p>
            </footer>
        </div>
    );
}

export default PatientDashboard;