const express = require("express"); // Import express for server creation
const mongoose = require("mongoose"); // Import mongoose to interact with MongoDB
const cookieParser = require("cookie-parser"); // Import cookie-parser to parse cookies
const dotenv = require("dotenv"); // Import dotenv to load environment variables
const path = require("path"); // Import path for file path manipulation

dotenv.config(); // Load environment variables from .env file

const authRoutes = require("./routes/auth"); // Import authentication routes
const cartRoutes = require("./routes/cart"); // Import cart routes
const productRoutes = require("./routes/product"); // Import product routes

const app = express(); // Create an Express application

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

// Use authentication and cart routes
app.use("/auth", authRoutes.router); // Prefix auth routes with /auth
app.use("/cart", authRoutes.authMiddleware, cartRoutes); // Prefix cart routes with /cart and protect them with authMiddleware
app.use("/products", productRoutes); // Prefix product routes with /products

// Middleware to serve static files like CSS, JS, and images
app.use(express.static(path.join(__dirname, "public")));

// Route to serve the login.html
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Route to serve the signup.html
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

// Route to serve the about.html
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

// Route to serve the checkout.html
app.get("/checkout", authRoutes.authMiddleware,(req, res) => {
  res.sendFile(path.join(__dirname, "public", "checkout.html"));
});

// Route to serve the contact.html
app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contact.html"));
});

// Route to serve the index.html (Home page)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route to serve the xhin22.html
app.get("/xhin22", authRoutes.authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "/products/xhin22.html"));
});

//Route to serve the aa-betery-xhen.html
app.get("/aa-betery-xhen", authRoutes.authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "/products/aa-betery-xhen.html"));
});

//Route to serve the arduino-nano.html
app.get("/arduino-pro", authRoutes.authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "/products/arduino-pro.html"));
});

//Route to serve the duracell-1-5v.html
app.get("/yokogawa-2-plus", authRoutes.authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "/products/yokogawa-2-plus.html"));
});

//Route to serve the duracell-1-5v.html
app.get("/duracell-1-5v", authRoutes.authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "/products/duracell-1-5v.html"));
});

//Route to serve the duracell-1-5v.html
app.get("/arduino-nano-2-pro", authRoutes.authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "/products/arduino-nano-2-pro.html"));
});

//Route to serve the duracell-1-5v.html
app.get("/xhin-2", authRoutes.authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "/products/xhin-2.html"));
});

//Route to serve the duracell-1-5v.html
app.get("/led-diode-227-red", authRoutes.authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "/products/led-diode-227-red.html"));
});

// Start the server on the port specified in environment variables
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
