import React from "react";
import { motion } from "framer-motion";

const fakeTracking = {
  trackingId: "KPZ456789123",
  status: "Dağıtımda",
  updates: [
    { date: "2025-05-05", location: "İzmir Transfer Merkezi", status: "Çıkış yaptı" },
    { date: "2025-05-04", location: "Ankara Transfer Merkezi", status: "Ulaştı" },
    { date: "2025-05-03", location: "İstanbul", status: "Kargoya verildi" },
  ],
};

const CargoTracking = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <motion.h1
        className="text-3xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Kargo Takip
      </motion.h1>

      <motion.div
        className="bg-gray-800 p-6 rounded-xl shadow-md max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="mb-2 text-gray-300">Takip Numarası:</p>
        <p className="font-semibold text-lg mb-4">{fakeTracking.trackingId}</p>

        <p className="mb-2 text-gray-300">Şu Anki Durum:</p>
        <p className="text-green-400 font-semibold mb-6">{fakeTracking.status}</p>

        <div className="space-y-4">
          {fakeTracking.updates.map((update, index) => (
            <motion.div
              key={index}
              className="border-l-4 border-blue-500 pl-4 py-2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <p className="text-sm text-gray-400">
                {update.date} - {update.location}
              </p>
              <p className="text-white font-medium">{update.status}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CargoTracking;
