import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendCode = () => {
    if (!email || !email.includes("@")) {
      return setError("Geçerli bir email girin.");
    }
    setError("");
    setStep(2);
    // Burada backend'e kod gönderme isteği atılabilir.
  };

  const handleCheckCode = () => {
    if (code !== "1234") {
      return setError("Kod yanlış. Lütfen tekrar deneyin.");
    }
    setError("");
    setStep(3);
  };

  const handleResetPassword = () => {
    if (newPassword.length < 6) {
      return setError("Yeni şifre en az 6 karakter olmalı.");
    }
    alert("Şifreniz başarıyla sıfırlandı.");
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-gray-800 rounded shadow text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Şifre Sıfırlama</h2>

      {step === 1 && (
        <>
          <p className="mb-4 text-sm text-gray-300">
            Lütfen email adresinizi girin. Size bir doğrulama kodu göndereceğiz.
          </p>
          <input
            type="email"
            placeholder="Email adresiniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded text-black mb-3"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={handleSendCode}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Kodu Gönder
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p className="mb-4 text-sm text-gray-300">
            Lütfen emailinize gönderilen doğrulama kodunu girin.
          </p>
          <input
            type="text"
            placeholder="Doğrulama kodu"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-2 rounded text-black mb-3"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={handleCheckCode}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Kodu Doğrula
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <p className="mb-4 text-sm text-gray-300">
            Yeni şifrenizi girin. Bu işlem sonrası giriş yapabilirsiniz.
          </p>
          <input
            type="password"
            placeholder="Yeni Şifre"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 rounded text-black mb-3"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={handleResetPassword}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Şifreyi Sıfırla
          </button>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
