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

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const formBg = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAdmin', data.isAdmin); // ** هذا السطر تم إضافته أو تعديله **
        toast({
          title: 'Login successful.',
          description: 'Redirecting to dashboard.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/'); // يتم توجيه جميع المستخدمين إلى المسار الرئيسي
      } else {
        const errorData = await response.json();
        if (response.status === 403) {
          toast({
            title: 'Login Failed.',
            description: errorData.error,
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Login Failed.',
            description: errorData.error || 'Invalid email or password.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Network Error.',
        description: 'Could not connect to the server.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue('gray.50', 'gray.900')}
    >
      <VStack
        as="form"
        onSubmit={handleSubmit}
        spacing={6}
        p={8}
        bg={formBg}
        rounded="lg"
        boxShadow="xl"
        w="full"
        maxW="md"
      >
        <Heading as="h1" size="xl" textAlign="center" color={textColor}>
          Log In
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
        <Button
          type="submit"
          colorScheme="teal"
          size="lg"
          width="full"
        >
          Log In
        </Button>
        <Text fontSize="sm" mt={4} textAlign="center">
          Don't have an account?{' '}
          <Link color="teal.500" onClick={() => navigate('/register')}>
            Sign Up
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default LoginPage;