const express = require("express");
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  updateUserProfile,
  resetPassword  // Şifre sıfırlama fonksiyonunu ekledik
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/auth/register
// @desc    Yeni kullanıcı kaydı
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Kullanıcı girişi
// @access  Public
router.post("/login", loginUser);

// @route   PUT /api/auth/profile
// @desc    Kullanıcı profilini güncelle
// @access  Private
router.put("/profile", protect, updateUserProfile);

// @route   POST /api/auth/reset-password
// @desc    Şifre sıfırlama
// @access  Public
router.post("/reset-password", resetPassword);

module.exports = router;
