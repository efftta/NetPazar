// backend/models/Order.js (GÜNCELLENMİŞ)
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          // Ürünün sipariş anındaki fiyatı (indirimli olabilir)
          type: Number,
          required: true,
        },
      },
    ],
    shippingInfo: { // BURADA DEĞİŞİKLİK YAPILDI
      title: { type: String, required: true }, // Adres başlığı (örn: Ev, İş)
      fullName: { type: String, required: true }, // Alıcı Tam Adı
      addressLine1: { type: String, required: true }, // Adres satırı 1 (Cadde, Sokak, No)
      addressLine2: { type: String }, // Adres satırı 2 (Daire, Kat vb. isteğe bağlı)
      city: { type: String, required: true },
      state: { type: String, required: true }, // İlçe/Eyalet
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: new mongoose.Schema(
        {
          type: {
            type: String,
            required: true,
            enum: ["cashOnDelivery", "creditCard"],
          },
          cardId: { type: mongoose.Schema.Types.ObjectId, ref: "User.paymentMethods" },
          last4: { type: String },
          cardHolderName: { type: String },
        },
        { _id: false }
      ),
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "preparing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);