const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  cancelOrder,
  addOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
} = require("../controllers/ordersController");

router.post("/", protect, addOrder);
router.get("/", protect, getUserOrders);
router.get("/all", protect, getAllOrders); // Admin rotası
router.get("/:id", protect, getOrderById); // Sipariş detayları
router.put("/:id/status", protect, updateOrderStatus); // Admin sipariş durumu güncelleme
router.put("/:id/cancel", protect, cancelOrder); // Kullanıcı sipariş iptali

module.exports = router;
