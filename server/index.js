import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import documentRoutes from "./routes/documents.js";
import { requireAuth } from "@clerk/clerk-sdk-node";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Example route
app.get("/", (req, res) => {
  res.send("SyncNote backend is running!");
});

// Protect document routes with Clerk authentication
app.use("/api/documents", requireAuth(), documentRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});