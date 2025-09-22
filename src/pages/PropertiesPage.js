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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { FaBuilding } from 'react-icons/fa';

// تمت إضافة هذا السطر الجديد
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({ name: '', address: '', total_units: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();
  const token = localStorage.getItem('token');

  const showToast = useCallback((title, description, status) => {
    toast({ title, description, status, duration: 5000, isClosable: true });
  }, [toast]);

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
    fetchProperties();
  }, [fetchProperties]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const method = isEditing ? 'PUT' : 'POST';
      // تم تعديل هذا السطر
      const url = isEditing ? `${API_URL}/properties/${currentId}` : `${API_URL}/properties`;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast('Success!', `Property ${isEditing ? 'updated' : 'added'} successfully.`, 'success');
        onClose();
        setFormData({ name: '', address: '', total_units: '' });
        fetchProperties();
      } else {
        showToast('Failed', `Failed to ${isEditing ? 'update' : 'add'} property.`, 'error');
      }
    } catch (error) {
      showToast('Network Error', 'Please check your connection.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      // تم تعديل هذا السطر
      const response = await fetch(`${API_URL}/properties/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showToast('Success!', 'Property deleted successfully.', 'success');
        fetchProperties();
        onAlertClose();
      } else {
        showToast('Failed', 'Failed to delete property.', 'error');
      }
    } catch (error) {
      showToast('Network Error', 'Please check your connection.', 'error');
    }
  };

  const handleEdit = (property) => {
    setIsEditing(true);
    setCurrentId(property.id);
    setFormData(property);
    onOpen();
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ name: '', address: '', total_units: '' });
    onOpen();
  };

  const openDeleteAlert = (id) => {
    setCurrentId(id);
    onAlertOpen();
  };
  
  return (
    <Box p={8}>
      <HStack justifyContent="space-between" mb={8}>
        <Heading as="h1" size="xl" color="teal.400">Properties</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={openAddModal}>
          Add New Property
        </Button>
      </HStack>

      {properties.length === 0 ? (
        <VStack spacing={4} align="center" py={12}>
          <Box as={FaBuilding} size="64px" color="gray.500" />
          <Heading size="md" color="gray.400">No properties found.</Heading>
          <Text color="gray.500">Add your first property to get started!</Text>
        </VStack>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {properties.map((property) => (
            <Card key={property.id} bg="gray.800" color="white" boxShadow="lg">
              <CardBody>
                <VStack align="start" spacing={3}>
                  <Heading size="md" color="teal.400">{property.name}</Heading>
                  <Text fontSize="sm" color="gray.400">ID: {property.id}</Text>
                  <Text><strong>Address:</strong> {property.address}</Text>
                  <Text><strong>Total Units:</strong> {property.total_units}</Text>
                  <HStack mt={4}>
                    <IconButton icon={<EditIcon />} colorScheme="blue" onClick={() => handleEdit(property)} aria-label="Edit" />
                    <IconButton icon={<DeleteIcon />} colorScheme="red" onClick={() => openDeleteAlert(property.id)} aria-label="Delete" />
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.700" color="white">
          <ModalHeader>{isEditing ? 'Edit Property' : 'Add New Property'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack as="form" spacing={4}>
              <FormControl isRequired>
                <FormLabel>Property Name</FormLabel>
                <Input name="name" value={formData.name} onChange={handleFormChange} placeholder="Enter name" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Address</FormLabel>
                <Input name="address" value={formData.address} onChange={handleFormChange} placeholder="Enter address" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Total Units</FormLabel>
                <Input name="total_units" type="number" value={formData.total_units} onChange={handleFormChange} placeholder="Enter total units" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
              {isEditing ? 'Update Property' : 'Add Property'}
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
              Delete Property
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this property? This action cannot be undone.
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
    </Box>
  );
}

export default PropertiesPage;