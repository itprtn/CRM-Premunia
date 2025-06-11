import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginForm from './components/Auth/LoginForm';
import Layout from './components/Layout/Layout';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import CommercialDashboard from './components/Dashboard/CommercialDashboard';
import ProspectsList from './components/Prospects/ProspectsList';
import ProspectDetail from './components/Prospects/ProspectDetail';
import AutomationList from './components/Automation/AutomationList';
import ContractsList from './components/Contracts/ContractsList';
import CompaniesList from './components/Companies/CompaniesList';
import UsersList from './components/Users/UsersList';
import ImportData from './components/Import/ImportData';
import Reports from './components/Reports/Reports';
import Settings from './components/Settings/Settings';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <Layout>
      <Routes>
        <Route 
          path="/dashboard" 
          element={
            user?.role === 'Admin' ? <AdminDashboard /> : <CommercialDashboard />
          } 
        />
        <Route path="/prospects" element={<ProspectsList />} />
        <Route path="/prospects/:id" element={<ProspectDetail />} />
        <Route path="/contracts" element={<ContractsList />} />
        <Route path="/companies" element={<CompaniesList />} />
        {user?.role === 'Admin' && (
          <>
            <Route path="/users" element={<UsersList />} />
            <Route path="/automation" element={<AutomationList />} />
            <Route path="/import" element={<ImportData />} />
            <Route path="/reports" element={<Reports />} />
          </>
        )}
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;