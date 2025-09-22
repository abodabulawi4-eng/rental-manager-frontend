import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Text,
  Spinner,
  Flex,
  Spacer,
  HStack,
  useColorModeValue,
  Card,
  CardBody,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { FaCheck, FaTimes, FaSearch, FaSortAlphaDown, FaSortAlphaUp, FaSortNumericDown, FaSortNumericUp, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// تمت إضافة هذا السطر الجديد
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminPanel = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date_requested', direction: 'descending' });
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const tableBg = useColorModeValue('gray.100', 'rgba(42, 42, 62, 0.5)');
  const cardBg = useColorModeValue('gray.50', 'card');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const fetchPendingUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // تم تعديل هذا السطر
      const response = await fetch(`${API_URL}/admin/users/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch pending users');
      }
      const data = await response.json();
      setPendingUsers(data.users);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    fetchPendingUsers();
  }, [fetchPendingUsers]);

  const handleAction = async (userId, action) => {
    try {
      // تم تعديل هذا السطر
      const response = await fetch(`${API_URL}/admin/users/${userId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to ${action} user`);
      }
      toast({
        title: `User ${action}d.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchPendingUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...pendingUsers];
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers.filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pendingUsers, sortConfig, searchTerm]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  return (
    <Box p={8} bg="background" color="textPrimary" minH="100vh">
      <Flex mb={6}>
        <Heading as="h1" size="xl" color="textPrimary">Admin Panel</Heading>
        <Spacer />
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FaUserCircle />}
            variant="ghost"
            fontSize="xl"
            color="white"
          />
          <MenuList bg="card" borderColor="gray.700">
            <MenuItem color="textPrimary" onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      
      <VStack spacing={8} align="stretch">
        <Text fontSize="md" color="textSecondary">Manage user registrations and permissions.</Text>
        
        <HStack w="full" my={4}>
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.500" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search users by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={cardBg}
              borderColor={borderColor}
            />
          </InputGroup>
          <Spacer />
        </HStack>

        <Card bg={tableBg} borderRadius="lg" overflow="hidden" boxShadow="lg">
          <CardBody p={0}>
            {isLoading ? (
              <Flex justify="center" align="center" p={10}>
                <Spinner size="xl" />
              </Flex>
            ) : (
              <Table variant="simple" colorScheme="whiteAlpha">
                <Thead>
                  <Tr bg="rgba(0, 194, 209, 0.1)">
                    <Th color="textPrimary" onClick={() => handleSort('id')}>
                      ID {sortConfig.key === 'id' && (sortConfig.direction === 'ascending' ? <FaSortNumericUp /> : <FaSortNumericDown />)}
                    </Th>
                    <Th color="textPrimary" onClick={() => handleSort('email')}>
                      Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? <FaSortAlphaUp /> : <FaSortAlphaDown />)}
                    </Th>
                    <Th color="textPrimary" onClick={() => handleSort('date_requested')}>
                      Date {sortConfig.key === 'date_requested' && (sortConfig.direction === 'ascending' ? <FaSortNumericUp /> : <FaSortNumericDown />)}
                    </Th>
                    <Th color="textPrimary">Status</Th>
                    <Th color="textPrimary">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sortedUsers.length > 0 ? (
                    sortedUsers.map((user) => (
                      <motion.tr 
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}
                      >
                        <Td>{user.id}</Td>
                        <Td>{user.email}</Td>
                        <Td>{new Date(user.date_requested).toLocaleDateString()}</Td>
                        <Td>
                          <Text color="teal.300">Pending</Text>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button
                              colorScheme="accent"
                              size="sm"
                              leftIcon={<Icon as={FaCheck} />}
                              onClick={() => handleAction(user.id, 'approve')}
                            >
                              Approve
                            </Button>
                            <Button
                              colorScheme="danger"
                              size="sm"
                              leftIcon={<Icon as={FaTimes} />}
                              onClick={() => handleAction(user.id, 'deny')}
                            >
                              Deny
                            </Button>
                          </HStack>
                        </Td>
                      </motion.tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={5} textAlign="center">
                        <Text color="gray.500">No pending users.</Text>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default AdminPanel;