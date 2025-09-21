import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const formBg = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast({
          title: 'Registration successful!',
          description: 'You can now log in.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/login');
      } else {
        const errorData = await response.json();
        toast({
          title: 'Registration failed.',
          description: errorData.error || 'Something went wrong.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect to the server. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      bg={useColorModeValue('gray.50', 'gray.900')}
    >
      <Box
        p={8}
        maxWidth="md"
        width="100%"
        bg={formBg}
        boxShadow="md"
        borderRadius="md"
        color={textColor}
      >
        <VStack spacing={6} as="form" onSubmit={handleSubmit}>
          <Heading as="h1" size="xl" textAlign="center" color="teal.500">
            Register
          </Heading>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              bg={useColorModeValue('white', 'gray.800')}
              borderColor={useColorModeValue('gray.300', 'gray.600')}
              _hover={{ borderColor: 'teal.500' }}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              bg={useColorModeValue('white', 'gray.800')}
              borderColor={useColorModeValue('gray.300', 'gray.600')}
              _hover={{ borderColor: 'teal.500' }}
            />
          </FormControl>
          <FormControl id="confirm-password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              bg={useColorModeValue('white', 'gray.800')}
              borderColor={useColorModeValue('gray.300', 'gray.600')}
              _hover={{ borderColor: 'teal.500' }}
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="teal"
            size="lg"
            width="full"
          >
            Register
          </Button>
          <Text fontSize="sm" mt={4} textAlign="center">
            Already have an account?{' '}
            <Link color="teal.500" onClick={() => navigate('/login')}>
              Log In
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default RegisterPage;