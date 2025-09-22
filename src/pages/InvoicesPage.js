import React, { useState, useEffect } from 'react';
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
  Select,
  useToast,
  Tag,
  TagLabel,
  IconButton,
  Tooltip,
  Spinner,
} from '@chakra-ui/react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaFilePdf, // تم إضافة هذا الرمز
} from 'react-icons/fa';
import ReceiptModal from '../components/ReceiptModal'; // تم استيراد المكون الجديد

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isReceiptModalOpen, onOpen: onReceiptModalOpen, onClose: onReceiptModalClose } = useDisclosure();
  const toast = useToast();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    tenant_id: '',
    amount: '',
    due_date: '',
    status: 'pending',
    paid_date: '',
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [invoicesRes, tenantsRes, propertiesRes] = await Promise.all([
        fetch('http://localhost:5000/invoices', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5000/tenants', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5000/properties', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [invoicesData, tenantsData, propertiesData] = await Promise.all([
        invoicesRes.json(),
        tenantsRes.json(),
        propertiesRes.json(),
      ]);

      // Enrich invoices with tenant and property names
      const enrichedInvoices = invoicesData.map(invoice => {
        const tenant = tenantsData.find(t => t.id === invoice.tenant_id);
        const property = propertiesData.find(p => p.id === tenant?.property_id);
        return {
          ...invoice,
          tenant_name: tenant?.full_name || 'N/A',
          property_name: property?.name || 'N/A',
        };
      });

      setInvoices(enrichedInvoices);
      setTenants(tenantsData);
      setProperties(propertiesData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch data.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleOpenModal = (invoice = null) => {
    setSelectedInvoice(invoice);
    if (invoice) {
      setForm({
        tenant_id: invoice.tenant_id,
        amount: invoice.amount,
        due_date: invoice.due_date,
        status: invoice.status,
        paid_date: invoice.paid_date || '',
      });
    } else {
      setForm({
        tenant_id: '',
        amount: '',
        due_date: '',
        status: 'pending',
        paid_date: '',
      });
    }
    onOpen();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const url = selectedInvoice
      ? `http://localhost:5000/invoices/${selectedInvoice.id}`
      : 'http://localhost:5000/invoices';
    const method = selectedInvoice ? 'PUT' : 'POST';

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
          description: `Invoice ${selectedInvoice ? 'updated' : 'added'} successfully.`,
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
      const response = await fetch(`http://localhost:5000/invoices/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Invoice deleted successfully.',
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

  const handleGenerateReceipt = (invoice) => {
    setSelectedInvoice(invoice);
    onReceiptModalOpen();
  };

  const getStatusTagColor = (status) => {
    switch (status) {
      case 'paid':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'overdue':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box p={8}>
      <HStack justifyContent="space-between" mb={6}>
        <Heading as="h1" size="xl">Invoices</Heading>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="teal"
          onClick={() => handleOpenModal()}
        >
          Add Invoice
        </Button>
      </HStack>

      {isLoading ? (
        <VStack>
          <Spinner size="xl" />
          <Text>Loading invoices...</Text>
        </VStack>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Tenant</Th>
                <Th>Property</Th>
                <Th isNumeric>Amount</Th>
                <Th>Due Date</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {invoices.map((invoice) => (
                <Tr key={invoice.id}>
                  <Td>{invoice.tenant_name}</Td>
                  <Td>{invoice.property_name}</Td>
                  <Td isNumeric>${invoice.amount.toFixed(2)}</Td>
                  <Td>{invoice.due_date}</Td>
                  <Td>
                    <Tag size="sm" colorScheme={getStatusTagColor(invoice.status)}>
                      <TagLabel>{invoice.status}</TagLabel>
                    </Tag>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Tooltip label="Edit">
                        <IconButton
                          icon={<FaEdit />}
                          size="sm"
                          onClick={() => handleOpenModal(invoice)}
                          aria-label="Edit invoice"
                        />
                      </Tooltip>
                      <Tooltip label="Delete">
                        <IconButton
                          icon={<FaTrash />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(invoice.id)}
                          aria-label="Delete invoice"
                        />
                      </Tooltip>
                      {invoice.status === 'paid' && (
                        <Tooltip label="Generate Receipt">
                          <IconButton
                            icon={<FaFilePdf />}
                            size="sm"
                            colorScheme="green"
                            onClick={() => handleGenerateReceipt(invoice)}
                            aria-label="Generate receipt"
                          />
                        </Tooltip>
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Existing Modal for Add/Edit Invoice */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedInvoice ? 'Edit Invoice' : 'Add New Invoice'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Tenant</FormLabel>
                <Select
                  name="tenant_id"
                  value={form.tenant_id}
                  onChange={handleChange}
                >
                  <option value="">Select Tenant</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.full_name}
                    </option>
                  ))}
                </Select>
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
                <FormLabel>Due Date</FormLabel>
                <Input
                  type="date"
                  name="due_date"
                  value={form.due_date}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </Select>
              </FormControl>
              {form.status === 'paid' && (
                <FormControl>
                  <FormLabel>Paid Date</FormLabel>
                  <Input
                    type="date"
                    name="paid_date"
                    value={form.paid_date}
                    onChange={handleChange}
                  />
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>Cancel</Button>
            <Button colorScheme="teal" onClick={handleSubmit}>
              {selectedInvoice ? 'Save Changes' : 'Add Invoice'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* New Modal for Receipt */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={onReceiptModalClose}
        invoice={selectedInvoice}
      />
    </Box>
  );
};

export default InvoicesPage;