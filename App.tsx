import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { NewProject } from './pages/NewProject';
import { AutoML } from './pages/AutoML';
import { AIStudio } from './pages/AIStudio';
import { DataSpace } from './pages/DataSpace';
import { Permissions } from './pages/Permissions';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.email !== 'admin@admin.com') {
     return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
};


const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
            
            <Route path="/data-space" element={
                <ProtectedRoute>
                    <DataSpace />
                </ProtectedRoute>
            } />
            
            <Route path="/permissions" element={
                <AdminRoute>
                    <Permissions />
                </AdminRoute>
            } />

            <Route path="/new-project" element={
                <ProtectedRoute>
                    <NewProject />
                </ProtectedRoute>
            } />

            <Route path="/automl" element={
                <ProtectedRoute>
                    <AutoML />
                </ProtectedRoute>
            } />

            <Route path="/ai-studio" element={
                <ProtectedRoute>
                    <AIStudio />
                </ProtectedRoute>
            } />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
};

export default App;