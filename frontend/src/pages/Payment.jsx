// frontend/src/pages/Payment.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/orderApi";
import {
  fetchUserAddresses,
  fetchUserPaymentMethods,
  addPaymentMethod,
} from "../api/userApi";
import { useForm } from "react-hook-form";
import { MapPin, CreditCard, Loader2, PlusCircle, PenTool, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";

const Payment = () => {
  const { cartItems, total, clearCart } = useCart();
  const { token, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null); // Başlangıçta null
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cashOnDelivery");
  const [selectedSavedCard, setSelectedSavedCard] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fetchingData, setFetchingData] = useState(true);

  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newCardData, setNewCardData] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    isDefault: false,
  });

  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeError, setCodeError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    reset, // reset fonksiyonu eklendi
    formState: { errors },
    clearErrors,
  } = useForm({
    mode: "onChange",
    // Başlangıç default değerlerini burada tanımlayarak uncontrolled/controlled uyarısını önleyebiliriz
    defaultValues: {
      title: "",
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "", // Yeni eklenen alan
      postalCode: "",
      country: "",
      phone: "",
    },
  });

  // Kullanıcı ve sepet durumu kontrolü
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate("/login", { replace: true });
        return;
      }
      if (cartItems.length === 0) {
        setErrorMessage("Sepetiniz boş. Lütfen önce ürün ekleyin.");
        toast.info("Sepetiniz boş. Lütfen önce ürün ekleyin.");
      }
    }
  }, [authLoading, isAuthenticated, cartItems, navigate]);

  // Kullanıcı adreslerini ve ödeme yöntemlerini çekme
  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && token && cartItems.length > 0) {
        setFetchingData(true);
        try {
          const fetchedAddresses = await fetchUserAddresses(token);
          setAddresses(fetchedAddresses);
          const defaultAddr = fetchedAddresses.find((addr) => addr.isDefault);

          if (defaultAddr) {
            handleAddressSelect(defaultAddr); // Varsayılanı seç
          } else if (fetchedAddresses.length > 0) {
            handleAddressSelect(fetchedAddresses[0]); // Yoksa ilkini seç
          } else {
            // Hiç adres yoksa, manuel giriş alanlarını sıfırla
            setSelectedAddress(null);
            reset({ // form alanlarını varsayılan boş değerlere sıfırla
              title: "",
              fullName: "",
              addressLine1: "",
              addressLine2: "",
              city: "",
              state: "",
              postalCode: "",
              country: "",
              phone: "",
            });
            clearErrors(); // Tüm form hatalarını temizle
          }

          const fetchedPaymentMethods = await fetchUserPaymentMethods(token);
          setPaymentMethods(fetchedPaymentMethods);
          const defaultCard = fetchedPaymentMethods.find((pm) => pm.isDefault);
          if (defaultCard) {
            handleSavedCardSelect(defaultCard);
          } else if (fetchedPaymentMethods.length > 0) {
            handleSavedCardSelect(fetchedPaymentMethods[0]);
          }
        } catch (err) {
          console.error("Kullanıcı verileri çekilirken hata:", err);
          setErrorMessage(err.message || "Bilgileriniz yüklenirken bir hata oluştu.");
          toast.error(err.message || "Bilgileriniz yüklenirken bir hata oluştu.");
        } finally {
          setFetchingData(false);
        }
      }
    };
    fetchData();
  }, [isAuthenticated, token, cartItems, setValue, clearErrors, reset]); // reset bağımlılık olarak eklendi

  // Adres seçimi veya manuel giriş durumunda form hatalarını yönetir
  const handleAddressSelect = useCallback((address) => {
    setSelectedAddress(address);
    if (address) {
      // Kayıtlı adres seçildiğinde manuel giriş alanlarını sıfırla ve hataları temizle
      // reset ile form alanlarını kayıtlı adresin bilgileriyle doldur
      reset({
        title: address.title || "",
        fullName: address.fullName || "",
        addressLine1: address.addressLine1 || "",
        addressLine2: address.addressLine2 || "",
        city: address.city || "",
        state: address.state || "",
        postalCode: address.postalCode || "",
        country: address.country || "",
        phone: address.phone || "",
      });
      clearErrors(); // Tüm form hatalarını temizle
    } else {
      // Manuel giriş seçildiğinde form alanlarını boşalt
      reset({
        title: "",
        fullName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
      });
      clearErrors();
    }
  }, [setValue, clearErrors, reset]);

  const handlePaymentMethodTypeSelect = useCallback((method) => {
    setSelectedPaymentMethod(method);
    setShowVerificationInput(false);
    setVerificationCode("");
    setCodeError("");

    if (method === "cashOnDelivery") {
      setSelectedSavedCard(null);
      setShowNewCardForm(false);
    }
    if (method === "creditCard" && paymentMethods.length === 0) {
      setShowNewCardForm(true);
    }
  }, [paymentMethods]);

  const handleSavedCardSelect = useCallback((card) => {
    setSelectedSavedCard(card);
    setSelectedPaymentMethod("creditCard");
    setShowNewCardForm(false);
  }, []);

  const handleNewCardInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCardData({
      ...newCardData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSaveNewCard = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      if (
        !newCardData.cardHolderName ||
        !newCardData.cardNumber ||
        !newCardData.expiryMonth ||
        !newCardData.expiryYear
      ) {
        setErrorMessage("Lütfen tüm kart bilgilerini eksiksiz girin.");
        toast.error("Lütfen tüm kart bilgilerini eksiksiz girin.");
        setLoading(false);
        return;
      }

      let cardType = "Unknown";
      if (/^4/.test(newCardData.cardNumber)) cardType = "Visa";
      else if (/^5[1-5]/.test(newCardData.cardNumber)) cardType = "MasterCard";
      else if (/^3[47]/.test(newCardData.cardNumber)) cardType = "Amex";

      const cardToSave = {
        cardHolderName: newCardData.cardHolderName,
        cardNumber: newCardData.cardNumber,
        expiryMonth: newCardData.expiryMonth,
        expiryYear: newCardData.expiryYear,
        cardType: cardType,
        isDefault: newCardData.isDefault,
      };

      const updatedPaymentMethods = await addPaymentMethod(cardToSave, token);
      setPaymentMethods(updatedPaymentMethods);
      setShowNewCardForm(false);
      setNewCardData({
        cardHolderName: "",
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        isDefault: false,
      });
      toast.success("Yeni kart başarıyla eklendi!");

      const last4Digits = newCardData.cardNumber.slice(-4);
      const newlyAddedCard = updatedPaymentMethods.find(
        (pm) => pm.cardHolderName === cardToSave.cardHolderName && pm.cardNumberLast4 === last4Digits
      );
      if (newlyAddedCard) {
        handleSavedCardSelect(newlyAddedCard);
      }
    } catch (err) {
      console.error("Yeni kart ekleme hatası:", err);
      setErrorMessage(err.message || "Yeni kart eklenirken bir hata oluştu.");
      toast.error(err.message || "Yeni kart eklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const finalizeOrder = async (shippingInfo) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const orderData = {
        products: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.discountPrice || item.price,
        })),
        shippingInfo: shippingInfo, // Doğrudan gönderiyoruz, doğru formatta olduğunu varsayarak
        paymentMethod: {
          type: selectedPaymentMethod,
          ...(selectedPaymentMethod === "creditCard" && selectedSavedCard && {
            cardId: selectedSavedCard._id,
            last4: selectedSavedCard.cardNumberLast4,
            cardHolderName: selectedSavedCard.cardHolderName,
          }),
        },
        totalPrice: total,
        status: "pending",
      };

      console.log("Gönderilen Sipariş Verisi:", orderData);

      const createdOrder = await createOrder(orderData, token);
      clearCart();
      toast.success("Siparişiniz başarıyla oluşturuldu!");
      navigate("/order-success", {
        state: {
          orderId: createdOrder._id,
          totalPrice: createdOrder.totalPrice,
        },
      });
    } catch (error) {
      console.error("Sipariş oluşturma hatası:", error);
      setErrorMessage(error.message || "Sipariş oluşturulurken bir hata oluştu.");
      toast.error(error.message || "Sipariş oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateOrder = async () => {
    setErrorMessage("");
    setCodeError("");

    if (!token) {
      setErrorMessage("Sipariş oluşturmak için lütfen giriş yapın.");
      toast.error("Sipariş oluşturmak için lütfen giriş yapın.");
      return;
    }

    let finalShippingInfo;
    // Eğer kayıtlı adres seçili ise, selectedAddress'i kullan
    if (selectedAddress) {
      finalShippingInfo = {
        title: selectedAddress.title,
        fullName: selectedAddress.fullName,
        addressLine1: selectedAddress.addressLine1,
        addressLine2: selectedAddress.addressLine2 || "", // Opsiyonel
        city: selectedAddress.city,
        state: selectedAddress.state,
        postalCode: selectedAddress.postalCode,
        country: selectedAddress.country,
        phone: selectedAddress.phone,
      };
    } else {
      // Kayıtlı adres seçili değilse, manuel giriş alanlarını doğrula
      // Tüm adres alanlarını doğrula
      const isValid = await trigger([
        "title",
        "fullName",
        "addressLine1",
        "city",
        "state",
        "postalCode",
        "country",
        "phone",
      ]);
      if (!isValid) {
        setErrorMessage("Lütfen tüm adres bilgilerini eksiksiz ve doğru girin.");
        toast.error("Lütfen tüm adres bilgilerini eksiksiz ve doğru girin.");
        return;
      }
      finalShippingInfo = {
        title: getValues("title"),
        fullName: getValues("fullName"),
        addressLine1: getValues("addressLine1"),
        addressLine2: getValues("addressLine2") || "", // Opsiyonel
        city: getValues("city"),
        state: getValues("state"),
        postalCode: getValues("postalCode"),
        country: getValues("country"),
        phone: getValues("phone"),
      };
    }

    if (selectedPaymentMethod === "creditCard") {
      if (!selectedSavedCard && !showNewCardForm) {
        setErrorMessage("Lütfen bir kayıtlı kart seçin veya yeni bir kart ekleyin.");
        toast.error("Lütfen bir kayıtlı kart seçin veya yeni bir kart ekleyin.");
        return;
      }
      if (showNewCardForm) {
        setErrorMessage("Lütfen yeni kart bilgilerinizi kaydedin veya kayıtlı bir kart seçin.");
        toast.error("Lütfen yeni kart bilgilerinizi kaydedin veya kayıtlı bir kart seçin.");
        return;
      }
      setShowVerificationInput(true);
      return;
    }

    await finalizeOrder(finalShippingInfo);
  };

  const handleVerifyCode = async () => {
    setCodeError("");
    if (verificationCode === "1234") { // Burası gerçek bir entegrasyonda bankadan gelen kodla doğrulanmalı
      setShowVerificationInput(false);
      setVerificationCode("");

      let finalShippingInfo;
      if (selectedAddress) {
        finalShippingInfo = {
          title: selectedAddress.title,
          fullName: selectedAddress.fullName,
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2 || "",
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
          phone: selectedAddress.phone,
        };
      } else {
        const formData = getValues(); // En güncel form verilerini al
        finalShippingInfo = {
          title: formData.title,
          fullName: formData.fullName,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2 || "",
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        };
      }
      await finalizeOrder(finalShippingInfo);
    } else {
      setCodeError("Hatalı onay kodu. Lütfen tekrar deneyin.");
      toast.error("Hatalı onay kodu. Lütfen tekrar deneyin.");
      setVerificationCode("");
    }
  };

  // Sipariş Onayla butonunun disable durumu
  const isPlaceOrderButtonDisabled =
    loading ||
    cartItems.length === 0 ||
    (selectedAddress === null && ( // Manuel giriş yapılıyorsa
      !getValues("addressLine1") || // Yeni alanları kontrol et
      !getValues("fullName") ||
      !getValues("title") ||
      !getValues("state") ||
      !getValues("city") ||
      !getValues("postalCode") ||
      !getValues("country") ||
      !getValues("phone") ||
      Object.keys(errors).length > 0 // Formda hata varsa
    )) ||
    (selectedPaymentMethod === "creditCard" && selectedSavedCard === null && !showNewCardForm);


  if (authLoading || fetchingData || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-center">
        {cartItems.length === 0 ? (
          <p className="text-center text-red-400">Sepetiniz boş. Lütfen önce ürün ekleyin.</p>
        ) : (
          <p className="flex items-center"><Loader2 className="animate-spin mr-2" />Yükleniyor...</p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-start">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">Siparişi Tamamla</h1>

        <div className="mb-6 bg-gray-700 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">
            Toplam Tutar: ₺{total.toFixed(2)}
          </h2>
        </div>

        {errorMessage && (
          <p className="mt-4 text-center text-red-400 mb-4 flex items-center justify-center">
            <XCircle className="mr-2" size={20} /> {errorMessage}
          </p>
        )}
        {codeError && (
          <p className="mt-4 text-center text-orange-400 mb-4 flex items-center justify-center">
            <XCircle className="mr-2" size={20} /> {codeError}
          </p>
        )}

        <form onSubmit={handleSubmit(handleInitiateOrder)} className="space-y-6">
          {/* Adres Seçimi Bölümü */}
          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <MapPin className="mr-2" /> Teslimat Adresi Seçin
            </h2>
            {addresses.length === 0 ? (
              <p className="text-gray-400 mb-4">Kayıtlı adresiniz bulunmamaktadır. Lütfen aşağıdaki formu doldurun.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={`block p-4 border rounded-md cursor-pointer transition-colors ${
                      selectedAddress && selectedAddress._id === addr._id
                        ? "border-green-500 ring-2 ring-green-500 bg-green-900"
                        : "border-gray-600 hover:border-gray-400 bg-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingAddress"
                      value={addr._id}
                      checked={selectedAddress && selectedAddress._id === addr._id}
                      onChange={() => handleAddressSelect(addr)}
                      className="hidden"
                    />
                    <div className="flex items-start">
                      <div className="flex-grow">
                        <p className="font-semibold text-lg">{addr.title}</p>
                        <p className="text-gray-300 text-sm">{addr.addressLine1} {addr.addressLine2}</p>
                        <p className="text-gray-400 text-xs">{addr.city}, {addr.state}, {addr.postalCode}, {addr.country}</p>
                        <p className="text-gray-400 text-xs">Tel: {addr.phone}</p>
                      </div>
                      {addr.isDefault && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-2 py-1 rounded-full">
                          Varsayılan
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 border border-gray-600 rounded-md bg-gray-700">
              <h3 className="text-lg font-semibold mb-3">Veya Yeni Adres Bilgilerini Girin</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Yeni alanlar eklendi */}
                <div>
                  <label htmlFor="titleInput" className="block text-sm font-medium text-gray-300">
                    Adres Başlığı (Ev/İş)
                  </label>
                  <input
                    id="titleInput"
                    type="text"
                    {...register("title", { required: !selectedAddress && "Adres başlığı zorunludur." })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
                    onChange={(e) => {
                        setValue("title", e.target.value);
                        if (selectedAddress) setSelectedAddress(null);
                    }}
                  />
                  {errors.title && !selectedAddress && (
                    <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="fullNameInput" className="block text-sm font-medium text-gray-300">
                    Alıcı Ad Soyad
                  </label>
                  <input
                    id="fullNameInput"
                    type="text"
                    {...register("fullName", { required: !selectedAddress && "Ad Soyad zorunludur." })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
                    onChange={(e) => {
                        setValue("fullName", e.target.value);
                        if (selectedAddress) setSelectedAddress(null);
                    }}
                  />
                  {errors.fullName && !selectedAddress && (
                    <p className="mt-1 text-sm text-red-400">{errors.fullName.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="addressLine1Input" className="block text-sm font-medium text-gray-300">
                    Adres Satırı 1 (Cadde, Sokak, No)
                  </label>
                  <input
                    id="addressLine1Input"
                    type="text"
                    {...register("addressLine1", { required: !selectedAddress && "Adres satırı 1 zorunludur." })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
                    onChange={(e) => {
                        setValue("addressLine1", e.target.value);
                        if (selectedAddress) setSelectedAddress(null);
                    }}
                  />
                  {errors.addressLine1 && !selectedAddress && (
                    <p className="mt-1 text-sm text-red-400">{errors.addressLine1.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="addressLine2Input" className="block text-sm font-medium text-gray-300">
                    Adres Satırı 2 (Daire, Kat, Bina Adı - İsteğe Bağlı)
                  </label>
                  <input
                    id="addressLine2Input"
                    type="text"
                    {...register("addressLine2")} // İsteğe bağlı olduğu için required yok
                    className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
                    onChange={(e) => {
                        setValue("addressLine2", e.target.value);
                        if (selectedAddress) setSelectedAddress(null);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="cityInput" className="block text-sm font-medium text-gray-300">
                    Şehir
                  </label>
                  <input
                    id="cityInput"
                    type="text"
                    {...register("city", { required: !selectedAddress && "Şehir zorunludur." })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
                    onChange={(e) => {
                        setValue("city", e.target.value);
                        if (selectedAddress) setSelectedAddress(null);
                    }}
                  />
                  {errors.city && !selectedAddress && (
                    <p className="mt-1 text-sm text-red-400">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="stateInput" className="block text-sm font-medium text-gray-300">
                    İlçe / Eyalet
                  </label>
                  <input
                    id="stateInput"
                    type="text"
                    {...register("state", { required: !selectedAddress && "İlçe / Eyalet zorunludur." })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
                    onChange={(e) => {
                        setValue("state", e.target.value);
                        if (selectedAddress) setSelectedAddress(null);
                    }}
                  />
                  {errors.state && !selectedAddress && (
                    <p className="mt-1 text-sm text-red-400">{errors.state.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="postalCodeInput" className="block text-sm font-medium text-gray-300">
                    Posta Kodu
                  </label>
                  <input
                    id="postalCodeInput"
                    type="text"
                    {...register("postalCode", { required: !selectedAddress && "Posta kodu zorunludur." })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
                    onChange={(e) => {
                        setValue("postalCode", e.target.value);
                        if (selectedAddress) setSelectedAddress(null);
                    }}
                  />
                  {errors.postalCode && !selectedAddress && (
                    <p className="mt-1 text-sm text-red-400">{errors.postalCode.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="countryInput" className="block text-sm font-medium text-gray-300">
                    Ülke
                  </label>
                  <input
                    id="countryInput"
                    type="text"
                    {...register("country", { required: !selectedAddress && "Ülke zorunludur." })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
                    onChange={(e) => {
                        setValue("country", e.target.value);
                        if (selectedAddress) setSelectedAddress(null);
                    }}
                  />
                  {errors.country && !selectedAddress && (
                    <p className="mt-1 text-sm text-red-400">{errors.country.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="phoneInput" className="block text-sm font-medium text-gray-300">
                    Telefon Numarası
                  </label>
                  <input
                    id="phoneInput"
                    type="text"
                    {...register("phone", { required: !selectedAddress && "Telefon numarası zorunludur." })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
                    onChange={(e) => {
                        setValue("phone", e.target.value);
                        if (selectedAddress) setSelectedAddress(null);
                    }}
                  />
                  {errors.phone && !selectedAddress && (
                    <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ödeme Yöntemi Seçimi Bölümü */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <CreditCard className="mr-2" /> Ödeme Yöntemi Seçin
            </h2>
            <div className="space-y-3">
              <label
                className={`block p-4 border rounded-md cursor-pointer transition-colors ${
                  selectedPaymentMethod === "cashOnDelivery"
                    ? "border-green-500 ring-2 ring-green-500 bg-green-900"
                    : "border-gray-600 hover:border-gray-400 bg-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethodOption"
                  value="cashOnDelivery"
                  checked={selectedPaymentMethod === "cashOnDelivery"}
                  onChange={() => handlePaymentMethodTypeSelect("cashOnDelivery")}
                  className="mr-2 hidden"
                />
                <span className="font-semibold text-lg">Kapıda Ödeme</span>
                <p className="text-gray-300 text-sm">Ürünleri teslim alırken nakit veya kart ile ödeme yapabilirsiniz.</p>
              </label>

              <label
                className={`block p-4 border rounded-md cursor-pointer transition-colors ${
                  selectedPaymentMethod === "creditCard"
                    ? "border-green-500 ring-2 ring-green-500 bg-green-900"
                    : "border-gray-600 hover:border-gray-400 bg-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethodOption"
                  value="creditCard"
                  checked={selectedPaymentMethod === "creditCard"}
                  onChange={() => handlePaymentMethodTypeSelect("creditCard")}
                  className="mr-2 hidden"
                />
                <span className="font-semibold text-lg">Kredi Kartı ile Ödeme</span>
                <p className="text-gray-300 text-sm">Kaydedilmiş kartlarınızdan birini seçin veya yeni bir kart ekleyin.</p>
              </label>

              {selectedPaymentMethod === "creditCard" && (
                <div className="mt-4 p-4 border border-gray-600 rounded-md bg-gray-700">
                  <h3 className="text-lg font-semibold mb-3">Kayıtlı Kartlarım</h3>
                  {paymentMethods.length === 0 ? (
                    <p className="text-gray-400 text-sm mb-4">Henüz kayıtlı kartınız bulunmamaktadır.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 mb-4">
                      {paymentMethods.map((card) => (
                        <label
                          key={card._id}
                          className={`flex items-center p-3 border rounded-md cursor-pointer ${
                            selectedSavedCard && selectedSavedCard._id === card._id
                              ? "border-blue-500 ring-1 ring-blue-500 bg-blue-900"
                              : "border-gray-500 hover:border-gray-400 bg-gray-600"
                          }`}
                        >
                          <input
                            type="radio"
                            name="savedCard"
                            value={card._id}
                            checked={selectedSavedCard && selectedSavedCard._id === card._id}
                            onChange={() => handleSavedCardSelect(card)}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-grow">
                            <p className="font-medium">{card.cardHolderName} ({card.cardType || "Kart"})</p>
                            <p className="text-sm text-gray-300">**** **** **** {card.cardNumberLast4}</p>
                            <p className="text-xs text-gray-400">Son Kullanma: {card.expiryMonth}/{card.expiryYear}</p>
                          </div>
                          {card.isDefault && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-2 py-1 rounded-full">
                              Varsayılan
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                        setShowNewCardForm(!showNewCardForm);
                        setSelectedSavedCard(null);
                    }}
                    className="w-full mt-2 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center justify-center transition-colors"
                  >
                    <PlusCircle size={18} className="mr-2" />
                    {showNewCardForm ? "Yeni Kart Ekleme Formunu Kapat" : "Yeni Kart Ekle"}
                  </button>

                  {showNewCardForm && (
                    <div className="mt-4 p-4 border border-gray-500 rounded-md bg-gray-700">
                      <h4 className="text-md font-semibold mb-3">Yeni Kart Bilgileri</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-300">Kart Üzerindeki İsim</label>
                          <input type="text" id="cardHolderName" name="cardHolderName" value={newCardData.cardHolderName} onChange={handleNewCardInputChange} className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md" required />
                        </div>
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300">Kart Numarası</label>
                          <input type="text" id="cardNumber" name="cardNumber" value={newCardData.cardNumber} onChange={handleNewCardInputChange} className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md" required maxLength="16" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-300">Ay (AA)</label>
                            <input type="text" id="expiryMonth" name="expiryMonth" value={newCardData.expiryMonth} onChange={handleNewCardInputChange} className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md" placeholder="MM" required maxLength="2" />
                          </div>
                          <div>
                            <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-300">Yıl (YY)</label>
                            <input type="text" id="expiryYear" name="expiryYear" value={newCardData.expiryYear} onChange={handleNewCardInputChange} className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md" placeholder="YY" required maxLength="2" />
                          </div>
                        </div>
                        <div className="flex items-center mt-2">
                          <input type="checkbox" id="isDefaultCard" name="isDefault" checked={newCardData.isDefault} onChange={handleNewCardInputChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded" />
                          <label htmlFor="isDefaultCard" className="ml-2 block text-sm font-medium text-gray-300">Varsayılan Kart Yap</label>
                        </div>
                        <button type="button" onClick={handleSaveNewCard} disabled={loading} className={`w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center justify-center transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          {loading ? <Loader2 className="animate-spin mr-2" /> : <PenTool className="mr-2" />} Kartı Kaydet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {showVerificationInput && selectedPaymentMethod === "creditCard" && (
            <div className="mb-8 p-6 bg-gray-700 rounded-lg shadow-inner text-center">
              <h3 className="text-xl font-semibold mb-4 text-orange-300 flex items-center justify-center">
                <CreditCard className="mr-2" /> Kredi Kartı Güvenlik Onayı
              </h3>
              <p className="text-gray-300 mb-4">
                Güvenliğiniz için, kredi kartı sahibinin kayıtlı telefon numarasına gönderilen 4 haneli kodu giriniz.
              </p>
              <input
                type="text"
                maxLength="4"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Onay Kodu"
                className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 transition-all text-center text-2xl tracking-widest"
                inputMode="numeric"
                pattern="[0-9]*"
              />
              {codeError && (
                <p className="mt-2 text-sm text-orange-400 flex items-center justify-center">
                  <XCircle className="mr-1" size={16} /> {codeError}
                </p>
              )}
              <button
                type="button"
                onClick={handleVerifyCode}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center"
                disabled={loading || verificationCode.length !== 4}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> Doğrulanıyor...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2" /> Kodu Doğrula ve Siparişi Onayla
                  </>
                )}
              </button>
            </div>
          )}

          {!showVerificationInput && (
            <button
              type="submit"
              disabled={isPlaceOrderButtonDisabled}
              className={`w-full py-3 px-4 rounded-md text-lg font-semibold transition-colors flex items-center justify-center ${
                isPlaceOrderButtonDisabled
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Sipariş Veriliyor...
                </>
              ) : (
                "Siparişi Onayla"
              )}
            </button>
          )}
        </form>

        <button
          onClick={() => navigate("/cart")}
          className="mt-6 w-full flex items-center justify-center text-gray-400 hover:text-white transition-colors py-2 px-4 rounded-md border border-gray-700 hover:border-gray-500"
        >
          <Loader2 className="mr-2" size={18} /> Sepete Geri Dön
        </button>
      </div>
    </div>
  );
};

export default Payment;