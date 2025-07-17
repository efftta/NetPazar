const Product = require("../models/Product");
const Category = require("../models/Category"); // Kategori modelini de import edin

// Tüm ürünleri veya arama/filtreleme sonuçlarını getir
const getProducts = async (req, res) => {
  try {
    const { category, isBestSeller, isCampaign, isNewProduct, recommended, search } = req.query;
    const filter = {};

    // Kategori ismini ID'ye çevir
    if (category) {
      const cat = await Category.findOne({ name: category });
      if (cat) {
        filter.category = cat._id;
      } else {
        // Kategori bulunamazsa boş dizi döndür
        return res.json([]);
      }
    }

    // Bool filtreler
    if (isBestSeller === "true") filter.isBestSeller = true;
    if (isCampaign === "true") filter.isCampaign = true;
    if (isNewProduct === "true") filter.isNewProduct = true;
    if (recommended === "true") filter.isRecommended = true;

    // Arama terimi (keyword) filtresi
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Product.find() metodu varsayılan olarak tüm alanları getirir.
    // Ancak emin olmak için veya belirli alanları seçmek için .select() kullanılabilir.
    // `images` alanı modelde tanımlı olduğu sürece burada ekstra bir şey yapmaya gerek yok.
    const products = await Product.find(filter).populate("category", "name");
    res.json(products);
  } catch (err) {
    console.error("Ürün alma hatası:", err);
    res.status(500).json({ message: "Ürünler alınırken sunucu hatası oluştu." });
  }
};

// ID'ye göre tek bir ürün getir (yorumlar ve örnek yorumlar dahil)
const getProductById = async (req, res) => {
  try {
    // Product.findById() metodu da varsayılan olarak tüm alanları getirir.
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı." });

    const categoryName = product.category?.name;
    const realComments = product.comments || [];

    const sampleCommentsByCategory = {
      "Elektronik": [
        { user: "Ali", text: "Harika bir ürün, kesinlikle tavsiye ederim!", date: new Date("2024-04-01") },
        { user: "Ayşe", text: "Performansı çok iyi, fiyatına göre süper.", date: new Date("2024-04-03") },
      ],
      "Kitap": [
        { user: "Mehmet", text: "Çok sürükleyici ve öğretici bir kitap.", date: new Date("2024-03-20") },
        { user: "Fatma", text: "Okuması kolay, içeriği dolu dolu.", date: new Date("2024-03-22") },
      ],
      "Giyim": [
        { user: "Deniz", text: "Kalitesi beklediğimden iyiydi.", date: new Date("2024-02-15") },
        { user: "Zeynep", text: "Renk ve beden tam uydu.", date: new Date("2024-02-17") },
      ],
      // Diğer kategoriler için benzer örnekler ekle
    };

    const sampleComments = sampleCommentsByCategory[categoryName] || [];
    const allComments = [...realComments, ...sampleComments];

    res.json({
      ...product.toObject(),
      comments: allComments,
    });
  } catch (error) {
    console.error("Ürün ID ile alınamadı:", error);
    res.status(500).json({ message: "Ürün alınırken hata oluştu." });
  }
};

// Yeni ürün ekle (sadece admin)
const createProduct = async (req, res) => {
  try {
    // req.body'den artık tek bir 'image' yerine 'images' dizisi bekliyoruz
    const {
      name,
      description,
      category,
      price,
      discountPrice,
      images, // BURASI GÜNCELLENDİ: images dizisi bekleniyor
      isBestSeller,
      isCampaign,
      isNewProduct,
      isRecommended,
      stock,
    } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: "Name, category ve price zorunludur." });
    }

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ message: "Geçersiz kategori ID'si." });
    }

    const newProduct = new Product({
      name,
      description,
      category,
      price,
      discountPrice: discountPrice || null,
      images: images || [], // BURASI GÜNCELLENDİ: images dizisini kaydet
      isBestSeller: isBestSeller || false,
      isCampaign: isCampaign || false,
      isNewProduct: isNewProduct || false,
      isRecommended: isRecommended || false,
      stock: stock || 0,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Ürün oluşturma hatası:", error);
    res.status(500).json({ message: "Ürün oluşturulurken hata oluştu." });
  }
};

// Ürün güncelle (sadece admin)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // req.body'den artık tek bir 'image' yerine 'images' dizisi bekleniyor
    const {
      name,
      description,
      category,
      price,
      discountPrice,
      images, // BURASI GÜNCELLENDİ: images dizisi bekleniyor
      isBestSeller,
      isCampaign,
      isNewProduct,
      isRecommended,
      stock,
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Güncellenecek ürün bulunamadı." });
    }

    if (category) {
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(400).json({ message: "Geçersiz kategori ID'si." });
      }
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price || product.price;
    product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
    product.images = images !== undefined ? images : product.images; // BURASI GÜNCELLENDİ: images dizisini güncelle
    product.isBestSeller = isBestSeller !== undefined ? isBestSeller : product.isBestSeller;
    product.isCampaign = isCampaign !== undefined ? isCampaign : product.isCampaign;
    product.isNewProduct = isNewProduct !== undefined ? isNewProduct : product.isNewProduct;
    product.isRecommended = isRecommended !== undefined ? isRecommended : product.isRecommended;
    product.stock = stock !== undefined ? stock : product.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Ürün güncelleme hatası:", error);
    res.status(500).json({ message: "Ürün güncellenirken hata oluştu." });
  }
};

// Ürün sil (sadece admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Silinecek ürün bulunamadı." });
    }
    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: "Ürün başarıyla silindi." });
  } catch (error) {
    console.error("Ürün silme hatası:", error);
    res.status(500).json({ message: "Ürün silinirken hata oluştu." });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};