import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  useToast,
  IconButton,
  Tooltip,
  Spinner,
} from '@chakra-ui/react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: '',
    category: '',
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/expenses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch expenses.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (expense = null) => {
    setSelectedExpense(expense);
    if (expense) {
      setForm({
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        category: expense.category,
      });
    } else {
      setForm({
        description: '',
        amount: '',
        date: '',
        category: '',
      });
    }
    onOpen();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const url = selectedExpense
      ? `http://localhost:5000/expenses/${selectedExpense.id}`
      : 'http://localhost:5000/expenses';
    const method = selectedExpense ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Expense ${selectedExpense ? 'updated' : 'added'} successfully.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchData();
        onClose();
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Something went wrong.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect to the server.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/expenses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Expense deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchData();
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Something went wrong.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect to the server.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8}>
      <HStack justifyContent="space-between" mb={6}>
        <Heading as="h1" size="xl">Expenses</Heading>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="teal"
          onClick={() => handleOpenModal()}
        >
          Add Expense
        </Button>
      </HStack>

      {isLoading ? (
        <VStack>
          <Spinner size="xl" />
          <Text>Loading expenses...</Text>
        </VStack>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Description</Th>
                <Th isNumeric>Amount</Th>
                <Th>Date</Th>
                <Th>Category</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {expenses.map((expense) => (
                <Tr key={expense.id}>
                  <Td>{expense.description}</Td>
                  <Td isNumeric>${expense.amount.toFixed(2)}</Td>
                  <Td>{expense.date}</Td>
                  <Td>{expense.category}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Tooltip label="Edit">
                        <IconButton
                          icon={<FaEdit />}
                          size="sm"
                          onClick={() => handleOpenModal(expense)}
                          aria-label="Edit expense"
                        />
                      </Tooltip>
                      <Tooltip label="Delete">
                        <IconButton
                          icon={<FaTrash />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(expense.id)}
                          aria-label="Delete expense"
                        />
                      </Tooltip>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedExpense ? 'Edit Expense' : 'Add New Expense'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Amount ($)</FormLabel>
                <Input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>Cancel</Button>
            <Button colorScheme="teal" onClick={handleSubmit}>
              {selectedExpense ? 'Save Changes' : 'Add Expense'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ExpensesPage;