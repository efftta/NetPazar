// backend/models/Product.js - GÜNCEL HALİ
const mongoose = require("mongoose");

// Yorum şeması (Comment olarak isimlendirilmiş)
const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true }, // Yorum yapanın kullanıcı adı/ismi
  text: { type: String, required: true }, // Yorum metni
  date: { type: Date, default: Date.now },
  // Eğer rating de tutulacaksa buraya eklenebilir:
  // rating: { type: Number, required: true, min: 1, max: 5 },
});


const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Satıcı (admin veya satıcı kullanıcı)
    name: { type: String, required: true },
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    discountPrice: Number,
    // image: String, // BU SATIR KALDIRILDI

    // YENİ EKLENEN: Ürün görselleri için bir dizi
    images: [
      {
        public_id: { // Eğer bir görsel depolama servisi (örn. Cloudinary) kullanıyorsanız
          type: String,
          required: true,
        },
        url: { // Görselin URL'si (örn: /uploads/erkek-tisort.jpg)
          type: String,
          required: true,
        },
      },
    ],

    isBestSeller: { type: Boolean, default: false },
    isCampaign: { type: Boolean, default: false },
    isNewProduct: { type: Boolean, default: false },
    isRecommended: { type: Boolean, default: false },
    stock: { type: Number, default: 0 },

    comments: [commentSchema], // Yorumlar dizisi

    // Eğer ortalama puanlama sistemi tutulacaksa bu alanlar da eklenmelidir:
    // rating: { type: Number, default: 0 }, // Ortalama puan
    // numReviews: { type: Number, default: 0 }, // Yorum sayısı
  },
  { timestamps: true }
);

// Eğer rating sistemi geri eklenecekse updateAverageRating methodu da eklenebilir
// productSchema.methods.updateAverageRating = function() { ... };

module.exports = mongoose.model("Product", productSchema);