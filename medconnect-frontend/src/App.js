import React, { useState } from 'react';
// Changed BrowserRouter to HashRouter here
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import ThreeDCanvas from './ThreeDCanvas';
import LoadingScreen from './LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Router>
      {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}
      <ThreeDCanvas />
      <Routes>
        {/* Default page shows the login screen */}
        <Route path="/" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;