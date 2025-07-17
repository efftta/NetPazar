// seed/campaignAndUsers.js - GÜNCELLENMİŞ HALİ
// Bu versiyon, kampanyaları ve ürün bağımlılıklarını atlar ve isSeller kullanıcısı ekler.

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User"); // User modelini dahil ettik
const bcrypt = require("bcryptjs");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/netpazar", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected for seeding.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const seedUsersOnly = async () => {
  try {
    await connectDB();

    // Sadece kullanıcı koleksiyonunu temizle
    await User.deleteMany();
    console.log("Existing users cleared.");

    // Admin ve normal kullanıcıları ekle
    const hashedPassword = await bcrypt.hash("123456", 10);

    const users = [
      {
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        isAdmin: true,
        isSeller: true, // <-- Bu kullanıcıyı satıcı olarak işaretledik
      },
      {
        username: "user",
        email: "user@example.com",
        password: hashedPassword,
        isAdmin: false,
        isSeller: false,
      },
      { // İsteğe bağlı: Ayrı bir satıcı kullanıcısı da ekleyebilirsiniz
        username: "sellerUser",
        email: "seller@example.com",
        password: hashedPassword,
        isAdmin: false,
        isSeller: true,
      },
    ];

    await User.insertMany(users);
    console.log("✅ Users seeded successfully.");

    mongoose.connection.close();
    console.log("MongoDB connection closed.");
  } catch (err) {
    console.error("❌ User seeding error:", err);
    process.exit(1);
  }
};

seedUsersOnly();