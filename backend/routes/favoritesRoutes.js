// backend/routes/favoritesRoutes.js (DÜZELTİLMİŞ HALİ)
const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");
const Product = require("../models/Product"); // Ürünü de kontrol etmek için Product modelini import et
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require('express-async-handler'); // Hata yakalama için asyncHandler import edildi

// @desc    Kullanıcının favori ürünlerini listele
// @route   GET /api/favorites
// @access  Private
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    // req.user.id veya req.user._id, AuthMiddleware'ınızın ne döndürdüğüne bağlıdır.
    // MongoDB _id kullanır, bu yüzden req.user._id daha doğru olabilir.
    // Eğer AuthMiddleware'ınız token'dan sadece `id` değerini alıyorsa, `req.user.id` doğrudur.
    // MongoDB ObjectId'leri genellikle `_id` olarak adlandırılır.
    const favorites = await Favorite.find({ user: req.user._id }).populate("product"); // .populate("product") ile ürün detaylarını da getiriyoruz.

    res.json(favorites);
  })
);

// @desc    Favorilere ürün ekle
// @route   POST /api/favorites
// @access  Private
router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id; // Auth middleware'dan gelen kullanıcı ID'si

    if (!productId) {
      res.status(400);
      throw new Error("Ürün ID zorunludur.");
    }

    // Ürünün gerçekten var olup olmadığını kontrol et
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Ürün bulunamadı.");
    }

    // Kullanıcının bu ürünü zaten favorilerinde olup olmadığını kontrol et
    const exists = await Favorite.findOne({ user: userId, product: productId });
    if (exists) {
      res.status(400);
      throw new Error("Ürün zaten favorilerde.");
    }

    const favorite = new Favorite({ user: userId, product: productId });
    await favorite.save();

    // Yeni eklenen favoriyi populate ederek geri döndür
    const populatedFavorite = await Favorite.findById(favorite._id).populate("product");

    res.status(201).json(populatedFavorite); // 201 Created
  })
);

// @desc    Favorilerden ürün çıkar
// @route   DELETE /api/favorites/:productId
// @access  Private
router.delete(
  "/:productId",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id; // Auth middleware'dan gelen kullanıcı ID'si
    const { productId } = req.params; // URL'den gelen ürün ID'si

    const favorite = await Favorite.findOneAndDelete({ user: userId, product: productId });

    if (!favorite) {
      res.status(404);
      throw new new Error("Favorilerinizde böyle bir ürün bulunamadı.");
    }

    res.json({ message: "Ürün favorilerden başarıyla çıkarıldı", productId: productId });
  })
);

module.exports = router;