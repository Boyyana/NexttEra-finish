const express = require('express'); // Import express for routing
const router = express.Router(); // Create a router instance for handling product routes
const Product = require('../models/product'); // Import the Product model (adjust the path as necessary)

// Route to get product details by ID
router.get('/get-product/:id', async (req, res) => {
    try {
        // Find the product by ID from the request parameters
        const product = await Product.findById(req.params.id);
        
        // If the product is not found, return a 404 error
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // If the product is found, return the product details with a 200 status
        res.status(200).json(product);
    } catch (err) {
        // If there is an error during the process, return a 500 error
        res.status(500).json({ error: 'Error fetching product details' });
    }
});

module.exports = router; // Export the product router