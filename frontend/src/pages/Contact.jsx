import React from "react";

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">İletişim</h1>
      <p className="mb-4">
        Aşağıdaki iletişim bilgilerini kullanarak bize ulaşabilirsiniz. Sorularınızı veya geri bildirimlerinizi memnuniyetle karşılarız.
      </p>
      <div className="space-y-3">
        <p><strong>E-posta:</strong> destek@netpazar.com</p>
        <p><strong>Telefon:</strong> +90 212 000 00 00</p>
        <p><strong>Adres:</strong> NetPazar Teknoloji Merkezi, İstanbul, Türkiye</p>
      </div>
      <p className="mt-6">
        Ayrıca aşağıdaki sosyal medya hesaplarımız üzerinden de bizimle iletişime geçebilirsiniz.
      </p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Instagram: @netpazar</li>
        <li>Twitter: @netpazar</li>
        <li>Facebook: /netpazar</li>
      </ul>
    </div>
  );
};

export default Contact;
