// backend/routes/userRoutes.js (GÜNCEL HALİ - Ödeme Yöntemi rotaları eklendi)
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  // YENİ Ödeme Yöntemi fonksiyonları
  getUserPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} = require("../controllers/userController");

// Adres rotaları (Mevcut)
router.route("/profile/addresses")
  .get(protect, getUserAddresses)
  .post(protect, addAddress);

router.route("/profile/addresses/:id")
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

// YENİ: Ödeme Yöntemi (Kart) rotaları
router.route("/profile/payment-methods")
  .get(protect, getUserPaymentMethods) // Kullanıcının tüm ödeme yöntemlerini getir
  .post(protect, addPaymentMethod);    // Yeni ödeme yöntemi ekle

router.route("/profile/payment-methods/:id")
  .put(protect, updatePaymentMethod)   // Ödeme yöntemini güncelle
  .delete(protect, deletePaymentMethod); // Ödeme yöntemini sil

module.exports = router;