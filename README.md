# NetPazar

NetPazar, Django ve React kullanılarak geliştirilmiş modern bir e-ticaret platformudur. Kullanıcıların ürünleri görüntüleyip satın alabildiği, satıcıların ise ürün ve sipariş yönetimi yapabildiği bir sistem sunar.

## 🚀 Özellikler

- Ürün listeleme ve detay sayfası
- Kullanıcı kayıt ve giriş sistemi
- Sepet ve sipariş işlemleri
- Admin paneliyle ürün, kategori ve sipariş yönetimi
- Sipariş durumu takibi (Beklemede → Kargoya verildi → Teslim edildi)
- Adres ve kayıtlı kart yönetimi
- Favoriler, yorumlar, kategori filtreleme
- Responsive tasarım

## 🛠️ Kullanılan Teknolojiler

**Frontend:** React, Redux Toolkit, Tailwind CSS  
**Backend:** Django, Django REST Framework, PostgreSQL

## 📷 Ekran Görüntüleri

### 🛍️ Ürün Listesi
![Ürünler](images/Ürünler.JPG)

### 🔲 Beyaz Ekran
![Beyaz Ekran](images/Beyaz_ekran.JPG)

### ❤️ Favoriler
![Favoriler](images/Favoriler.JPG)

### 📄 Ürün Sayfası ve Yorumlar
![Ürün ve Yorumlar](images/Ürün_sayfası_ve_yorumlar.JPG)

### 💳 Ödeme Ekranı
![Ödeme](images/Ödeme_ekranı.JPG)

### 📦 Kargo Takibi
![Kargo Takibi](images/Kargo_ekranı.JPG)

### 🔐 Giriş Ekranı
![Giriş](images/Giriş_ekranı.JPG)

### 📝 Kayıt Ekranı
![Kayıt](images/Kayıt_ekranı.JPG)

### 🛠️ Admin Paneli
![Admin Paneli](images/Admin_ekranı.JPG)


## 🔧 Kurulum

### Backend:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend:
cd frontend
npm install
npm run dev

Geliştirici
Efe Taha Koçaş