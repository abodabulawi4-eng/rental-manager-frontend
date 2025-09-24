import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Text,
  Badge,
} from '@chakra-ui/react';
import React from 'react';

const ReceiptModal = ({ isOpen, onClose, receipt }) => {
  if (!receipt) {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'green';
      case 'pending':
        return 'orange';
      case 'overdue':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Receipt Details</ModalHeader>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text>
              **Invoice ID:** {receipt.id}
            </Text>
            <Text>
              **Tenant ID:** {receipt.tenant_id}
            </Text>
            <Text>
              **Amount:** ${receipt.amount}
            </Text>
            <Text>
              **Due Date:** {receipt.due_date}
            </Text>
            <Text>
              **Status:**{' '}
              <Badge colorScheme={getStatusColor(receipt.status)}>
                {receipt.status}
              </Badge>
            </Text>
            {receipt.paid_date && (
              <Text>
                **Paid Date:** {receipt.paid_date}
              </Text>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReceiptModal;