import React from "react";

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Gizlilik Politikası</h1>
      <p className="mb-4">
        NetPazar olarak, kullanıcılarımızın gizliliğine büyük önem veriyoruz. Bu gizlilik politikası, sitemizi kullandığınızda hangi bilgileri topladığımızı, nasıl kullandığımızı ve bu bilgileri nasıl koruduğumuzu açıklar.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Toplanan Bilgiler</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Kayıt sırasında sağlanan ad, e-posta, adres gibi kişisel bilgiler</li>
        <li>Alışveriş geçmişi ve sipariş verileri</li>
        <li>Çerezler ve kullanım istatistikleri</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Bilgilerin Kullanımı</h2>
      <p>
        Toplanan bilgiler siparişlerinizi tamamlamak, hizmet kalitemizi artırmak ve size daha iyi bir alışveriş deneyimi sunmak amacıyla kullanılır.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Veri Güvenliği</h2>
      <p>
        Kişisel bilgileriniz güvenli sunucularda saklanmakta ve yalnızca yetkili personel tarafından erişilebilmektedir.
      </p>
      <p className="mt-6">Bu politikayı zaman zaman güncelleyebiliriz. Güncellemeleri takip etmek sizin sorumluluğunuzdadır.</p>
    </div>
  );
};

export default Privacy;
