// backend/routes/adminRoutes.js

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const { protect, admin } = require("../middleware/authMiddleware");

// ✅ Admin panel ürün listeleme
router.get("/products", protect, admin, async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (err) {
    console.error("Ürünler alınamadı:", err);
    res.status(500).json({ message: "Ürünler alınamadı." });
  }
});

// ✅ Yeni ürün ekle
router.post("/products", protect, admin, async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, stock } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "İsim, fiyat ve kategori zorunludur." });
    }

    const cat = await Category.findById(category);
    if (!cat) {
      return res.status(400).json({ message: "Geçersiz kategori." });
    }

    const newProduct = new Product({
      name: name.trim(),
      description: description || "",
      price,
      category,
      imageUrl: imageUrl || "",
      stock: stock || 0,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Ürün ekleme hatası:", err);
    res.status(500).json({ message: "Ürün eklenemedi." });
  }
});

// ✅ Ürün güncelle
router.put("/products/:id", protect, admin, async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, stock } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    if (category) {
      const cat = await Category.findById(category);
      if (!cat) return res.status(400).json({ message: "Geçersiz kategori." });
      product.category = category;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.imageUrl = imageUrl || product.imageUrl;
    product.stock = stock !== undefined ? stock : product.stock;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.error("Ürün güncelleme hatası:", err);
    res.status(500).json({ message: "Ürün güncellenemedi." });
  }
});

// ✅ Ürün sil
router.delete("/products/:id", protect, admin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    res.json({ message: "Ürün silindi." });
  } catch (err) {
    console.error("Ürün silme hatası:", err);
    res.status(500).json({ message: "Ürün silinemedi." });
  }
});

module.exports = router;
