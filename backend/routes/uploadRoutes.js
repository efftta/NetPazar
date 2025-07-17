const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware"); // Admin koruması

// Multer konfigürasyonu (resim nereye ve nasıl kaydedilecek)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Dosya tipi kontrolü (yalnızca resimler)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb("Sadece görsel dosyaları yüklenebilir (jpg, jpeg, png)");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// 🔐 Sadece admin görsel yükleyebilir
router.post("/", protect, admin, upload.single("image"), (req, res) => {
  res.send({ imagePath: `/uploads/${req.file.filename}` });
});

module.exports = router;
