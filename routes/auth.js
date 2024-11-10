const express = require('express');     // Import express for routing
const jwt = require('jsonwebtoken');    // Import jsonwebtoken for creating tokens
const User = require('../models/user'); // Import the User model
const router = express.Router();        // Create a router instance for handling auth routes
const bcrypt = require('bcryptjs');     // Import bcrypt for password encryption

// Register route: to create a new user account
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;  // Extract username, email, and password from the request body
    try {
        const user = new User({ username, email, password });  // Create a new User document
        await user.save();                                     // Save the user to the database
        res.status(201).send('User registered successfully');  // Send success message
    } catch (err) {
        res.status(400).send('Error registering user');        // Send error message if registration fails
    }
});

// Login route: to authenticate a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;                      // Extract email and password from the request body
    try {
        const user = await User.findOne({ email });            // Find the user in the database by email
        if (!user || !(await user.checkPassword(password))) {  // If no user is found or the password is wrong
            return res.status(400).json({ error: 'Invalid email or password' });  // Return an error
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });  // Generate a JWT token
        res.cookie('token', token, { httpOnly: true });        // Store the token in a cookie87
        res.status(200).json({ message: 'Login successful' }); // Send success message
    } catch (err) {
        res.status(400).json({ error: 'Error logging in' });   // Send error message if login fails
    }
});

// Logout route: to clear the token and log out the user
router.get('/logout', (req, res) => {
    res.clearCookie('token');                                  // Clear the authentication cookie
    res.send('Logout successful');                             // Send success message
});

// Middleware to protect routes by verifying the user's authentication token
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;                           // Get the token from the cookies
    if (!token) return res.redirect("/login");   // If no token, send an unauthorized message
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
        req.userId = decoded.userId;                               // Store the user ID in the request object
        next();                                                    // Proceed to the next middleware/route
    } catch (err) {
        return res.redirect("/login");              // If the token is invalid, return an error
    }
};

module.exports = { router, authMiddleware };  // Export the router and middleware for use in other files
