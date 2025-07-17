// src/pages/Addresses.jsx (GÜNCEL HALİ - Backend ile Eşleşme İçin Revize Edildi)
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchUserAddresses, addAddress, updateAddress, deleteAddress } from "../api/userApi"; // Yeni API fonksiyonlarını dahil et

const Addresses = () => {
    const { token, isAuthenticated, loading: authLoading } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [newAddress, setNewAddress] = useState({
        title: "",
        fullName: "", // Yeni eklendi
        addressLine1: "", // 'address' yerine
        addressLine2: "", // Yeni eklendi
        city: "",
        state: "", // Yeni eklendi
        postalCode: "",
        country: "Türkiye", // Varsayılan ülke
        phone: "",
        isDefault: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authLoading && isAuthenticated && token) {
            const getAddresses = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const data = await fetchUserAddresses(token);
                    setAddresses(data);
                } catch (err) {
                    console.error("Adresler alınırken hata:", err);
                    setError(err.message || "Adresler yüklenirken bir hata oluştu.");
                } finally {
                    setLoading(false);
                }
            };
            getAddresses();
        } else if (!authLoading && !isAuthenticated) {
            setLoading(false);
        }
    }, [authLoading, isAuthenticated, token]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewAddress({
            ...newAddress,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleAddOrUpdateAddress = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (editingAddress) {
                const updatedAddresses = await updateAddress(editingAddress._id, newAddress, token);
                setAddresses(updatedAddresses);
            } else {
                const updatedAddresses = await addAddress(newAddress, token);
                setAddresses(updatedAddresses);
            }
            setNewAddress({
                title: "",
                fullName: "",
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                postalCode: "",
                country: "Türkiye",
                phone: "",
                isDefault: false
            });
            setEditingAddress(null);
            setShowAddForm(false);
        } catch (err) {
            console.error("Adres işlemi hatası:", err);
            setError(err.message || "Adres kaydedilirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        // Düzenlenecek adresin tüm alanlarını form state'ine aktar
        setNewAddress({
            title: address.title,
            fullName: address.fullName,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            phone: address.phone,
            isDefault: address.isDefault,
        });
        setShowAddForm(true);
    };

    const handleDeleteAddress = async (id) => {
        if (window.confirm("Bu adresi silmek istediğinize emin misiniz?")) {
            setLoading(true);
            setError(null);
            try {
                // deleteAddress API'sinden dönen objenin 'addresses' özelliğini al
                const response = await deleteAddress(id, token);
                setAddresses(response.addresses); // Güncel adres listesini set et
            } catch (err) {
                console.error("Adres silme hatası:", err);
                setError(err.message || "Adres silinirken bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading && !authLoading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-white p-6 flex justify-center items-center">
                <p>Adresler yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-red-400 p-6 text-center">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
            <div className="container mx-auto max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold mb-6 text-center">Adreslerim</h2>

                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => {
                            setShowAddForm(!showAddForm);
                            setEditingAddress(null);
                            setNewAddress({ title: "", fullName: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "Türkiye", phone: "", isDefault: false });
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
                    >
                        <PlusCircle size={20} className="mr-2" />
                        {showAddForm ? "İptal" : "Yeni Adres Ekle"}
                    </button>
                </div>

                {showAddForm && (
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleAddOrUpdateAddress}
                        className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-8 shadow-inner"
                    >
                        <h3 className="text-xl font-semibold mb-4">
                            {editingAddress ? "Adresi Düzenle" : "Yeni Adres Ekle"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium mb-1">
                                    Adres Başlığı (örn: Ev, İş)
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={newAddress.title}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                                    Ad Soyad
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={newAddress.fullName}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="addressLine1" className="block text-sm font-medium mb-1">
                                Açık Adres Satırı 1 (Cadde, Sokak, No)
                            </label>
                            <input
                                type="text"
                                id="addressLine1"
                                name="addressLine1"
                                value={newAddress.addressLine1}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="addressLine2" className="block text-sm font-medium mb-1">
                                Açık Adres Satırı 2 (Daire, Kat, Bina adı - İsteğe Bağlı)
                            </label>
                            <input
                                type="text"
                                id="addressLine2"
                                name="addressLine2"
                                value={newAddress.addressLine2}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium mb-1">
                                    Şehir
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={newAddress.city}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="state" className="block text-sm font-medium mb-1">
                                    İlçe / Eyalet
                                </label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={newAddress.state}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
                                    Posta Kodu
                                </label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    value={newAddress.postalCode}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="country" className="block text-sm font-medium mb-1">
                                Ülke
                            </label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={newAddress.country}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-sm font-medium mb-1">
                                Telefon Numarası
                            </label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={newAddress.phone}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                required
                            />
                        </div>
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="isDefault"
                                name="isDefault"
                                checked={newAddress.isDefault}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isDefault" className="ml-2 block text-sm font-medium">
                                Varsayılan Adres Yap
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (editingAddress ? "Güncelleniyor..." : "Kaydediliyor...") : (editingAddress ? "Adresi Güncelle" : "Adresi Kaydet")}
                        </button>
                    </motion.form>
                )}

                {addresses.length === 0 ? (
                    <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
                        Henüz kayıtlı adresiniz bulunmamaktadır. Lütfen yeni bir adres ekleyin.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {addresses.map((addr) => (
                            <div
                                key={addr._id}
                                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-5 shadow-sm flex items-start justify-between"
                            >
                                <div className="flex items-start">
                                    <MapPin size={24} className="text-blue-500 mr-4 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="text-xl font-semibold mb-1 flex items-center">
                                            {addr.title}
                                            {addr.isDefault && (
                                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-2 py-1 rounded-full">
                                                    Varsayılan
                                                </span>
                                            )}
                                        </h3>
                                        {addr.fullName && <p className="text-gray-700 dark:text-gray-300">{addr.fullName}</p>}
                                        <p className="text-gray-700 dark:text-gray-300">{addr.addressLine1}</p>
                                        {addr.addressLine2 && <p className="text-gray-700 dark:text-gray-300">{addr.addressLine2}</p>}
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">{addr.city}, {addr.state}, {addr.postalCode}, {addr.country}</p>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Tel: {addr.phone}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEditAddress(addr)}
                                        className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors"
                                        title="Düzenle"
                                    >
                                        <Edit size={20} className="text-blue-500" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAddress(addr._id)}
                                        className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-700 transition-colors"
                                        title="Sil"
                                    >
                                        <Trash2 size={20} className="text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Addresses;