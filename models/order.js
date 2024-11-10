const mongoose = require('mongoose'); // Import mongoose for MongoDB integration

// Define the Order schema
const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User', 
        required: true // userId is required
    },
    items: [{ // Array of items in the order
        productId: { 
            type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
            ref: 'Product', 
            required: true // productId is required
        },
        quantity: { 
            type: Number, // Quantity of the product
            required: true // quantity is required
        }
    }],
    totalPrice: { 
        type: Number, // Total price of the order
        required: true // totalPrice is required
    },
    createdAt: { 
        type: Date, // Date when the order was created
        default: Date.now // Default value is the current date and time
    }
});

// Create the Order model from the schema and export it
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;