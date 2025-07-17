const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Token oluşturma fonksiyonu
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined!");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Yeni kullanıcı kayıt fonksiyonu
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Tüm alanlar zorunludur." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Bu email adresi zaten kullanılıyor." });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Bu kullanıcı adı zaten alınmış." });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "Kayıt başarılı",
      token,
      user: { _id: newUser._id, username: newUser.username, email: newUser.email, isAdmin: newUser.isAdmin },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Kayıt sırasında sunucu hatası oluştu." });
  }
};

// Login fonksiyonu
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login Attempt:", { email, password });

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email ve şifre zorunludur." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ message: "Geçersiz email veya şifre." });
    }

    console.log("User found. Comparing passwords...");

    if (await user.matchPassword(password)) {
      console.log("Password matched!");
      res.json({
        token: generateToken(user._id),
        user: { 
          _id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } else {
      console.log("Password did NOT match!");
      res.status(401).json({ message: "Geçersiz email veya şifre." });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Kullanıcı profil güncelleme fonksiyonu
const updateUserProfile = async (req, res) => {
  const { username, email, password } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    if (username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername && existingUsername._id.toString() !== userId.toString()) {
        return res.status(400).json({ message: "Bu kullanıcı adı zaten alınmış." });
      }
      user.username = username;
    }

    if (email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== userId.toString()) {
        return res.status(400).json({ message: "Bu email adresi zaten kullanılıyor." });
      }
      user.email = email;
    }

    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error("User profile update error:", error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    res.status(500).json({ message: "Profil güncellenirken sunucu hatası oluştu." });
  }
};

// Şifre sıfırlama fonksiyonu (düzeltildi)
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email ve yeni şifre zorunludur." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Bu email adresine kayıtlı kullanıcı bulunamadı." });
    }

    user.password = newPassword;
    user.markModified('password'); // Burada password alanını değişmiş olarak işaretliyoruz

    await user.save();

    res.json({ message: "Şifre başarıyla güncellendi." });
  } catch (error) {
    console.error("Şifre sıfırlama hatası:", error);
    res.status(500).json({ message: "Şifre sıfırlanırken sunucu hatası oluştu." });
  }
};

module.exports = { loginUser, registerUser, updateUserProfile, resetPassword };
