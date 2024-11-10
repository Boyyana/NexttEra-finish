const express = require('express');   // Import express for routing
const Cart = require('../models/cart');  // Import the Cart model
const User = require('../models/user');  // Import the User model
const Product = require('../models/product.js'); // Import the Product model
const Order = require('../models/order.js'); // Import the Order model
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token verification
const router = express.Router();         // Create a router instance for handling cart routes

// Middleware to protect routes by verifying the user's authentication token
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;                           // Get the token from the cookies
    if (!token) return res.status(401).send('Unauthorized');   // If no token, send an unauthorized message
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
        req.userId = decoded.userId;                               // Store the user ID in the request object
        next();                                                    // Proceed to the next middleware/route
    } catch (err) {
        return res.status(401).send('Invalid token');              // If the token is invalid, return an error
    }
};

// Route to add an item to the cart
router.post('/addtocart', authMiddleware, async (req, res) => {
    const { productId, quantity } = req.body; // Extract productId and quantity from the request body
    const userId = req.userId; // Get the userId from the request object
    console.log("Product id:" + productId);
    console.log("User id:" + userId);
    console.log("Quantity:" + quantity);

    try {
        // Find the cart for the user, or create a new cart if one doesn't exist
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Retrieve price for one unit from Product model
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        const priceForOne = product.price;
        console.log("Price for one unit:" + priceForOne);

        // Check if the product is already in the cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            // If the product is already in the cart, update the quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Add new item with priceForOne and quantity
            cart.items.push({ productId, quantity, priceForOne });
        }

        // Update the total price
        cart.totalPrice = cart.items.reduce((total, item) => {
            const itemTotal = item.priceForOne * item.quantity;
            console.log(`Item total for ${item.productId}: ${itemTotal}`);
            return total + itemTotal;
        }, 0);

        console.log("Total price:" + cart.totalPrice);

        await cart.save(); // Save the cart to the database
        res.status(200).send({message: 'Item added to cart'}); // Send a success message
    } catch (err) {
        console.error(err);
        res.status(400).send('Error adding item to cart'); // Send an error message if something goes wrong
    }
});

// Route to remove or decrement an item in the cart
router.post('/removefromcart', authMiddleware, async (req, res) => {
    const { productId } = req.body; // Extract productId from the request body
    const userId = req.userId; // Get the userId from the request object

    console.log("Product id:" + productId);
    console.log("User id:" + userId);

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).send('Cart not found');

        // Find the index of the item in the cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            // If the item is found and its quantity is greater than 1, decrement the quantity
            if (cart.items[itemIndex].quantity > 1) {
                cart.items[itemIndex].quantity -= 1;
            } else {
                // If quantity is 1, remove the item from the cart
                cart.items.splice(itemIndex, 1);
            }

            // Recalculate the total price
            cart.totalPrice = 0;
            for (let item of cart.items) {
                const product = await Product.findById(item.productId);
                if (product) {
                    cart.totalPrice += product.price * item.quantity;
                }
            }

            await cart.save(); // Save the cart to the database
            res.status(200).send('Item updated in cart'); // Send a success message
        } else {
            // If the item is not in the cart
            res.status(404).send('Item not found in cart');
        }
    } catch (err) {
        console.error(err);
        res.status(400).send('Error updating item in cart'); // Send an error message if something goes wrong
    }
});

// Route to handle checkout and apply the promo code
router.post('/checkout', authMiddleware, async (req, res) => {
    const { promoCode } = req.body; // Extract promoCode from the request body
    const userId = req.userId; // Get the userId from the request object

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).send('Cart not found');

        const validCodes = { 'PROMO100': true, 'FREE': true }; // Define valid promo codes

        if (promoCode && validCodes[promoCode]) {
            // Save the order details to the orders table
            const order = new Order({
                userId,
                items: cart.items,
                totalPrice: cart.totalPrice
            });
            await order.save();

            // Empty the cart
            cart.items = [];
            cart.totalPrice = 0;
            await cart.save();

            res.status(200).json({ message: 'Checkout successful', orderId: order._id }); // Send a success message with the order ID
        } else if (promoCode) {
            return res.status(400).send('Invalid promo code'); // Send an error message if the promo code is invalid
        } else {
            return res.status(400).send('Promo code is required for checkout'); // Send an error message if no promo code is provided
        }
    } catch (err) {
        console.error(err);
        res.status(400).send('Error during checkout'); // Send an error message if something goes wrong
    }
});

// Route to load the cart for the logged-in user
router.get('/getcart', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId; // Get the userId from the request object

        const cart = await Cart.findOne({ userId }).populate('items.productId'); // Populate the product details in the cart

        if (!cart) {
            return res.status(200).json({ items: [], totalPrice: 0 }); // If no cart is found, return an empty cart
        }

        res.status(200).json(cart); // Send the cart data
    } catch (err) {
        res.status(400).send('Error fetching cart'); // Send an error message if something goes wrong
    }
});

module.exports = router;  // Export the cart router