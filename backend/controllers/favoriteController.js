// backend/controllers/favoriteController.js
const asyncHandler = require('express-async-handler'); // Hata yakalamak için
const Favorite = require('../models/Favorite'); // Favorite modelini içeri aktarıyoruz
const Product = require('../models/Product'); // Product modelini içeri aktarıyoruz

// @desc    Kullanıcının tüm favorilerini getir
// @route   GET /api/favorites
// @access  Private
const getFavorites = asyncHandler(async (req, res) => {
  // req.user, authMiddleware tarafından eklenir ve oturum açmış kullanıcıyı temsil eder.
  const favorites = await Favorite.find({ user: req.user._id }).populate('product'); // 'product' alanını populate ederek ürün detaylarını da getiriyoruz.

  res.json(favorites);
});

// @desc    Favorilere ürün ekle
// @route   POST /api/favorites
// @access  Private
const addFavorite = asyncHandler(async (req, res) => {
  const { productId } = req.body; // Frontend'den gönderilen ürün ID'si
  const userId = req.user._id; // Kimlik doğrulamasından gelen kullanıcı ID'si

  // Ürünün varlığını kontrol et
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Ürün bulunamadı');
  }

  // Kullanıcının bu ürünü zaten favorilerinde olup olmadığını kontrol et
  const existingFavorite = await Favorite.findOne({ user: userId, product: productId });

  if (existingFavorite) {
    res.status(400); // Bad Request
    throw new Error('Bu ürün zaten favorilerinizde');
  }

  // Yeni favori kaydı oluştur
  const favorite = await Favorite.create({
    user: userId,
    product: productId,
  });

  // Favori kaydını oluşturduktan sonra, populate ederek frontend'e ürün detaylarını gönderebiliriz.
  const populatedFavorite = await Favorite.findById(favorite._id).populate('product');


  res.status(201).json(populatedFavorite); // 201 Created
});

// @desc    Favorilerden ürün çıkar
// @route   DELETE /api/favorites/:productId
// @access  Private
const removeFavorite = asyncHandler(async (req, res) => {
  const { productId } = req.params; // URL'den gelen ürün ID'si
  const userId = req.user._id; // Kimlik doğrulamasından gelen kullanıcı ID'si

  const favorite = await Favorite.findOneAndDelete({
    user: userId,
    product: productId,
  });

  if (!favorite) {
    res.status(404);
    throw new Error('Favorilerinizde böyle bir ürün bulunamadı');
  }

  res.json({ message: 'Ürün favorilerden başarıyla çıkarıldı', productId: productId });
});

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};