// src/pages/Success.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Eğer React Router kullanıyorsanız

const Success = () => {
  return (
    <div className="success-container">
      <h1>İşlem Başarılı!</h1>
      <p>Tebrikler, işleminiz başarıyla tamamlandı.</p>
      <p>Siparişiniz işleme alındı ve kısa süre içinde size ulaşacaktır.</p>
      {/* İsteğe bağlı olarak ana sayfaya veya sipariş geçmişine yönlendiren bir link ekleyebilirsiniz */}
      <Link to="/" className="success-button">Ana Sayfaya Dön</Link>
      <Link to="/orders" className="success-button">Siparişlerimi Görüntüle</Link>
    </div>
  );
};

export default Success;