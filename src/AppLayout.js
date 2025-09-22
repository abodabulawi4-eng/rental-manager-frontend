import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import PropertiesPage from './pages/PropertiesPage';
import TenantsPage from './pages/TenantsPage';
import InvoicesPage from './pages/InvoicesPage';
import ExpensesPage from './pages/ExpensesPage';

const AppLayout = () => {
  return (
    <Box>
      <Sidebar>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/tenants" element={<TenantsPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Sidebar>
    </Box>
  );
};

export default AppLayout;