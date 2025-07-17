import React, { useState } from "react";
import { motion } from "framer-motion";
import AdminProductList from "../components/AdminProductList";
import AdminProductForm from "../components/AdminProductForm";

const AdminPanel = () => {
  const sections = [
    "Ürün Yönetimi",
    "Siparişler",
    "Kullanıcılar",
    "Yorumlar",
    "Kampanyalar",
  ];

  const [activeSection, setActiveSection] = useState("Ürün Yönetimi");
  const [activeProductTab, setActiveProductTab] = useState("Listele");

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <motion.h1
        className="text-3xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Yönetici Paneli
      </motion.h1>

      {/* Ana bölüm butonları */}
      <div className="flex justify-center mb-6 space-x-4">
        {sections.map((sec) => (
          <button
            key={sec}
            className={`px-4 py-2 rounded ${
              activeSection === sec
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setActiveSection(sec)}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* İçerik alanı */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {activeSection === "Ürün Yönetimi" ? (
          <div>
            {/* Ürün sekmeleri */}
            <div className="flex justify-center mb-4 space-x-3">
              {["Listele", "Yeni Ekle"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveProductTab(tab)}
                  className={`px-3 py-1 rounded ${
                    activeProductTab === tab
                      ? "bg-green-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Ürün içeriği */}
            <div className="bg-gray-800 p-4 rounded-lg shadow">
              {activeProductTab === "Listele" && <AdminProductList />}
              {activeProductTab === "Yeni Ekle" && <AdminProductForm />}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">
            {activeSection} bölümü henüz aktif değil.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default AdminPanel;
