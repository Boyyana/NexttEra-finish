require("dotenv").config(); // Load environment variables from .env file
const mongoose = require("mongoose");
const readline = require("readline");
const Product = require("./models/product"); // Make sure the path to the Product model is correct

// Load MongoDB URI from .env
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
    process.exit(1); // Exit if connection fails
  });

// Setup readline interface for terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt for product details and save to database
async function addProduct() {
  const productDetails = {};

  // Get product details from user
  rl.question("Enter product name: ", (name) => {
    productDetails.name = name;

    rl.question("Enter product price: ", (price) => {
      productDetails.price = parseFloat(price);

      rl.question("Enter product stock quantity: ", (stock) => {
        productDetails.stock = parseInt(stock, 10);

        // Create and save product in MongoDB
        const product = new Product(productDetails);
        product
          .save()
          .then(() => {
            console.log("Product added successfully!");
            mongoose.connection.close();
            rl.close();
          })
          .catch((error) => {
            console.error("Error saving product:", error);
            mongoose.connection.close();
            rl.close();
          });
      });
    });
  });
}

// Run the addProduct function
addProduct();
