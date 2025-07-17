// backend/controllers/categoryController.js
const Category = require("../models/Category");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Kategoriler alınamadı." });
  }
};

exports.createCategory = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Yetkisiz erişim." });
    }

    const { name, description } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Kategori adı zorunludur." });
    }

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) {
      return res.status(400).json({ message: "Bu isimde kategori zaten mevcut." });
    }

    const newCategory = new Category({ name: name.trim(), description: description || "" });
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Kategori eklenemedi." });
  }
};
