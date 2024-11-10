const mongoose = require('mongoose');  // Import mongoose for MongoDB integration

// Define the Cart schema
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to the User model
    items: [{                                                       // Array of cart items
        productId: String,                                          // ID of the product
        quantity: { type: Number, default: 1 },                      // Quantity of the product, default is 1
        priceForOne: { type: Number, default: 0}
    }],
    totalPrice: { type: Number, default: 0 }                        // Total price of the cart
});

// Create the Cart model from the schema and export it
const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
