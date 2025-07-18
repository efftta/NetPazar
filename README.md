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

### 🛍️ Product List
![Products](images/urunler.jpg)

### 🧊 White Screen (Placeholder)
![White Screen](images/white_screen.jpg)

### ❤️ Favorites
![Favorites](images/favorites.jpg)

### 💬 Product and Comments
![Product and Comments](images/product_and_comments.jpg)

### 💳 Payment Page
![Payment](images/payment.jpg)

### 📦 Shipping/Tracking
![Shipping](images/shipping.jpg)

### 🔐 Login
![Login](images/login.jpg)

### 📝 Register
![Register](images/register.jpg)

### 🛠️ Admin Panel
![Admin](images/admin.jpg)


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
efftta