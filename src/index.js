<<<<<<< HEAD
// src/index.js

=======
>>>>>>> bfc3347bbbbe4449ab8b6d941be3a7c990d79b27
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
<<<<<<< HEAD
import customTheme from './theme'; // استيراد الثيم المخصص
=======
>>>>>>> bfc3347bbbbe4449ab8b6d941be3a7c990d79b27

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<<<<<<< HEAD
    <ChakraProvider theme={customTheme}>
=======
    <ChakraProvider>
>>>>>>> bfc3347bbbbe4449ab8b6d941be3a7c990d79b27
      <App />
    </ChakraProvider>
  </React.StrictMode>
);