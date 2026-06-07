import React, { useState } from 'react';
import { loginUser } from './api';
import { useNavigate } from 'react-router-dom'; // Import router hook
import doctorAvatar from './assets/doctor_avatar.png'; // 1. Imported the avatar module directly

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [showDesc, setShowDesc] = useState(false);
    const navigate = useNavigate(); // Initialize navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({ email, password });

            // Save secure session tokens locally
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);

            setIsError(false);

            // Automatically redirect based on backend role payload
            if (response.data.role === 'patient') {
                navigate('/patient-dashboard');
            } else if (response.data.role === 'doctor') {
                navigate('/doctor-dashboard');
            }
        } catch (err) {
            setIsError(true);
            setMessage(err.response?.data?.error || 'Could not connect to backend server.');
        }
    };

    return (
        <div className="auth-wrapper animate-fade-in" style={{ flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '40px 20px', boxSizing: 'border-box' }}>
                <div className="auth-card card-3d">
                    <div
                        className="doctor-avatar-container"
                        onClick={() => setShowDesc(true)}
                        style={{ cursor: 'pointer' }}
                        title="Click for Website Info"
                    >
                        {/* 2. Updated src to use the imported variable instead of a raw string path */}
                        <img
                            src={doctorAvatar}
                            alt="MedConnect Doctor"
                            className="doctor-avatar-img"
                        />
                    </div>
                    <h2 className="auth-title">MedConnect Portal</h2>
                    <p className="auth-subtitle">Secure access to patient & clinician portals</p>

                    {message && (
                        <div className={`alert-message ${isError ? 'alert-error' : 'alert-success'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                required
                                placeholder="Enter your email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                required
                                placeholder="Enter your password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-primary">
                            Sign In
                        </button>
                    </form>
                </div>
            </div>

            <footer className="portal-footer">
                <p>Developer Name: <strong>Arpit Wasnik</strong></p>
                <p>Gmail: <a href="mailto:arpitwasni25@gmail.com">arpitwasni25@gmail.com</a></p>
            </footer>

            {showDesc && (
                <div className="description-modal-overlay" onClick={() => setShowDesc(false)}>
                    <div className="description-modal-card animate-slide-up" onClick={(e) => e.stopPropagation()}>
                        <button className="btn-close-modal" onClick={() => setShowDesc(false)}>×</button>
                        <h2 className="modal-title">About MedConnect</h2>
                        <div className="modal-content">
                            <p><strong>MedConnect</strong> is a fully operational, full-stack healthcare portal engineered by <strong>Arpit Wasnik</strong> to connect patients with medical specialists in real time.</p>

                            <p>The platform acts as a secure, bi-directional communication network divided into two primary experiences:</p>

                            <div className="modal-feature-box">
                                <h4>🏥 The Patient Portal</h4>
                                <p>Patients can log in securely, view an interactive list of available doctors along with their specializations and consulting fees, select an upcoming date and time slot, and instantly book a consultation.</p>
                            </div>

                            <div className="modal-feature-box">
                                <h4>👨‍⚕️ The Doctor Dashboard</h4>
                                <p>Medical professionals can access their own private workspace where the system dynamically isolates and loads only their specific incoming schedule. Doctors have administrative control to review patient bookings and instantly update the appointment status (Accept or Reject) in real time.</p>
                            </div>

                            <p>At its core, the website handles end-to-end data safety by encrypting user passwords, authorizing account sessions securely, and managing a structured database system to ensure that all patient records and appointment updates remain permanent, synchronized, and safe.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;