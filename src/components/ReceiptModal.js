import React, { useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  VStack,
  HStack,
  Flex,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';

const ReceiptModal = ({ isOpen, onClose, invoice }) => {
  const receiptRef = useRef();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const receiptNo = invoice ? Math.floor(Math.random() * 1000000) : '';

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (printContent) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<html><head><title>Print Receipt</title>');
      printWindow.document.write('<style>');
      printWindow.document.write('@media print { body { -webkit-print-color-adjust: exact; } }');
      printWindow.document.write('body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; margin: 0; padding: 20px; }');
      printWindow.document.write('.receipt-container { background-color: white; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }');
      printWindow.document.write('.header { color: #2563EB; font-weight: bold; font-size: 24px; text-align: center; margin-bottom: 20px; }');
      printWindow.document.write('.title { font-size: 16px; font-weight: 500; color: #1E293B; }');
      printWindow.document.write('.value { font-size: 16px; color: #1E293B; font-weight: 400; }');
      printWindow.document.write('.amount { font-size: 32px; font-weight: bold; color: #16A34A; }');
      printWindow.document.write('hr { border: none; border-top: 1px dashed #ccc; margin: 20px 0; }');
      printWindow.document.write('.signature { margin-top: 40px; text-align: center; }');
      printWindow.document.write('</style></head><body>');
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleDownloadPdf = () => {
    const input = receiptRef.current;
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`receipt-${invoice?.id}.pdf`);
      });
    }
  };

  if (!invoice) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent
        as={motion.div}
        initial={{ y: "-100vh" }}
        animate={{ y: "0" }}
        transition={{ duration: 0.5 }}
        bg="background"
        p={0}
        borderRadius="lg"
      >
        <Box p={6} ref={receiptRef}>
          <VStack spacing={4} align="stretch" p={6} bg={cardBg} borderRadius="lg" boxShadow="lg">
            <Heading as="h2" size="xl" color="#2563EB" textAlign="center" mb={4}>
              <Box as="span" borderBottom="2px solid" borderColor="#2563EB" pb={1}>
                Receipt
              </Box>
            </Heading>
            <HStack justifyContent="space-between">
              <Box>
                <Text fontWeight="bold" color={textColor}>Receipt No.</Text>
                <Text>{receiptNo}</Text>
              </Box>
              <Box textAlign="right">
                <Text fontWeight="bold" color={textColor}>Date</Text>
                <Text>{new Date().toLocaleDateString()}</Text>
              </Box>
            </HStack>
            <Box w="full" bg={borderColor} h="1px" my={4} />

            <VStack spacing={4} align="flex-start">
              <HStack w="full" justifyContent="space-between">
                <Text fontWeight="bold" color={textColor}>Property:</Text>
                <Text>{invoice.property_name || 'N/A'}</Text>
              </HStack>
              <HStack w="full" justifyContent="space-between">
                <Text fontWeight="bold" color={textColor}>Tenant Name:</Text>
                <Text>{invoice.tenant_name || 'N/A'}</Text>
              </HStack>
              <HStack w="full" justifyContent="space-between">
                <Text fontWeight="bold" color={textColor}>Payment Method:</Text>
                {/* As there is no payment method in the invoice object, we'll use a placeholder */}
                <Text>Cash / Bank / Transfer</Text> 
              </HStack>
              <HStack w="full" justifyContent="space-between">
                <Text fontWeight="bold" color={textColor}>Date Paid:</Text>
                <Text>{invoice.paid_date ? new Date(invoice.paid_date).toLocaleDateString() : 'N/A'}</Text>
              </HStack>
            </VStack>

            <Box w="full" bg={borderColor} h="1px" my={4} />

            <HStack w="full" justifyContent="center">
              <Text fontWeight="bold" color={textColor}>Amount Paid:</Text>
              <Text fontSize="4xl" fontWeight="bold" color="#16A34A">
                ${invoice.amount}
              </Text>
            </HStack>

            <Box w="full" bg={borderColor} h="1px" my={4} />

            <Text textAlign="center" fontSize="sm" color={textColor} mt={8}>
              This is a digital receipt for your payment.
            </Text>
            
            <Box mt={4} textAlign="center">
              <Text fontStyle="italic" color={textColor}>
                Signature
              </Text>
              <Text mt={1} borderTop="1px solid" borderColor={textColor} pt={1} d="inline-block" px={4}>
                Rental Manager
              </Text>
            </Box>
          </VStack>
        </Box>

        <ModalFooter justifyContent="center" bg="background">
          <HStack spacing={4}>
            <Button
              colorScheme="accent"
              leftIcon={<FaPrint />}
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button
              colorScheme="blue"
              leftIcon={<FaFilePdf />}
              onClick={handleDownloadPdf}
            >
              Download PDF
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReceiptModal;