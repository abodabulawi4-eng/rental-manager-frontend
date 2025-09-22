import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  Button,
  VStack,
  HStack,
  useToast,
  Card,
  CardBody,
  Text,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  SimpleGrid,
  Select,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, ViewIcon, SearchIcon } from '@chakra-ui/icons';
import { FaUsers } from 'react-icons/fa';

// تمت إضافة هذا السطر الجديد
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function TenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({ property_id: '', full_name: '', phone: '', address: '', start_date: '', rent_amount: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const [selectedTenant, setSelectedTenant] = useState(null);
  const cancelRef = React.useRef();
  const toast = useToast();
  const token = localStorage.getItem('token');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTenants, setFilteredTenants] = useState([]);

  const showToast = useCallback((title, description, status) => {
    toast({ title, description, status, duration: 5000, isClosable: true });
  }, [toast]);

  const fetchTenants = useCallback(async () => {
    try {
      // تم تعديل هذا السطر
      const response = await fetch(`${API_URL}/tenants`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTenants(data);
    } catch (error) {
      showToast('Error', 'Failed to fetch tenants.', 'error');
    }
  }, [token, showToast]);

  const fetchProperties = useCallback(async () => {
    try {
      // تم تعديل هذا السطر
      const response = await fetch(`${API_URL}/properties`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      showToast('Error', 'Failed to fetch properties.', 'error');
    }
  }, [token, showToast]);

  useEffect(() => {
    fetchTenants();
    fetchProperties();
  }, [fetchTenants, fetchProperties]);
  
  useEffect(() => {
    const results = tenants.filter(tenant =>
      tenant.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTenants(results);
  }, [searchTerm, tenants]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = isEditing ? 'PUT' : 'POST';
      // تم تعديل هذا السطر
      const url = isEditing ? `${API_URL}/tenants/${currentId}` : `${API_URL}/tenants`;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast('Success!', `Tenant ${isEditing ? 'updated' : 'added'} successfully.`, 'success');
        onClose();
        setFormData({ property_id: '', full_name: '', phone: '', address: '', start_date: '', rent_amount: '' });
        fetchTenants();
      } else {
        showToast('Failed', `Failed to ${isEditing ? 'update' : 'add'} tenant.`, 'error');
      }
    } catch (error) {
      showToast('Network Error', 'Please check your connection.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      // تم تعديل هذا السطر
      const response = await fetch(`${API_URL}/tenants/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showToast('Success!', 'Tenant deleted successfully.', 'success');
        fetchTenants();
        onAlertClose();
      } else {
        showToast('Failed', 'Failed to delete tenant.', 'error');
      }
    } catch (error) {
      showToast('Network Error', 'Please check your connection.', 'error');
    }
  };

  const handleEdit = (tenant) => {
    setIsEditing(true);
    setCurrentId(tenant.id);
    setFormData(tenant);
    onOpen();
  };

  const handleQuickView = (tenant) => {
    setSelectedTenant(tenant);
    onDrawerOpen();
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ property_id: '', full_name: '', phone: '', address: '', start_date: '', rent_amount: '' });
    onOpen();
  };
  
  const openDeleteAlert = (id) => {
    setCurrentId(id);
    onAlertOpen();
  };
  
  return (
    <Box p={8}>
      <HStack justifyContent="space-between" mb={8}>
        <Heading as="h1" size="xl" color="teal.400">Tenants</Heading>
      </HStack>

      <HStack mb={4} spacing={4}>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            _placeholder={{ color: 'gray.400' }}
            bg="gray.800"
            color="white"
          />
        </InputGroup>
        <Select placeholder="Filter by property" bg="gray.800" color="white">
            {properties.map(property => (
                <option key={property.id} value={property.id}>{property.name}</option>
            ))}
        </Select>
      </HStack>
      
      {filteredTenants.length === 0 ? (
        <VStack spacing={4} align="center" py={12}>
          <Box as={FaUsers} size="64px" color="gray.500" />
          <Heading size="md" color="gray.400">No tenants found.</Heading>
          <Text color="gray.500">Start by registering your tenants.</Text>
        </VStack>
      ) : (
        <TableContainer>
          <Table variant="simple" colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th color="gray.400">Full Name</Th>
                <Th color="gray.400">Property</Th>
                <Th color="gray.400">Rent Amount</Th>
                <Th color="gray.400">Start Date</Th>
                <Th color="gray.400">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredTenants.map((tenant) => (
                <Tr key={tenant.id}>
                  <Td>{tenant.full_name}</Td>
                  <Td>{properties.find(p => p.id === tenant.property_id)?.name || 'N/A'}</Td>
                  <Td>${tenant.rent_amount}</Td>
                  <Td>
                    <HStack>
                      <IconButton icon={<ViewIcon />} colorScheme="blue" onClick={() => handleQuickView(tenant)} aria-label="Quick View" />
                      <IconButton icon={<EditIcon />} colorScheme="blue" onClick={() => handleEdit(tenant)} aria-label="Edit" />
                      <IconButton icon={<DeleteIcon />} colorScheme="red" onClick={() => openDeleteAlert(tenant.id)} aria-label="Delete" />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      <IconButton
        position="fixed"
        bottom="4"
        right="4"
        size="lg"
        isRound
        colorScheme="teal"
        icon={<AddIcon />}
        boxShadow="lg"
        onClick={openAddModal}
        aria-label="Add New Tenant"
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.700" color="white">
          <ModalHeader>{isEditing ? 'Edit Tenant' : 'Add New Tenant'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack as="form" onSubmit={handleSubmit} spacing={4}>
              <FormControl>
                <FormLabel>Property</FormLabel>
                <Select
                  name="property_id"
                  value={formData.property_id}
                  onChange={handleFormChange}
                  placeholder="Select property"
                >
                  {properties.map(property => (
                    <option key={property.id} value={property.id}>{property.name}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input name="full_name" value={formData.full_name} onChange={handleFormChange} placeholder="Enter full name" />
              </FormControl>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input name="phone" value={formData.phone} onChange={handleFormChange} placeholder="Enter phone number" />
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input name="address" value={formData.address} onChange={handleFormChange} placeholder="Enter address" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Start Date</FormLabel>
                <Input name="start_date" type="date" value={formData.start_date} onChange={handleFormChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Monthly Rent</FormLabel>
                <Input name="rent_amount" type="number" value={formData.rent_amount} onChange={handleFormChange} placeholder="Enter monthly rent" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
              {isEditing ? 'Update Tenant' : 'Add Tenant'}
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800" color="white">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Tenant
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this tenant? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => handleDelete(currentId)} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Quick View Side Panel */}
      <Drawer isOpen={isDrawerOpen} placement="right" onClose={onDrawerClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.800" color="white">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {selectedTenant?.full_name} Details
          </DrawerHeader>
          <DrawerBody>
            {selectedTenant && (
              <VStack spacing={4} align="start">
                <Text><strong>ID:</strong> {selectedTenant.id}</Text>
                <Text><strong>Property:</strong> {properties.find(p => p.id === selectedTenant.property_id)?.name || 'N/A'}</Text>
                <Text><strong>Phone:</strong> {selectedTenant.phone}</Text>
                <Text><strong>Address:</strong> {selectedTenant.address}</Text>
                <Text><strong>Start Date:</strong> {selectedTenant.start_date}</Text>
                <Text><strong>Monthly Rent:</strong> ${selectedTenant.rent_amount}</Text>
              </VStack>
            )}
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onDrawerClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default TenantsPage;