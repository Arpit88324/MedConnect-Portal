import axios from 'axios';

// The URL where your Flask server is running
const API_URL = 'http://127.0.0.1:5000/api';

// 1. Send registration data (email, password, name, role) to backend
export const registerUser = async (userData) => {
    return await axios.post(`${API_URL}/auth/register`, userData);
};

// 2. Send login credentials and receive the secure JWT token
export const loginUser = async (credentials) => {
    return await axios.post(`${API_URL}/auth/login`, credentials);
};
// 3. Fetch all active doctors
export const getDoctors = async () => {
    return await axios.get(`${API_URL}/doctors`);
};

// 4. Submit an appointment booking request
export const bookAppointment = async (bookingData) => {
    return await axios.post(`${API_URL}/appointments/book`, bookingData);
};
// 5. Fetch all appointments for a specific doctor
export const getDoctorAppointments = async (doctorId) => {
    return await axios.get(`${API_URL}/doctor/${doctorId}/appointments`);
};
// 6. Update the booking status of an appointment
export const updateAppointmentStatus = async (appointmentId, status) => {
    return await axios.put(`${API_URL}/appointments/${appointmentId}/status`, { status });
};