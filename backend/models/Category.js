const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" }, // Açıklama opsiyonel ve boş olabilir
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Category", categorySchema);