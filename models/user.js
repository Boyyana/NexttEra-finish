const mongoose = require('mongoose');  // Import mongoose for MongoDB integration
const bcrypt = require('bcryptjs');    // Import bcrypt for password hashing

// Define the User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },  // Username is required and must be unique
    email: { type: String, required: true, unique: true },     // Email is required and must be unique
    password: { type: String, required: true },                // Password is required
    cart: [{                                                   // Cart contains an array of product entries
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to Product schema
        quantity: { type: Number, required: true, min: 1 }    // Quantity of the product in the cart, required and must be at least 1
    }]
});


// Pre-save hook to hash the user's password before saving it to the database
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();           // Only hash the password if it has been modified or is new
    this.password = await bcrypt.hash(this.password, 12);      // Hash the password using bcrypt with a salt of 12 rounds
    next();                                                    // Proceed to save the user
});

// Instance method to check if the entered password matches the hashed password in the database
userSchema.methods.checkPassword = async function(password) {
    return await bcrypt.compare(password, this.password);      // Compare the plain-text password with the hashed one
};

// Create the User model from the schema and export it
const User = mongoose.model('User', userSchema);
module.exports = User;
