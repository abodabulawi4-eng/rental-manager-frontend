import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import PropertiesPage from './pages/PropertiesPage';
import TenantsPage from './pages/TenantsPage';
import InvoicesPage from './pages/InvoicesPage';
import ExpensesPage from './pages/ExpensesPage';
import AdminPanel from './pages/AdminPanel';
import Sidebar from './components/Sidebar';

const customTheme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: '#1E1E2F',
        color: '#F5F5F5',
        fontFamily: 'Poppins, sans-serif',
      },
      a: {
        color: 'primary.500',
        _hover: {
          textDecoration: 'none',
        },
      },
    }),
  },
  colors: {
    primary: {
      50: '#E6FBFC',
      100: '#B3F5F7',
      200: '#80F0F2',
      300: '#4DFBEB',
      400: '#1AF5E3',
      500: '#00C2D1', // Primary color: Aqua
      600: '#00A4B3',
      700: '#008796',
      800: '#006B78',
      900: '#004F5A',
    },
    accent: {
      500: '#2ECC71', // Approve: Mint Green
    },
    danger: {
      500: '#E74C3C', // Deny: Rose Red
    },
    background: '#1E1E2F',
    textPrimary: '#F5F5F5',
    textSecondary: '#B0B0B0',
    card: '#2A2A3E',
  },
  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Poppins', sans-serif`,
  },
});

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <ChakraProvider theme={customTheme}>
      <ColorModeScript initialColorMode={customTheme.config.initialColorMode} />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/admin" element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } />

          <Route path="/*" element={
            <PrivateRoute>
              <Sidebar>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/properties" element={<PropertiesPage />} />
                  <Route path="/tenants" element={<TenantsPage />} />
                  <Route path="/invoices" element={<InvoicesPage />} />
                  <Route path="/expenses" element={<ExpensesPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Sidebar>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;