// seed/ordersAndFavorites.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Order = require("../models/Order");
const Favorite = require("../models/Favorite");
const Product = require("../models/Product");
const User = require("../models/User");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB bağlantısı başarılı.");

    // Temizlik
    await Order.deleteMany();
    await Favorite.deleteMany();
    console.log("Eski sipariş ve favoriler silindi.");

    const users = await User.find();
    const products = await Product.find();

    if (users.length === 0 || products.length === 0) {
      throw new Error("Sipariş/favori oluşturmak için yeterli kullanıcı veya ürün yok.");
    }

    const user = users[0];

    // Örnek sipariş
    const newOrder = new Order({
      user: user._id,
      products: [
        {
          product: products[0]._id,
          quantity: 2,
          price: products[0].discountPrice || products[0].price,
        },
      ],
      totalPrice:
        (products[0].discountPrice || products[0].price) * 2,
      shippingInfo: {
        address: "İstanbul Mahallesi, No:10",
        city: "İstanbul",
        postalCode: "34000",
        country: "Türkiye",
      },
      status: "pending",
    });
    await newOrder.save();
    console.log("Sipariş eklendi.");

    // Örnek favori
    const newFavorite = new Favorite({
      user: user._id,
      favorites: [products[1]._id],
    });
    await newFavorite.save();
    console.log("Favori eklendi.");

    process.exit();
  } catch (err) {
    console.error("Hata:", err);
    process.exit(1);
  }
};

seedData();
