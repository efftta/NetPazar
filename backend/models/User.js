// backend/models/User.js - GÜNCEL VE DOĞRU HALİ (Adres Şeması Güncellendi)
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Adres şeması
const addressSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Ev, İş, vb.
    fullName: { type: String, required: true }, // Yeni eklendi: Ad Soyad
    addressLine1: { type: String, required: true }, // 'address' yerine adresin ilk satırı
    addressLine2: { type: String }, // Yeni eklendi: Daire, Kat, Bina adı (isteğe bağlı)
    city: { type: String, required: true },
    state: { type: String, required: true }, // Yeni eklendi: İlçe/Eyalet
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: "Türkiye" }, // Varsayılan ülke
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false }, // Varsayılan adres mi?
}, { _id: true }); // _id: true, alt belgelerin kendi ID'lerine sahip olmasını sağlar

// Ödeme Yöntemi (Kart) Şeması (Değişiklik Yok)
const paymentMethodSchema = new mongoose.Schema({
    cardHolderName: { type: String, required: true },
    cardNumberLast4: { type: String, required: true },
    expiryMonth: { type: String, required: true },
    expiryYear: { type: String, required: true },
    cardType: { type: String }, // Visa, MasterCard, Amex vb.
    isDefault: { type: Boolean, default: false }, // Varsayılan kart mı?
}, { _id: true, timestamps: true });

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
        isSeller: { type: Boolean, default: false },
        addresses: [addressSchema], // Mevcut adresler dizisi
        paymentMethods: [paymentMethodSchema],
    },
    {
        timestamps: true,
    }
);

// Şifreyi kaydetmeden önce hashle
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    if (this.isModified('addresses')) {
        const defaultAddressIndex = this.addresses.findIndex(addr => addr.isDefault);
        if (defaultAddressIndex !== -1) {
            this.addresses.forEach((addr, index) => {
                if (index !== defaultAddressIndex) {
                    addr.isDefault = false;
                }
            });
        }
    }

    if (this.isModified('paymentMethods')) {
        const defaultPaymentMethodIndex = this.paymentMethods.findIndex(pm => pm.isDefault);
        if (defaultPaymentMethodIndex !== -1) {
            this.paymentMethods.forEach((pm, index) => {
                if (index !== defaultPaymentMethodIndex) {
                    pm.isDefault = false;
                }
            });
        }
    }

    next();
});

// Şifre karşılaştırma metodu
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;