// backend/controllers/ordersController.js (GÜNCELLENMİŞ)
const Order = require("../models/Order");

// Sipariş oluşturma
async function addOrder(req, res) { // 'const' yerine 'async function' kullanıldı
  try {
    const { products, shippingInfo, paymentMethod, totalPrice, status } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Sipariş için ürün gerekli." });
    }

    // BURADA DEĞİŞİKLİK YAPILDI: Required shipping fields güncellendi
    const requiredShippingFields = [
      "title",
      "fullName",
      "addressLine1",
      "city",
      "state",
      "postalCode",
      "country",
      "phone",
    ];

    for (const field of requiredShippingFields) {
      if (!shippingInfo || !shippingInfo[field] || String(shippingInfo[field]).trim() === "") {
        return res.status(400).json({ message: `Shipping info: ${field} zorunludur.` });
      }
    }

    // addressLine2 isteğe bağlı olduğu için kontrol dışı bırakıldı.

    if (!paymentMethod || !paymentMethod.type) {
      return res.status(400).json({ message: "Ödeme yöntemi bilgisi eksik." });
    }
    if (
      paymentMethod.type === "creditCard" &&
      (!paymentMethod.cardId || !paymentMethod.last4 || !paymentMethod.cardHolderName)
    ) {
      return res.status(400).json({ message: "Kredi kartı bilgileri eksik." });
    }

    const newOrder = new Order({
      user: req.user.id,
      products,
      totalPrice,
      shippingInfo, // shippingInfo objesi olduğu gibi kullanılıyor
      paymentMethod,
      status: status || "pending",
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Sipariş oluşturma hatası:", err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Sipariş oluşturulamadı." });
  }
}

// Kullanıcının siparişlerini getirme
async function getUserOrders(req, res) { // 'const' yerine 'async function' kullanıldı
  try {
    const orders = await Order.find({ user: req.user.id }).populate("products.product");
    res.json(orders);
  } catch (err) {
    console.error("Siparişleri alma hatası:", err);
    res.status(500).json({ message: "Siparişler alınamadı." });
  }
}

// Admin için tüm siparişleri listeleme
async function getAllOrders(req, res) { // 'const' yerine 'async function' kullanıldı
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Yetkisiz erişim." });
    }
    const orders = await Order.find()
      .populate("user", "-password")
      .populate("products.product");
    res.json(orders);
  } catch (err) {
    console.error("Tüm siparişleri alma hatası:", err);
    res.status(500).json({ message: "Siparişler alınamadı." });
  }
}

// Sipariş durumu güncelleme (admin)
async function updateOrderStatus(req, res) { // 'const' yerine 'async function' kullanıldı
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Yetkisiz erişim." });
    }

    const { status } = req.body;
    const validStatuses = ["pending", "preparing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Geçersiz durum." });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı." });
    }

    // Eğer sipariş teslim edildiyse veya iptal edildiyse durum değiştirilmesin
    if (["delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({ message: `Sipariş zaten '${order.status}' durumda ve güncellenemez.` });
    }

    order.status = status;

    if (status === "delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.json(order);
  } catch (err) {
    console.error("Sipariş durumu güncelleme hatası:", err);
    res.status(500).json({ message: "Durum güncellenemedi." });
  }
}

// Siparişi iptal etme (kullanıcı)
async function cancelOrder(req, res) { // 'const' yerine 'async function' kullanıldı
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, status: { $in: ["pending", "preparing"] } },
      { status: "cancelled" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(400).json({ message: "Sipariş iptal edilemedi veya iptal edilemez durumda." });
    }

    res.json({ message: "Sipariş iptal edildi.", order: updatedOrder });
  } catch (err) {
      console.error("Sipariş iptal etme hatası:", err);
      if (err.name === "CastError" && err.path === "_id") {
          return res.status(400).json({ message: "Geçersiz sipariş ID'si." });
      }
      res.status(500).json({ message: "Sipariş iptal edilemedi." });
  }
}

// Belirli bir siparişin detaylarını ID'ye göre getirme
async function getOrderById(req, res) { // 'const' yerine 'async function' kullanıldı
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id }).populate("products.product");
    // Yukarıdaki populate işlemi, Product modelindeki tüm alanları (görsel URL'si dahil) getirecektir.

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı veya bu siparişi görmeye yetkiniz yok." });
    }
    res.json(order);
  } catch (err) {
    console.error("Sipariş detayı alma hatası:", err);
    if (err.name === "CastError" && err.path === "_id") {
      return res.status(400).json({ message: "Geçersiz sipariş ID'si." });
    }
    res.status(500).json({ message: "Sipariş detayı alınamadı." });
  }
}

module.exports = {
  addOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderById,
};