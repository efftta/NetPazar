// updateProductsScript.js (örnek)
const mongoose = require('mongoose');
const Product = require('./models/Product'); // Product modelinizin yolu
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB\'ye bağlandı...'))
.catch(err => console.error(err));

const updateProducts = async () => {
  try {
    const products = await Product.find({});

    for (const product of products) {
      // Eğer ürünün images dizisi boşsa veya url'si /uploads/ ile başlamıyorsa düzelt
      if (!product.images || product.images.length === 0 || !product.images[0].url.startsWith('/uploads/')) {
        // product.image alanı hala varsa onu kullan, yoksa bir yedek isim verin
        const oldImageUrl = product.image ? product.image.replace(/\\/g, '/') : `product-${product._id}.jpg`; // Önceki 'image' alanı varsa kullan
        const newImageUrl = oldImageUrl.startsWith('/uploads/') ? oldImageUrl : `/uploads/${oldImageUrl}`;

        product.images = [{
          public_id: `product-${product._id}`, // Benzersiz bir ID atayabilirsiniz
          url: newImageUrl
        }];
        await product.save();
        console.log(`Ürün ${product.name} güncellendi. Yeni görsel URL: ${newImageUrl}`);
      }
    }
    console.log('Tüm ürünler güncellendi.');
  } catch (error) {
    console.error('Ürünleri güncellerken hata oluştu:', error);
  } finally {
    mongoose.disconnect();
  }
};

updateProducts();