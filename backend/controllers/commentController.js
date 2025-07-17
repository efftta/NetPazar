const Product = require("../models/Product");

// Yorumları getirme
const getProductComments = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId).select("comments");
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    res.json(product.comments || []);
  } catch (error) {
    next(error);
  }
};

// Yorum ekleme (korumalı, kullanıcı login olmalı)
const addProductComment = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const user = req.user._id; // protect middleware ile gelen kullanıcı
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Yorum metni gereklidir" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    const newComment = { user, text, date: new Date() };

    if (!product.comments) {
      product.comments = [];
    }

    product.comments.push(newComment);

    await product.save();

    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

module.exports = { getProductComments, addProductComment };
