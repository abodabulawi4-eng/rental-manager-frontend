import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Button,
  IconButton,
  HStack,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Link,
} from '@chakra-ui/react';
import {
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import PropertiesPage from '../pages/PropertiesPage';
import TenantsPage from '../pages/TenantsPage';
import InvoicesPage from '../pages/InvoicesPage';
import ExpensesPage from '../pages/ExpensesPage';
import AdminPanel from '../pages/AdminPanel'; // تم تصحيح اسم الملف
import { FaUserShield, FaHome, FaBuilding, FaUsers, FaDollarSign, FaSignOutAlt, FaChevronRight, FaUserCircle, FaGithub, FaFileInvoiceDollar, FaMoneyBillWave } from 'react-icons/fa';

const NavItem = ({ icon, text, to, navigate, location }) => (
  <Button
    leftIcon={icon}
    justifyContent="flex-start"
    variant="ghost"
    _hover={{ bg: 'teal.700', color: 'white' }}
    width="100%"
    onClick={() => navigate(to)}
    color={location.pathname.startsWith(to) ? 'teal.400' : 'gray.400'}
  >
    {text}
  </Button>
);

const Sidebar = ({ isExpanded, navigate, location, isAdmin }) => (
  <VStack
    h="full"
    minW={isExpanded ? '250px' : '80px'}
    bg="gray.800"
    p={4}
    align="start"
    spacing={4}
    transition="width 0.2s"
  >
    <VStack align="start" spacing={1} width="full" mb={8}>
      <Text fontSize="2xl" fontWeight="bold" color="teal.400">
        {isExpanded ? 'Rental Manager' : 'RM'}
      </Text>
      <Text fontSize="sm" color="gray.500" display={isExpanded ? 'block' : 'none'}>
        Property Management
      </Text>
    </VStack>

    <VStack align="start" spacing={2} width="full">
      <NavItem icon={<FaHome />} text="Dashboard" to="/dashboard" navigate={navigate} location={location} />
      <NavItem icon={<FaBuilding />} text="Properties" to="/properties" navigate={navigate} location={location} />
      <NavItem icon={<FaUsers />} text="Tenants" to="/tenants" navigate={navigate} location={location} />
      <NavItem icon={<FaFileInvoiceDollar />} text="Invoices" to="/invoices" navigate={navigate} location={location} />
      <NavItem icon={<FaMoneyBillWave />} text="Expenses" to="/expenses" navigate={navigate} location={location} />
      {isAdmin && (
        <NavItem icon={<FaUserShield />} text="Admin Panel" to="/admin" navigate={navigate} location={location} />
      )}
    </VStack>
  </VStack>
);

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(payload.isAdmin);
      } catch (e) {
        console.error("Invalid token format");
        setIsAdmin(false); // Ensure isAdmin is false on invalid token
      }
    } else {
      setIsAdmin(false); // Ensure isAdmin is false if no token exists
    }
  }, []);

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin'); // إضافة هذا السطر لإزالة صلاحية المدير
    toast({
      title: 'Logged out successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/login');
  };

  const breadcrumbItems = location.pathname.split('/').filter(path => path);

  return (
    <Flex direction="column" minH="100vh" bg="gray.900" color="white">
      <Flex
        as="header"
        p={4}
        bg="gray.800"
        borderBottom="1px"
        borderColor="gray.700"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Breadcrumb separator={<FaChevronRight color="gray.500" />} fontSize="sm">
            {breadcrumbItems.map((item, index) => (
              <BreadcrumbItem key={index}>
                <BreadcrumbLink as={Link} to={`/${item}`} textTransform="capitalize" color="gray.400">
                  {item}
                </BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        </Box>
        <HStack spacing={4}>
          <Text fontSize="sm" color="gray.400">Welcome, User</Text>
          <Menu>
            <MenuButton as={IconButton} icon={<FaUserCircle />} variant="ghost" color="white" />
            <MenuList bg="gray.700" borderColor="gray.600">
              <MenuItem bg="gray.700" color="white" onClick={onLogout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      <Flex flex="1">
        <Sidebar navigate={navigate} location={location} isAdmin={isAdmin} />
        <Box flex="1" p={8} overflowY="auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="properties" element={<PropertiesPage />} />
            <Route path="tenants" element={<TenantsPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="admin" element={<AdminPanel />} />
          </Routes>
        </Box>
      </Flex>

      <Flex
        as="footer"
        p={4}
        bg="gray.800"
        borderTop="1px"
        borderColor="gray.700"
        justifyContent="space-between"
        alignItems="center"
        mt="auto"
        flexShrink={0}
      >
        <Text fontSize="sm" color="gray.500">
          © {new Date().getFullYear()} Rental Manager. All rights reserved.
        </Text>
        <HStack spacing={4}>
          <Link href="#" fontSize="sm" color="gray.400">Privacy Policy</Link>
          <Link href="#" fontSize="sm" color="gray.400">Terms of Service</Link>
          <Link href="https://github.com/your-github-repo" isExternal fontSize="sm" color="gray.400">
            <HStack>
              <FaGithub />
              <Text>GitHub</Text>
            </HStack>
          </Link>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default AppLayout;