const mongoose = require('mongoose');  // Import mongoose

// Define the Product schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },               // Name of the product
    price: { type: Number, required: true },              // Price of a single product
    stock: { type: Number, default: 0 },                  // Quantity available in stock, default is 0
    images: [{ type: String }],                          // Array of image URLs
});

// Create the Product model from the schema and export it
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
