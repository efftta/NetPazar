// backend/controllers/userController.js

const User = require("../models/User"); // User modelinizi import ettiğinizden emin olun

// --- KULLANICI ADRES YÖNETİMİ FONKSİYONLARI BAŞLANGICI ---

// @desc    Kullanıcının tüm adreslerini getir
// @route   GET /api/users/profile/addresses
// @access  Private
const getUserAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Kimlik doğrulama middleware'i sonrası req.user.id'ye erişim
        if (user) {
            res.json(user.addresses); // User modelinizde 'addresses' adında bir dizi olmalı
        } else {
            res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }
    } catch (error) {
        console.error("Adresleri alma hatası:", error);
        res.status(500).json({ message: "Adresler alınamadı." });
    }
};

// @desc    Yeni adres ekle
// @route   POST /api/users/profile/addresses
// @access  Private
const addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            // Backend Controller'da beklenen alanlar:
            const { title, fullName, addressLine1, addressLine2, city, state, postalCode, country, phone, isDefault } = req.body;

            // Kapsamlı zorunlu alan kontrolü
            if (!title || !fullName || !addressLine1 || !city || !state || !postalCode || !country || !phone) {
                return res.status(400).json({ message: "Lütfen tüm zorunlu adres alanlarını doldurun (Başlık, Ad Soyad, Adres Satırı 1, Şehir, İlçe/Eyalet, Posta Kodu, Ülke, Telefon)." });
            }

            const newAddress = {
                title,
                fullName,
                addressLine1,
                addressLine2,
                city,
                state,
                postalCode,
                country,
                phone,
                isDefault: Boolean(isDefault)
            };

            // Eğer yeni adres varsayılan olacaksa, diğer varsayılan adresleri kaldır
            if (newAddress.isDefault) {
                user.addresses.forEach(addr => (addr.isDefault = false));
            } else if (user.addresses.length === 0) {
                // Eğer hiç adres yoksa, ilk eklenen adresi varsayılan yap
                newAddress.isDefault = true;
            }

            user.addresses.push(newAddress);
            await user.save();
            res.status(201).json(user.addresses); // Güncel adres listesini gönder
        } else {
            res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }
    } catch (error) {
        console.error("Adres ekleme hatası:", error);
        // Mongoose validasyon hatalarını daha spesifik yakalayabiliriz
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: `Validasyon Hatası: ${messages.join(', ')}` });
        }
        res.status(500).json({ message: "Adres eklenemedi." });
    }
};

// @desc    Adresi güncelle
// @route   PUT /api/users/profile/addresses/:id
// @access  Private
const updateAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            const addressId = req.params.id;
            // Backend Controller'da beklenen alanlar:
            const { title, fullName, addressLine1, addressLine2, city, state, postalCode, country, phone, isDefault } = req.body;

            let targetAddress = user.addresses.id(addressId); // Mongoose alt belgeleri için .id() kullanır

            if (!targetAddress) {
                return res.status(404).json({ message: "Adres bulunamadı." });
            }

            // Kapsamlı zorunlu alan kontrolü (Güncelleme için de)
            if (!title || !fullName || !addressLine1 || !city || !state || !postalCode || !country || !phone) {
                return res.status(400).json({ message: "Lütfen tüm zorunlu adres alanlarını doldurun (Başlık, Ad Soyad, Adres Satırı 1, Şehir, İlçe/Eyalet, Posta Kodu, Ülke, Telefon)." });
            }

            // Eğer güncellenen adres varsayılan olacaksa, diğer varsayılan adresleri kaldır
            if (isDefault) {
                user.addresses.forEach(addr => {
                    if (addr._id.toString() !== addressId) {
                        addr.isDefault = false;
                    }
                });
            }

            targetAddress.set({
                title,
                fullName,
                addressLine1,
                addressLine2,
                city,
                state,
                postalCode,
                country,
                phone,
                isDefault: Boolean(isDefault)
            });

            await user.save();
            res.json(user.addresses); // Güncel adres listesini gönder
        } else {
            res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }
    } catch (error) {
        console.error("Adres güncelleme hatası:", error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: `Validasyon Hatası: ${messages.join(', ')}` });
        }
        res.status(500).json({ message: "Adres güncellenemedi." });
    }
};

// @desc    Adresi sil
// @route   DELETE /api/users/profile/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            const addressId = req.params.id;
            const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);

            if (addressIndex === -1) {
                return res.status(404).json({ message: "Adres bulunamadı." });
            }

            // Eğer silinen adres varsayılan ise ve başka adres varsa, yeni bir varsayılan belirle
            if (user.addresses[addressIndex].isDefault && user.addresses.length > 1) {
                user.addresses.splice(addressIndex, 1); // Sil
                if (user.addresses.length > 0) {
                    user.addresses[0].isDefault = true; // Kalan ilk adresi varsayılan yap
                }
            } else {
                user.addresses.splice(addressIndex, 1); // Sil
            }

            await user.save();
            res.json({ message: "Adres başarıyla silindi.", addresses: user.addresses });
        } else {
            res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }
    } catch (error) {
        console.error("Adres silme hatası:", error);
        res.status(500).json({ message: "Adres silinemedi." });
    }
};

// --- KULLANICI ADRES YÖNETİMİ FONKSİYONLARI SONU ---


// @desc    Kullanıcının tüm ödeme yöntemlerini getir
// @route   GET /api/users/profile/payment-methods
// @access  Private
const getUserPaymentMethods = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            res.json(user.paymentMethods);
        } else {
            res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }
    } catch (error) {
        console.error("Ödeme yöntemlerini alma hatası:", error);
        res.status(500).json({ message: "Ödeme yöntemleri alınamadı." });
    }
};

// @desc    Yeni ödeme yöntemi (kart) ekle
// @route   POST /api/users/profile/payment-methods
// @access  Private
const addPaymentMethod = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            let { cardHolderName, cardNumber, expiryMonth, expiryYear, cardType, isDefault } = req.body; // 'let' ile isDefault'u değiştirebiliriz

            if (!cardHolderName || !cardNumber || !expiryMonth || !expiryYear) {
                return res.status(400).json({ message: "Tüm kart bilgileri gereklidir." });
            }

            // Kart numarasının sadece son 4 hanesini saklayalım
            const cardNumberLast4 = cardNumber.slice(-4);

            // Eğer yeni kart varsayılan olacaksa, diğer varsayılanları kaldır
            if (isDefault) {
                user.paymentMethods.forEach(pm => (pm.isDefault = false));
            } else if (user.paymentMethods.length === 0) {
                // Eğer hiç ödeme yöntemi yoksa, otomatik varsayılan yap
                isDefault = true; // isDefault'ı burada güncelliyoruz
            }

            const newPaymentMethod = {
                cardHolderName,
                cardNumberLast4,
                expiryMonth,
                expiryYear,
                cardType,
                isDefault
            };
            user.paymentMethods.push(newPaymentMethod);

            await user.save(); // User.js'deki pre('save') hook'u varsayılan kart mantığını halleder
            res.status(201).json(user.paymentMethods); // Güncel ödeme yöntemi listesini gönder
        } else {
            res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }
    } catch (error) {
        console.error("Ödeme yöntemi ekleme hatası:", error);
        res.status(500).json({ message: "Ödeme yöntemi eklenemedi." });
    }
};

// @desc    Ödeme yöntemini (kartı) güncelle
// @route   PUT /api/users/profile/payment-methods/:id
// @access  Private
const updatePaymentMethod = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            const paymentMethodId = req.params.id;
            const { cardHolderName, expiryMonth, expiryYear, cardType, isDefault } = req.body;
            // Kart numarası güncellenmeyecek, sadece diğer bilgiler

            let targetPaymentMethod = user.paymentMethods.id(paymentMethodId);

            if (!targetPaymentMethod) {
                return res.status(404).json({ message: "Ödeme yöntemi bulunamadı." });
            }

            // Eğer güncellenen kart varsayılan olacaksa, diğer varsayılanları kaldır
            if (isDefault) {
                user.paymentMethods.forEach(pm => {
                    if (pm._id.toString() !== paymentMethodId) {
                        pm.isDefault = false;
                    }
                });
            }

            targetPaymentMethod.set({
                cardHolderName,
                expiryMonth,
                expiryYear,
                cardType,
                isDefault,
            });

            await user.save();
            res.json(user.paymentMethods); // Güncel ödeme yöntemi listesini gönder
        } else {
            res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }
    } catch (error) {
        console.error("Ödeme yöntemi güncelleme hatası:", error);
        res.status(500).json({ message: "Ödeme yöntemi güncellenemedi." });
    }
};

// @desc    Ödeme yöntemini (kartı) sil
// @route   DELETE /api/users/profile/payment-methods/:id
// @access  Private
const deletePaymentMethod = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            const paymentMethodId = req.params.id;

            const pmIndex = user.paymentMethods.findIndex(pm => pm._id.toString() === paymentMethodId);

            if (pmIndex === -1) {
                return res.status(404).json({ message: "Ödeme yöntemi bulunamadı." });
            }

            // Eğer silinen kart varsayılan ise ve başka kart varsa, yeni bir varsayılan belirle
            if (user.paymentMethods[pmIndex].isDefault && user.paymentMethods.length > 1) {
                user.paymentMethods.splice(pmIndex, 1); // Sil
                if (user.paymentMethods.length > 0) {
                    user.paymentMethods[0].isDefault = true; // Kalan ilk kartı varsayılan yap
                }
            } else {
                user.paymentMethods.splice(pmIndex, 1); // Sil
            }

            await user.save();
            res.json({ message: "Ödeme yöntemi başarıyla silindi.", paymentMethods: user.paymentMethods });
        } else {
            res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }
    } catch (error) {
        console.error("Ödeme yöntemi silme hatası:", error);
        res.status(500).json({ message: "Ödeme yöntemi silinemedi." });
    }
};

module.exports = {
    // Mevcut adres fonksiyonları
    getUserAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    // YENİ Ödeme Yöntemi fonksiyonları
    getUserPaymentMethods,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
};