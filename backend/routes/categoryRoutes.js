// backend/routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const { protect, admin } = require("../middleware/authMiddleware");

// Tüm kategorileri getir (herkese açık)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error("Kategori alma hatası:", err);
    res.status(500).json({ message: "Kategoriler alınamadı." });
  }
});

// Yeni kategori ekle (admin)
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Kategori adı zorunludur." });
    }

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) {
      return res.status(400).json({ message: "Bu isimde kategori zaten var." });
    }

    const newCategory = new Category({
      name: name.trim(),
      description: description || "",
    });

    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Kategori oluşturma hatası:", err);
    res.status(500).json({ message: "Kategori oluşturulurken bir hata oluştu." });
  }
});

// Kategori güncelle (admin)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı." });
    }

    if (name && name.trim() !== "") {
      const exists = await Category.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
      if (exists) {
        return res.status(400).json({ message: "Bu isimde başka bir kategori zaten var." });
      }
      category.name = name.trim();
    }

    category.description = description !== undefined ? description : category.description;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (err) {
    console.error("Kategori güncelleme hatası:", err);
    res.status(500).json({ message: "Kategori güncellenirken bir hata oluştu." });
  }
});

// Kategori sil (admin)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı." });
    }

    await category.deleteOne(); // updated from category.remove()
    res.json({ message: "Kategori başarıyla silindi." });
  } catch (err) {
    console.error("Kategori silme hatası:", err);
    res.status(500).json({ message: "Kategori silinirken bir hata oluştu." });
  }
});

module.exports = router;