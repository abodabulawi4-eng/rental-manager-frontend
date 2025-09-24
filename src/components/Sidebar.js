import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  useColorMode,
  useColorModeValue,
  Flex,
  IconButton,
  Heading,
  Button,
  Spacer,
  useToast,
} from '@chakra-ui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaBuilding, FaUsers, FaFileInvoiceDollar, FaRegMoneyBillAlt, FaSignOutAlt } from 'react-icons/fa';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const NavItem = ({ icon, children, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const activeBg = useColorModeValue('primary.100', 'primary.600');
  const activeColor = useColorModeValue('primary.700', 'white');
  const hoverBg = useColorModeValue('gray.200', 'gray.700');

  return (
    <Link to={to}>
      <HStack
        p={4}
        bg={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : 'inherit'}
        borderRadius="md"
        _hover={{ bg: hoverBg, transform: 'scale(1.05)', transition: 'all 0.2s' }}
        transition="all 0.2s ease-in-out"
        cursor="pointer"
      >
        <Icon as={icon} />
        <Text>{children}</Text>
      </HStack>
    </Link>
  );
};

const Sidebar = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    toast({
      title: 'Logged out successfully.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    navigate('/login');
  };

  return (
    <Flex h="100vh" w="100%" direction="row" overflow="hidden">
      <Box
        as="aside"
        w={{ base: '70px', md: '250px' }}
        p={4}
        bg={useColorModeValue('white', 'gray.900')} // استخدام مباشر للمتغير
        borderRight="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')} // استخدام مباشر للمتغير
        boxShadow="md"
      >
        <VStack spacing={8} align="stretch" h="100%">
          <HStack justifyContent="space-between">
            <Heading as="h2" size="md" color="textPrimary">Rent Manager</Heading>
            <IconButton
              size="md"
              aria-label="Toggle dark mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
            />
          </HStack>
          <VStack spacing={4} align="stretch" flex="1">
            <NavItem icon={FaTachometerAlt} to="/dashboard">Dashboard</NavItem>
            <NavItem icon={FaBuilding} to="/properties">Properties</NavItem>
            <NavItem icon={FaUsers} to="/tenants">Tenants</NavItem>
            <NavItem icon={FaFileInvoiceDollar} to="/invoices">Invoices</NavItem>
            <NavItem icon={FaRegMoneyBillAlt} to="/expenses">Expenses</NavItem>
          </VStack>
          <Spacer />
          <Button
            leftIcon={<FaSignOutAlt />}
            colorScheme="red"
            variant="ghost"
            onClick={handleLogout}
            alignSelf="flex-start"
          >
            Logout
          </Button>
        </VStack>
      </Box>
      <Box
        flex="1"
        p={8}
        overflowY="auto"
      >
        {children}
      </Box>
    </Flex>
  );
};

export default Sidebar;