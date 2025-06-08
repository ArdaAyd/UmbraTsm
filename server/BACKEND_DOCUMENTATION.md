# **Umbra: Task Management System - Back-End Proje Dokümantasyonu**

**Tarih:** 04.06.2024

### **1. Projeye Genel Bakış**

Bu proje, kayıtlı kullanıcıların görevlerini yönetmek için oluşturulmuş RESTful bir arka uç hizmetidir. API, kimlik doğrulama, yetkilendirme, görevler için CRUD (Oluşturma, Okuma, Güncelleme, Silme) işlemleri ve bildirim özelliklerini desteklemektedir. Sistem, bir yönetici paneli ve son kullanıcılar için bir görev yönetimi uygulaması tarafından kullanılmak üzere tasarlanmıştır.

*   **Hedef Kitle:** Dahili admin paneli, görev yönetimi uygulaması (client), potansiyel 3. parti entegratörler.
*   **API Stili:** REST
*   **Versiyon:** v1.0.0
*   **Sürüm Sorumluları:**
    *   Arda Aydın
    *   Hüseyin Atay
    *   Meriç Şenduran
*   **Sürüm Döngüsü:** Aylık büyük güncellemeler, haftalık küçük hata düzeltmeleri.
*   **Kapsam:** Kullanıcı kaydı ve yönetimi, görev oluşturma ve yönetimi, görev takibi, takım iş birliği özellikleri (göreve kullanıcı atama, yorum ekleme).
*   **Kapsam Dışı:** Frontend arayüz yönetimi, ödeme sistemleri, gelişmiş raporlama.

### **2. Teknoloji Yığını**

*   **Programlama Dili:** JavaScript (ES6+)
*   **Web Çatısı (Framework):** Node.js v18.17.1 + Express.js v4.18.2
*   **Veritabanı:** MongoDB (MongoDB Atlas bulut servisi üzerinden)
*   **Veritabanı Yönetim Kütüphanesi:** Mongoose v7.0.0
*   **Kimlik Doğrulama (Authentication):** JSON Web Tokens (JWT) ile e-posta/şifre akışı. Şifreler `bcryptjs` ile hashlenmektedir.
*   **E-posta Servisi:** Nodemailer (Şifre sıfırlama, bildirimler vb. için)
*   **Cache:** Mevcut sürümde kullanılmıyor.
*   **Message Queue:** Mevcut sürümde kullanılmıyor.
*   **Deployment:** Henüz planlanmadı. (Öneri: Heroku, AWS Elastic Beanstalk, DigitalOcean)
*   **Monitoring & Log Aggregation:** Henüz planlanmadı. (Öneri: Prometheus + Grafana)
*   **HTTP İstek Loglama:** Morgan

### **3. Kurulum ve Geliştirme Ortamı**

**Ön Gereksinimler:**
*   Node.js (v18.x veya üstü)
*   NPM veya Yarn
*   Git
*   MongoDB Atlas hesabı ve veritabanı cluster'ı

**Yerel Kurulum Adımları:**
1.  Projeyi klonlayın:
    ```bash
    git clone <proje_repo_url>
    ```
2.  Server dizinine gidin:
    ```bash
    cd Umbra_TMS/server
    ```
3.  Gerekli NPM paketlerini yükleyin:
    ```bash
    npm install
    ```
4.  `.env` dosyasını oluşturun ve `README.md` dosyasında belirtilen ortam değişkenlerini kendi bilgilerinizle doldurun:
    ```
    MONGODB_URI = "sizin_mongodb_url_adresiniz"
    JWT_SECRET = "çok_gizli_bir_anahtar"
    PORT = 8800
    NODE_ENV = "development"
    # Nodemailer için ek değişkenler gerekebilir
    EMAIL_HOST = "smtp.example.com"
    EMAIL_USER = "user@example.com"
    EMAIL_PASS = "password"
    ```
5.  Geliştirme sunucusunu başlatın:
    ```bash
    npm start
    ```
6.  Her şey doğru yapılandırıldıysa, konsolda `Server running on port 8800` ve `Database Connected` mesajlarını görmelisiniz.

### **4. Klasör Yapısı**

Proje, sorumlulukların ayrılması prensibine dayalı modüler bir MVC (Model-View-Controller) benzeri yapı kullanır.

```
server/
|--- controllers/   # API endpoint'lerinin ana iş mantığını içerir (örn: createTask, getAllUsers).
|--- middleware/    # İstek-cevap döngüsü arasında çalışan ara yazılımlar (örn: kimlik doğrulama, hata yakalama).
|--- models/        # MongoDB şemalarını ve veri modellerini (User, Task) tanımlar.
|--- routes/        # API yollarını (endpoints) tanımlar ve ilgili controller fonksiyonlarına yönlendirir.
|--- utils/         # Yardımcı ve tekrar kullanılabilir fonksiyonları barındırır (örn: JWT oluşturma, e-posta gönderme).
|--- index.js       # Uygulamanın ana giriş noktası. Express sunucusunu başlatır ve ana yönlendirmeleri yapar.
|--- package.json   # Proje bağımlılıklarını ve script'lerini yönetir.
|--- .env           # Ortam değişkenlerini içerir (versiyon kontrolüne dahil edilmez).
```

### **6. Veritabanı Şeması**

*   **Collections (Tablolar):** `users`, `tasks`
*   **İlişkiler (Referanslar):**
    *   `tasks.team`: `users` koleksiyonundaki `_id` alanlarına bir dizi referans içerir.
    *   `tasks.createdBy`: `users` koleksiyonundaki bir `_id` alanına referans içerir.
    *   `tasks.activities.by`: `users` koleksiyonundaki bir `_id` alanına referans içerir.
*   **İndeksler:**
    *   `users.email`: Benzersiz (unique) bir indeks uygulanmıştır, hızlı kullanıcı sorguları ve e-posta tekrarını önlemek için.
    *   `tasks.title`: Metin tabanlı arama performansını artırmak için indekslenebilir.
*   **Veritabanı Geçişleri (Migrations):** Mongoose şema yönetimi uygulama seviyesinde yapıldığı için ayrı bir migration aracı (Alembic gibi) kullanılmamaktadır. Şema değişiklikleri doğrudan `models/` klasöründeki dosyalarda yönetilir.

### **7. Ortam Değişkenleri (Environment Variables)**

Projenin çalışması için `server` klasöründe bir `.env` dosyası bulunmalı ve aşağıdaki değişkenleri içermelidir:

*   **`MONGODB_URI`**: MongoDB Atlas bağlantı adresiniz.
*   **`JWT_SECRET`**: JWT token'larını imzalamak için kullanılacak gizli anahtar.
*   **`PORT`**: Sunucunun çalışacağı port numarası (örn: 8800).
*   **`NODE_ENV`**: Uygulama ortamı (`development` veya `production`).
*   **`EMAIL_HOST`**, **`EMAIL_USER`**, **`EMAIL_PASS`**: Nodemailer'ın e-posta göndermek için kullanacağı SMTP sunucu bilgileri. 