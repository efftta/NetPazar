const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Kullanıcı doğrulama middleware'i
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Yetkisiz, token eksik." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcıyı şifre hariç getir
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Geçersiz kullanıcı." });
    }

    next();
  } catch (err) {
    console.error("Token doğrulama hatası:", err);
    res.status(401).json({ message: "Token geçersiz veya süresi dolmuş." });
  }
};

// Admin yetkisi kontrol middleware'i
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Yalnızca admin kullanıcı erişebilir." });
  }
};

module.exports = { protect, admin };
