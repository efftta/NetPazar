# NetPazar

NetPazar, Django ve React kullanılarak geliştirilmiş modern bir e-ticaret platformudur. Kullanıcılar ürünleri inceleyebilir, sepete ekleyip satın alabilir; satıcılar ise ürün ve siparişleri yönetebilir.

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

## Admin Paneli
![Admin Panel](images/admin.jpg)

## Favoriler Sayfası
![Favoriler](images/favorites.jpg)

## Giriş Sayfası
![Giriş](images/login.jpg)

## Kayıt Sayfası
![Kayıt](images/register.jpg)

## Ürünler Sayfası
![Sepet](images/urunler.jpg)

## Beyaz Tema
![Beyaz Tema](images/white_screen.jpg)

## Ürün Detay Sayfası
![Ürün Detay](images/details.jpg)

## Ödeme Sayfası
![Ödeme](images/payment.jpg)

## Kargo Takip Sayfası
![Kargo](images/shipping.jpg)


## 🔧 Kurulum

### Backend:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

### Frontend:
cd frontend
npm install
npm run dev

Geliştirici
efftta