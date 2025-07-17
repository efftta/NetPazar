const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const { protect } = require("../middleware/authMiddleware"); // ✅ Doğru import

// Kampanyaları listele
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    console.error("Kampanyalar alınamadı:", err);
    res.status(500).json({ message: "Kampanyalar alınamadı." });
  }
});

// Yeni kampanya ekle (admin yetkisi gerektirir)
router.post("/", protect, async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Yetkisiz erişim." });
    }

    const {
      title,
      description,
      discountPercent,
      startDate,
      endDate,
      products,
    } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Kampanya başlığı zorunludur." });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Kampanya başlangıç ve bitiş tarihleri zorunludur.",
      });
    }

    const newCampaign = new Campaign({
      title: title.trim(),
      description: description || "",
      discountPercent: discountPercent || 0,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      products: products || [],
    });

    const saved = await newCampaign.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Kampanya ekleme hatası:", err);
    res.status(500).json({ message: "Kampanya eklenemedi." });
  }
});

module.exports = router;
