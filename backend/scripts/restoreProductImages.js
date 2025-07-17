const mongoose = require('mongoose');
const Product = require('../models/Product'); // Product modelinizin doğru yolu
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') }); // .env dosyanızın yolu

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/e-commerce";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB\'ye başarıyla bağlandı.'))
.catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1);
});

const uploadsDir = path.join(__dirname, '../uploads'); // uploads klasörünüzün yolu

const restoreProductImages = async () => {
    try {
        const products = await Product.find({});
        const uploadedFiles = fs.readdirSync(uploadsDir);

        let updatedCount = 0;

        for (const product of products) {
            let foundImage = null;

            // 1. Ürün adını küçük harfe çevir ve boşlukları/özel karakterleri kaldır (eşleştirme için)
            const cleanProductName = product.name.toLowerCase().replace(/[^a-z0-9ğüşıöç]/g, '');

            // 2. Görsel dosyaları arasında en iyi eşleşmeyi ara
            for (const fileName of uploadedFiles) {
                const cleanFileName = fileName.toLowerCase().split('.')[0].replace(/[^a-z0-9ğüşıöç]/g, ''); // Uzantısız ve temiz dosya adı

                // Eğer dosya adı ürün adını içeriyorsa veya ürün adı dosya adını içeriyorsa (daha esnek eşleşme)
                if (cleanFileName.includes(cleanProductName) || cleanProductName.includes(cleanFileName)) {
                    foundImage = fileName;
                    break; // İlk eşleşen görseli al
                }
            }

            if (foundImage) {
                // Eğer ürünün current images dizisi zaten bu görseli içeriyorsa, güncelleme yapma
                const currentImageUrl = product.images && product.images.length > 0 ? product.images[0].url : '';
                const newImageUrl = `/uploads/${foundImage}`;

                if (currentImageUrl !== newImageUrl) {
                    product.images = [{
                        public_id: `product-${product._id}-${Date.now()}`, // Yeni ve benzersiz bir ID
                        url: newImageUrl
                    }];
                    await product.save();
                    updatedCount++;
                    console.log(`UPDATED: Product "${product.name}" image set to: ${newImageUrl}`);
                } else {
                    // console.log(`SKIP: Product "${product.name}" already has correct image: ${newImageUrl}`);
                }
            } else {
                console.log(`WARNING: No suitable image found for product "${product.name}". Using a placeholder.`);
                // Hiç eşleşme bulunamazsa varsayılan bir placeholder atayın
                // NOT: 'no-image.jpg' adında bir görselin 'uploads' klasörünüzde olduğundan emin olun.
                if (!product.images || product.images.length === 0 || product.images[0].url !== '/uploads/no-image.jpg') {
                    product.images = [{
                        public_id: 'default-placeholder',
                        url: '/uploads/no-image.jpg' // Varsayılan görselinizin yolu
                    }];
                    await product.save();
                    updatedCount++;
                }
            }
        }

        console.log(`\n--- İşlem Tamamlandı ---\nToplam ${updatedCount} ürün görseli güncellendi.`);

    } catch (error) {
        console.error('Hata oluştu:', error);
    } finally {
        mongoose.disconnect();
    }
};

restoreProductImages();