// seed/categoriesAndProducts.js - GÜNCEL HALİ

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User"); // <-- User modelini buraya ekledik

dotenv.config();

// Yeni kategoriler
const categories = [
  { name: "Elektronik" },
  { name: "Giyim" },
  { name: "Ev & Yaşam" },
  { name: "Kitap" },
  { name: "Oyuncak" },
  { name: "Spor" },
  { name: "Kırtasiye" },
];

// Ürünler (kategori adı ile eşleştirilecek)
const products = [
  {
    name: "Kablosuz Kulaklık",
    description: "Bluetooth 5.0, Gürültü Engelleme, 20 saat pil.",
    price: 799,
    image: "uploads/kablosuz-kulaklik.jpg",
    category: "Elektronik",
    isNewProduct: true,
    isBestSeller: true,
    isRecommended: true,
  },
  {
    name: "Erkek Tişört",
    description: "Pamuklu, beyaz, slim fit erkek tişört.",
    price: 199,
    image: "uploads/erkek-tisort.jpg",
    category: "Giyim",
    isNewProduct: true,
    isCampaign: true,
    isRecommended: true,
  },
  {
    name: "Akıllı Saat",
    description: "Adım sayar, kalp atış hızı, uyku takibi.",
    price: 1299,
    discountPrice: 1099,
    image: "uploads/akilli-saat.jpg",
    category: "Elektronik",
    isBestSeller: true,
  },
  {
    name: "Kadın Elbise",
    description: "Yazlık, çiçek desenli, rahat kesim elbise.",
    price: 349,
    image: "uploads/kadin-elbise.jpg",
    category: "Giyim",
    isCampaign: true,
  },
  {
    name: "Modern Sehpa",
    description: "Metal ayaklı, ahşap tabla, minimalist tasarım.",
    price: 499,
    image: "uploads/modern-sehpa.jpg",
    category: "Ev & Yaşam",
    isNewProduct: true,
  },
  {
    name: "Bilgisayar Kitabı",
    description: "Programlama öğrenmek için başlangıç seviyesi.",
    price: 89,
    image: "uploads/bilgisayar-kitabi.jpg",
    category: "Kitap",
    isRecommended: true,
  },
  {
    name: "Oyuncak Araba Seti",
    description: "Çocuklar için 5'li metal araba seti.",
    price: 129,
    image: "uploads/oyuncak-araba.jpg",
    category: "Oyuncak",
    isBestSeller: true,
  },
  {
    name: "Koşu Ayakkabısı",
    description: "Nefes alabilen kumaş, yastıklamalı taban.",
    price: 699,
    discountPrice: 599,
    isCampaign: true,
    image: "uploads/kosu-ayakkabisi.jpg",
    category: "Spor",
    isBestSeller: true,
  },
  {
    name: "Defter 5'li Set",
    description: "Çizgili defter seti, 80 yaprak.",
    price: 59,
    image: "uploads/defter-seti.jpeg",
    category: "Kırtasiye",
    isCampaign: true,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/netpazar");
    console.log("✅ MongoDB bağlantısı başarılı.");

    // Verileri temizle
    await Category.deleteMany();
    await Product.deleteMany();
    console.log("Eski kategoriler ve ürünler silindi.");

    // Kategorileri ekle
    const insertedCategories = await Category.insertMany(categories);
    console.log("✅ Kategoriler başarıyla eklendi.");

    // Kategori adlarını ObjectId ile eşle
    const categoryMap = {};
    insertedCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Satıcı kullanıcının ID'sini al
    // 'isSeller: true' olan bir kullanıcı bulmaya çalışıyoruz
    const sellerUser = await User.findOne({ isSeller: true });
    if (!sellerUser) {
      console.error("❌ Hata: 'isSeller: true' olan bir kullanıcı bulunamadı. Lütfen önce `seed/campaignAndUsers.js` dosyasını çalıştırın ve bir satıcı kullanıcı eklediğinizden emin olun.");
      process.exit(1); // Satıcı yoksa işlemi durdur
    }
    const sellerId = sellerUser._id;
    console.log(`✅ Satıcı ID'si alındı: ${sellerId}`);


    // Ürünlere ObjectId kategori ve satıcı ataması
    const productsWithIds = products.map((prod) => ({
      ...prod,
      category: categoryMap[prod.category],
      seller: sellerId, // <-- Satıcı ID'sini buraya ekledik
    }));

    await Product.insertMany(productsWithIds);
    console.log("✅ Ürünler başarıyla eklendi.");

    console.log("✅ Tohumlama işlemi tamamlandı!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seed işlemi sırasında hata:", error);
    process.exit(1);
  }
};

seedData();