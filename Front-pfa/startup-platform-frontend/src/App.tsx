import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './components/startup/StartupProfile';
import ProtectedRoute from './components/auh/ProtectedRoute';
import { ROLES } from './utils/constants';
import PitchPage from './components/startup/pitchAI';
import HomePage from './pages/Home';
import InvestorsPage from './pages/InvestorsPage';
import InvestorDashboard from './components/investor/investor-dash';
import InvestorProfile from './components/investor/profile-investor';
import InvestorConnectionsPage from './components/investor/connections';
import CalendarPage from './components/startup/calendar';
import SettingsPage from './pages/settings';
import InvestorMeetingsPage from './components/investor/investor-calendar';


function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Routes protégées */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile-investor" 
          element={
            <ProtectedRoute>
              <InvestorProfile />
            </ProtectedRoute>
          } 
        />
          <Route 
          path="/investor/startups" 
          element={
            <ProtectedRoute>
              <InvestorConnectionsPage />
            </ProtectedRoute>
          } 
        />
<Route 
  path="/calendar" 
  element={
    <ProtectedRoute>
      <CalendarPage />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/settings" 
  element={
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/investor-calendar" 
  element={
    <ProtectedRoute>
      <InvestorMeetingsPage />
    </ProtectedRoute>
  } 
/>

        <Route 
          path="/generateur" 
          element={
            <ProtectedRoute>
              <PitchPage />
            </ProtectedRoute>
          } 
        />
          <Route 
          path="/home" 
          element={
            
              <HomePage />
          
          } 
        />
         <Route 
          path="/investisseurs" 
          element={
            <ProtectedRoute>
              <InvestorsPage />
            </ProtectedRoute>
          } 
        />
          <Route 
          path="/investor-dashboard" 
          element={
            <ProtectedRoute>
              <InvestorDashboard />
            </ProtectedRoute>
          } 
        />
       

        {/* Redirection par défaut */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 404 */}
        <Route path="*" element={<div>Page non trouvée</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;