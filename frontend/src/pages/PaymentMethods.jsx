// src/pages/PaymentMethods.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import {
  fetchUserPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../api/userApi";

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [newMethod, setNewMethod] = useState({
    cardHolderName: "", // YENİ: Kart sahibinin adı
    cardType: "",
    cardNumber: "", // Tam kart numarasını almak için alan
    expiry: "", // MM/YY formatında
    cvc: "", // CVC/CVV almak için alan (sadece ekleme formunda)
    isDefault: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const getPaymentMethods = async () => {
    if (!token) {
      setError("Kimlik doğrulama token'ı bulunamadı. Lütfen giriş yapın.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserPaymentMethods(token);
      setPaymentMethods(data); // Backend'den gelen 'lastFour' veya 'cardNumberLast4' alanını zaten bekliyoruz.
    } catch (err) {
      console.error("Ödeme yöntemleri alınamadı:", err);
      setError(err.message || "Ödeme yöntemleri alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPaymentMethods();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) {
        formattedValue = formattedValue.substring(0, 19);
      }
    }
    if (name === "expiry") {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
      }
      if (formattedValue.length > 5) {
        formattedValue = formattedValue.substring(0, 5);
      }
    }
    if (name === "cvc") {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setNewMethod({
      ...newMethod,
      [name]: type === "checkbox" ? checked : formattedValue,
    });
  };

  const handleAddOrUpdateMethod = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Kimlik doğrulama token'ı bulunamadı. Lütfen giriş yapın.");
      return;
    }

    setSubmitting(true);
    setError(null);

    // Son kullanma tarihini ay ve yıl olarak ayrıştır
    const [expiryMonth, expiryYearShort] = newMethod.expiry.split('/').map(part => part.trim());

    // Backend'iniz expiryYear'ı "YYYY" formatında bekliyorsa (örn: 2025)
    // Eğer backend "YY" (örn: 25) bekliyorsa sadece expiryYearShort kullanın
    const expiryYearFull = expiryYearShort ? `20${expiryYearShort}` : null; // Backend'inize göre bu dönüşümü ayarlayın

    let dataToSend = {
      cardHolderName: newMethod.cardHolderName, // YENİ: Kart sahibinin adını ekle
      cardType: newMethod.cardType,
      expiryMonth: expiryMonth,
      expiryYear: expiryYearFull, // Backend'inizin beklediği formata göre ayarlayın
      isDefault: newMethod.isDefault,
    };

    // Sadece yeni kart eklerken tam kart numarasını ve CVC'yi gönderin.
    // CVC backend modelinizde saklanmadığı için, bu bilgi sadece ödeme ağ geçidine
    // tokenizasyon sırasında gönderilmelidir. Sizin mevcut setup'ınızda backend'e gitmiyor.
    // Bu yüzden frontend'de CVC input'u olsa da, şu anki backend modelinize göre
    // doğrudan addPaymentMethod'a göndermiyoruz.
    if (!editingMethod) {
      dataToSend.cardNumber = newMethod.cardNumber.replace(/\s/g, ''); // Boşlukları kaldır
      // dataToSend.cvc = newMethod.cvc; // CVC'yi buraya eklemeyin, backend modelinizde yok.
    }

    try {
      if (editingMethod) {
        // Kart güncelleme durumunda sadece güncellenmesine izin verilen alanları gönderin
        // cardHolderName, cardType, expiryMonth, expiryYear, isDefault
        // Kart numarası (cardNumber) ve CVC asla güncellenmemeli
        const updateData = {
          cardHolderName: dataToSend.cardHolderName, // Güncellemede de gönderilebilir
          cardType: dataToSend.cardType,
          expiryMonth: dataToSend.expiryMonth,
          expiryYear: dataToSend.expiryYear,
          isDefault: dataToSend.isDefault,
        };
        await updatePaymentMethod(editingMethod.id, updateData, token);
      } else {
        await addPaymentMethod(dataToSend, token);
      }
      setNewMethod({ cardHolderName: "", cardType: "", cardNumber: "", expiry: "", cvc: "", isDefault: false });
      setShowAddForm(false);
      setEditingMethod(null);
      await getPaymentMethods();
    } catch (err) {
      console.error("Ödeme yöntemi kaydedilirken bir hata oluştu:", err);
      setError(err.message || "Ödeme yöntemi kaydedilirken bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditMethod = (method) => {
    setEditingMethod(method);
    setNewMethod({
      cardHolderName: method.cardHolderName || "", // YENİ: Düzenlerken kart sahibinin adını çek
      cardType: method.cardType || "",
      cardNumber: "", // Düzenlerken tam kart numarasını gösterme
      expiry: `${method.expiryMonth || ""}/${method.expiryYear ? method.expiryYear.toString().slice(-2) : ""}`, // MM/YY olarak formatla
      cvc: "", // Düzenlerken CVC'yi gösterme
      isDefault: method.isDefault,
    });
    setShowAddForm(true);
  };

  const handleDeleteMethod = async (id) => {
    if (!token) {
      setError("Kimlik doğrulama token'ı bulunamadı. Lütfen giriş yapın.");
      return;
    }

    if (window.confirm("Bu ödeme yöntemini silmek istediğinize emin misiniz?")) {
      setSubmitting(true);
      setError(null);
      try {
        await deletePaymentMethod(id, token);
        await getPaymentMethods();
      } catch (err) {
        console.error("Ödeme yöntemi silinirken bir hata oluştu:", err);
        setError(err.message || "Ödeme yöntemi silinirken bir hata oluştu.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="container mx-auto max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Ödeme Yöntemlerim</h2>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingMethod(null);
              setNewMethod({ cardHolderName: "", cardType: "", cardNumber: "", expiry: "", cvc: "", isDefault: false });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
            disabled={submitting}
          >
            <PlusCircle size={20} className="mr-2" />
            {showAddForm ? "İptal" : "Yeni Ödeme Yöntemi Ekle"}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Hata!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleAddOrUpdateMethod}
            className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-8 shadow-inner"
          >
            <h3 className="text-xl font-semibold mb-4">
              {editingMethod ? "Ödeme Yöntemini Düzenle" : "Yeni Ödeme Yöntemi Ekle"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="cardHolderName" className="block text-sm font-medium mb-1">
                  Kart Sahibinin Adı Soyadı
                </label>
                <input
                  type="text"
                  id="cardHolderName"
                  name="cardHolderName"
                  value={newMethod.cardHolderName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label htmlFor="cardType" className="block text-sm font-medium mb-1">
                  Kart Tipi (örn: Visa, MasterCard)
                </label>
                <input
                  type="text"
                  id="cardType"
                  name="cardType"
                  value={newMethod.cardType}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  disabled={submitting}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                  Kart Numarası
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={newMethod.cardNumber}
                  onChange={handleInputChange}
                  placeholder="XXXX XXXX XXXX XXXX"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required={!editingMethod}
                  disabled={submitting || editingMethod}
                />
              </div>
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium mb-1">
                  Son Kullanma Tarihi (AA/YY)
                </label>
                <input
                  type="text"
                  id="expiry"
                  name="expiry"
                  maxLength={5}
                  value={newMethod.expiry}
                  onChange={handleInputChange}
                  placeholder="AA/YY"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                  disabled={submitting}
                />
              </div>
            </div>
            <div> {/* CVC kendi satırında kalabilir */}
              <label htmlFor="cvc" className="block text-sm font-medium mb-1">
                CVC/CVV
              </label>
              <input
                type="text"
                id="cvc"
                name="cvc"
                maxLength={4}
                value={newMethod.cvc}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                required={!editingMethod}
                disabled={submitting || editingMethod}
              />
            </div>
            <div className="flex items-center mt-4 mb-4">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={newMethod.isDefault}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={submitting}
              />
              <label htmlFor="isDefault" className="ml-2 block text-sm font-medium">
                Varsayılan Ödeme Yöntemi Yap
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              disabled={submitting}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingMethod ? "Yöntemi Güncelle" : "Yöntemi Kaydet"}
            </button>
          </motion.form>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="ml-3 text-lg text-gray-600 dark:text-gray-400">Ödeme yöntemleri yükleniyor...</p>
          </div>
        ) : paymentMethods.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
            Henüz kayıtlı ödeme yönteminiz bulunmamaktadır.
          </p>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method._id} // Mongoose alt belgelerinde _id kullanılır
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-5 shadow-sm flex items-start justify-between"
              >
                <div className="flex items-start">
                  <CreditCard size={24} className="text-blue-500 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-1 flex items-center">
                      {method.cardType || "Bilinmiyor"} **** {method.cardNumberLast4}
                      {method.isDefault && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-2 py-1 rounded-full">
                          Varsayılan
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">Kart Sahibi: {method.cardHolderName}</p>
                    <p className="text-gray-700 dark:text-gray-300">Son Kullanma: {method.expiryMonth}/{method.expiryYear ? method.expiryYear.toString().slice(-2) : ""}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditMethod(method)}
                    className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors"
                    title="Düzenle"
                    disabled={submitting}
                  >
                    <Edit size={20} className="text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDeleteMethod(method._id)} // Mongoose alt belgelerinde _id kullanılır
                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-700 transition-colors"
                    title="Sil"
                    disabled={submitting}
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

export default PaymentMethods;