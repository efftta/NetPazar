const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware"); // Admin rotaları için gerekli

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController"); // Controller'dan fonksiyonları import et

const { getProductComments, addProductComment } = require("../controllers/commentController");

// @route   GET /api/products
// @desc    Tüm ürünleri veya arama/filtreleme sonuçlarını getir
// @access  Public
router.get("/", getProducts);

// @route   GET /api/products/:id
// @desc    ID'ye göre tek bir ürün getir
// @access  Public
router.get("/:id", getProductById);

// @route   GET /api/products/:id/comments
// @desc    Ürün yorumlarını getir
// @access  Public
router.get("/:id/comments", getProductComments);

// @route   POST /api/products/:id/comments
// @desc    Ürüne yorum ekle
// @access  Private (kullanıcı giriş yapmış olmalı)
router.post("/:id/comments", protect, addProductComment);

// @route   POST /api/products
// @desc    Yeni ürün ekle
// @access  Private/Admin
router.post("/", protect, admin, createProduct);

// @route   PUT /api/products/:id
// @desc    Ürün güncelle
// @access  Private/Admin
router.put("/:id", protect, admin, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Ürün sil
// @access  Private/Admin
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
