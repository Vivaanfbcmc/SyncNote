import express from "express";
import Document from "../models/Document.js";

const router = express.Router();

// Get all documents (optionally by owner)
router.get("/", async (req, res) => {
  const { owner } = req.query;
  const docs = owner ? await Document.find({ owner }) : await Document.find();
  res.json(docs);
});

// Create document
router.post("/", async (req, res) => {
  const { title, content, owner } = req.body;
  const doc = await Document.create({ title, content, owner });
  res.json(doc);
});

// Get single document
router.get("/:id", async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json(doc);
});

// Update document
router.put("/:id", async (req, res) => {
  const { title, content } = req.body;
  const doc = await Document.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
  res.json(doc);
});

// Delete document
router.delete("/:id", async (req, res) => {
  await Document.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
