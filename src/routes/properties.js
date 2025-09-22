// src/routes/properties.js
const express = require('express');
const router = express.Router();

// Assuming you have a database connection and a Property model
// const Property = require('../models/Property');

router.get('/properties', async (req, res) => {
  try {
    // Replace this with a real database query
    // const properties = await Property.find();

    // Example dummy data
    const properties = [
      { id: 1, name: 'Apartment A', address: '123 Main St' },
      { id: 2, name: 'House B', address: '456 Oak Ave' },
      { id: 3, name: 'Villa C', address: '789 Pine Rd' }
    ];

    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

module.exports = router;