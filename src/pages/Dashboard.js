import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  VStack,
  HStack,
  Icon,
  useToast,
  Spinner,
  List,
  ListItem,
  ListIcon,
  CardHeader,
  Flex,
  Spacer,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {
  FaBuilding,
  FaUsers,
  FaDollarSign,
  FaArrowDown,
  FaMoneyBillWave,
  FaPlus,
  FaMinus,
  FaBell,
  FaUserCircle,
  FaFileInvoiceDollar,
} from 'react-icons/fa';
import { Line, Bar } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    const duration = 1500;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const step = Math.min(progress / duration, 1);
      const easedValue = start + (end - start) * step;
      setDisplayValue(easedValue.toFixed(0));

      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="textPrimary">${displayValue}</Text>;
};

const CardItem = ({ title, value, icon, gradient }) => (
  <Card
    as={motion.div}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    bgGradient={gradient}
    color="white"
    borderRadius="xl"
    boxShadow="lg"
    overflow="hidden"
  >
    <CardBody>
      <VStack spacing={4} align="start">
        <HStack>
          <Icon as={icon} boxSize={8} />
          <Text fontSize="lg" fontWeight="semibold" ml={2}>{title}</Text>
        </HStack>
        {typeof value === 'number' ? <AnimatedNumber value={value} /> : <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">{value}</Text>}
      </VStack>
    </CardBody>
  </Card>
);

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const data = await response.json();
      setSummary(data.summary);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

 useEffect(() => {
  fetchData();
}, [token, toast, fetchData]);

  const chartData = {
    labels: summary?.chartData.labels,
    datasets: [
      {
        label: 'Income',
        data: summary?.chartData.income,
        backgroundColor: 'rgba(0, 194, 209, 0.6)',
        borderColor: '#00C2D1',
        borderWidth: 2,
        fill: true,
      },
      {
        label: 'Expenses',
        data: summary?.chartData.expenses,
        backgroundColor: 'rgba(231, 76, 60, 0.6)',
        borderColor: '#E74C3C',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'textPrimary',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'textSecondary',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'textSecondary',
        },
      },
    },
  };

  const quickActions = [
    { name: "Add Property", icon: FaBuilding, to: "/properties" },
    { name: "Add Tenant", icon: FaUsers, to: "/tenants" },
    { name: "Add Invoice", icon: FaFileInvoiceDollar, to: "/invoices" },
    { name: "Add Expense", icon: FaMoneyBillWave, to: "/expenses" },
  ];

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  return (
    <Box p={8} bg="background" color="textPrimary" minH="100vh">
      <HStack mb={6}>
        <Heading as="h1" size="xl" color="textPrimary">Dashboard</Heading>
        <Spacer />
        <IconButton
          icon={<FaBell />}
          aria-label="Notifications"
          variant="ghost"
          fontSize="xl"
          color="white"
        />
        <Menu>
          <MenuButton as={IconButton} icon={<FaUserCircle />} variant="ghost" fontSize="xl" color="white" />
          <MenuList bg="card" borderColor="gray.700">
            <MenuItem color="textPrimary">Abdalla</MenuItem>
            <MenuItem color="textPrimary" onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={10}>
        <CardItem
          title="Total Properties"
          value={summary?.totalProperties}
          icon={FaBuilding}
          gradient="linear(to-r, primary.500, primary.700)"
        />
        <CardItem
          title="Total Tenants"
          value={summary?.totalTenants}
          icon={FaUsers}
          gradient="linear(to-r, purple.500, purple.700)"
        />
        <CardItem
          title="Total Income"
          value={summary?.income.toFixed(2)}
          icon={FaDollarSign}
          gradient="linear(to-r, green.500, green.700)"
        />
        <CardItem
          title="Total Expenses"
          value={summary?.expenses.toFixed(2)}
          icon={FaArrowDown}
          gradient="linear(to-r, orange.500, orange.700)"
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={10}>
        <Card
          bg="card"
          borderRadius="xl"
          boxShadow="lg"
          as={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <Heading size="md" color="textPrimary">Financial Overview</Heading>
          </CardHeader>
          <CardBody>
            <Bar data={chartData} options={chartOptions} />
          </CardBody>
        </Card>

        <VStack spacing={8} align="stretch">
          <Card
            bg="card"
            borderRadius="xl"
            boxShadow="lg"
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardHeader>
              <Heading size="md" color="textPrimary">Recent Activity</Heading>
            </CardHeader>
            <CardBody>
              <List spacing={3}>
                <AnimatePresence>
                  {summary?.recentActivity.length > 0 ? (
                    summary.recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ListItem>
                          <HStack>
                            <ListIcon
                              as={activity.type === 'invoice' ? FaPlus : FaMinus}
                              color={activity.type === 'invoice' ? 'green.500' : 'red.500'}
                            />
                            <Box flex="1">
                              <Text fontWeight="semibold" color="textPrimary">{activity.title}</Text>
                              <Text fontSize="sm" color="textSecondary">
                                {activity.date} - ${activity.amount.toFixed(2)}
                              </Text>
                            </Box>
                          </HStack>
                        </ListItem>
                      </motion.div>
                    ))
                  ) : (
                    <Text color="textSecondary">No recent activity.</Text>
                  )}
                </AnimatePresence>
              </List>
            </CardBody>
          </Card>

          <Card
            bg="card"
            borderRadius="xl"
            boxShadow="lg"
            as={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardHeader>
              <Heading size="md" color="textPrimary">Quick Actions</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={4}>
                {quickActions.map((action, index) => (
                  <VStack key={index} as={RouterLink} to={action.to} spacing={2} _hover={{ transform: 'scale(1.05)', transition: 'all 0.2s' }} cursor="pointer">
                    <IconButton
                      as={motion.div}
                      whileHover={{ scale: 1.1 }}
                      icon={<Icon as={action.icon} boxSize={6} />}
                      isRound
                      bg="primary.500"
                      color="white"
                      size="lg"
                    />
                    <Text fontSize="sm" color="textPrimary" textAlign="center">{action.name}</Text>
                  </VStack>
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>
        </VStack>
      </SimpleGrid>
    </Box>
  );
}

export default Dashboard;