import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors"; // Import the cors package
// import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import scraperRoutes from "./routes/scraperRoutes.js";

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
// app.use("/api/scraper", scraperRoutes);

// Serve static files from the "public" directory
app.use("/public", express.static(path.join(path.resolve(), "public")));

// Connect Database
// await connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
