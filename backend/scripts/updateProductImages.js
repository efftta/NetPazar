const mongoose = require('mongoose');
const Product = require('../models/Product'); // Product modelinizin doğru yolu
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: './.env' }); // .env dosyanızın yolu doğru olmalı

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/e-commerce"; // MongoDB URI'nızı kontrol edin

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB\'ye başarıyla bağlandı.'))
.catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1); // Bağlantı hatasında çıkış yap
});

const uploadsDir = path.join(__dirname, '../uploads'); // uploads klasörünüzün yolu

const updateProductImages = async () => {
    try {
        const products = await Product.find({}); // Tüm ürünleri çek

        if (products.length === 0) {
            console.log("Güncellenecek ürün bulunamadı.");
            mongoose.disconnect();
            return;
        }

        let updatedCount = 0;
        const uploadedFiles = fs.readdirSync(uploadsDir); // uploads klasöründeki tüm dosyaları al

        for (const product of products) {
            // Eğer ürünün images dizisi ya yoksa ya da url'si geçerli bir resim yolu gibi görünmüyorsa
            // veya images dizisi boşsa (sadece ilkini kontrol ediyoruz, birden fazla görsel senaryosu için daha karmaşık olabilir)
            const needsUpdate = !product.images || 
                                product.images.length === 0 || 
                                !product.images[0].url || 
                                !product.images[0].url.startsWith('/uploads/');

            if (needsUpdate) {
                // Ürünün adına göre uygun bir görsel bulmaya çalış
                const productNameLowerCase = product.name.toLowerCase().replace(/[^a-z0-9]/g, ''); // Adı basitleştir
                let foundImage = null;

                // uploads klasöründeki dosyalar arasında arama yap
                for (const fileName of uploadedFiles) {
                    const fileNameLowerCase = fileName.toLowerCase().replace(/[^a-z0-9.]/g, ''); // Dosya adını basitleştir
                    // Eğer ürün adı dosya adının içinde geçiyorsa veya tam eşleşme varsa
                    if (fileNameLowerCase.includes(productNameLowerCase) || productNameLowerCase.includes(fileNameLowerCase.split('.')[0])) {
                        foundImage = fileName;
                        break;
                    }
                }

                if (foundImage) {
                    // Bulunan görselle ürünü güncelle
                    product.images = [{
                        public_id: `product-${product._id}-${Date.now()}`, // Benzersiz bir ID
                        url: `/uploads/${foundImage}`
                    }];
                    await product.save();
                    updatedCount++;
                    console.log(`Güncellenen ürün: ${product.name} -> Görsel: /uploads/${foundImage}`);
                } else {
                    console.log(`Ürün için uygun görsel bulunamadı: ${product.name}. Varsayılan görsel kullanılacak.`);
                    // Eğer uygun görsel bulunamazsa, placeholder veya varsayılan bir görsel atayabilirsiniz.
                    // Örneğin: product.images = [{ public_id: 'default', url: '/uploads/default-placeholder.jpg' }];
                    // Bu durumda 'default-placeholder.jpg' adında bir görseliniz olmalı.
                }
            }
        }

        console.log(`Toplam ${updatedCount} ürün başarıyla güncellendi.`);

    } catch (error) {
        console.error('Ürün görsellerini güncellerken hata oluştu:', error);
    } finally {
        mongoose.disconnect(); // İşlem bitince MongoDB bağlantısını kapat
    }
};

updateProductImages();