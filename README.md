# Umbra Task Management System

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.17.1-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-blue?logo=mongodb)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-gray?logo=express)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-blue?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

**Umbra TMS**, modern web teknolojileri kullanılarak geliştirilmiş, takım içi görev yönetimi ve iş birliğini kolaylaştıran bulut tabanlı bir proje yönetimi uygulamasıdır. Kullanıcı dostu arayüzü ve güçlü yönetici yetenekleriyle, ekiplerin verimliliğini ve organizasyonunu en üst düzeye çıkarmayı hedefler.

##  **Temel Özellikler**

-   **Yönetici Paneli:**
    -   Kullanıcı Ekleme/Çıkarma ve Yönetimi
    -   Kullanıcıları Aktif/Pasif Etme
    -   Tüm Görevleri Görüntüleme ve Yönetme
-   **Kapsamlı Görev Yönetimi:**
    *   Görev Oluşturma, Güncelleme, Silme (CRUD)
    *   Sürükle-Bırak Destekli Kanban Panosu (`Yapılacak`, `Devam Ediyor`, `Tamamlandı`)
    *   Görevlere Öncelik Atama (`Yüksek`, `Orta`, `Düşük`)
    *   Alt Görevler Ekleme ve Takip Etme
-   **Takım İşbirliği:**
    *   Görevlere Kullanıcı Atama
    *   Görevler Üzerine Yorum Yapma ve Aktivite Takibi
-   **Kullanıcı Odaklı Arayüz:**
    *   Rol Bazlı Görünüm (Admin / Kullanıcı)
    *   Kullanıcı Profili ve Şifre Güncelleme
    *   Gerçek Zamanlı Bildirimler
-   **Dashboard:**
    *   Proje ve kullanıcı metriklerini gösteren interaktif grafikler.

---

## 💻 **Teknoloji Yığını**

Bu proje, **MERN Stack** üzerine kurulmuştur ve modern web geliştirme araçlarıyla zenginleştirilmiştir.

| Katman      | Teknoloji                                                                                              |
| :---------- | :----------------------------------------------------------------------------------------------------- |
| **Frontend**  | **React.js (Vite)**, **Redux Toolkit**, React Router, **Tailwind CSS**, Headless UI, Axios, Chart.js |
| **Backend**   | **Node.js**, **Express.js**, **MongoDB (Mongoose)**, JSON Web Tokens (JWT), Bcrypt.js, Nodemailer     |
| **Veritabanı**  | **MongoDB Atlas** (Bulut Tabanlı NoSQL Veritabanı)                                                    |
| **Geliştirme**| Git, Prettier, ESLint                                                                                  |

---

##  **Projeyi Başlatma**

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### **Ön Gereksinimler**

-   Node.js (v18.x veya üstü)
-   NPM veya Yarn
-   Git
-   MongoDB Atlas hesabı

### **Kurulum Adımları**

1.  **Projeyi Klonlayın**
    ```sh
    git clone <proje-github-linki>
    cd Umbra_TMS
    ```

2.  **Backend Kurulumu (`/server`)**
    ```sh
    cd server
    npm install
    ```
    -   `server` klasöründe `.env` adında bir dosya oluşturun ve aşağıdaki değişkenleri doldurun:
        ```env
        MONGODB_URI="YOUR_MONGODB_ATLAS_CONNECTION_STRING"
        JWT_SECRET="YOUR_SUPER_SECRET_JWT_KEY"
        PORT=8800
        NODE_ENV="development"
        # Opsiyonel: E-posta gönderme için Nodemailer SMTP bilgileri
        EMAIL_HOST="smtp.example.com"
        EMAIL_USER="user@example.com"
        EMAIL_PASS="password"
        ```

3.  **Frontend Kurulumu (`/client`)**
    ```sh
    cd ../client
    npm install
    ```
    -   `client` klasöründe `.env` adında bir dosya oluşturun:
        ```env
        VITE_APP_BASE_URL="http://localhost:8800/api"
        ```

4.  **Uygulamayı Çalıştırma**
    -   **Backend Sunucusunu Başlatın:** `server` klasöründeyken:
        ```sh
        npm start
        ```
    -   **Frontend Uygulamasını Başlatın:** Ayrı bir terminalde, `client` klasöründeyken:
        ```sh
        npm run dev
        ```

Uygulama artık `http://localhost:5173` (veya Vite'nin atadığı port) adresinde çalışıyor olacaktır. Backend API ise `http://localhost:8800` adresinde hizmet verecektir.

---

## 📁 **Klasör Yapısı**

Proje, sorumlulukların net bir şekilde ayrıldığı `client` ve `server` olmak üzere iki ana bölümden oluşur.

```
/
├── client/         # React Frontend Uygulaması
│   ├── src/
│   │   ├── components/ # Tekrar kullanılabilir UI bileşenleri
│   │   ├── pages/      # Ana sayfa bileşenleri
│   │   ├── redux/      # Redux state yönetimi
│   │   └── ...
│   └── package.json
│
└── server/         # Node.js/Express Backend API
    ├── controllers/  # API iş mantığı
    ├── middleware/   # Ara yazılımlar (örn: auth)
    ├── models/       # MongoDB şemaları
    ├── routes/       # API endpoint tanımları
    └── index.js      # Sunucu giriş noktası
```

Daha detaylı bilgi için `client/FRONTEND_DOCUMENTATION.md` ve `server/BACKEND_DOCUMENTATION.md` dosyalarını inceleyebilirsiniz.

---

##  **İletişim**

-   **Arda Aydın** - [aydinarda@ogr.iuc.edu.tr](mailto:aydinarda@ogr.iuc.edu.tr)
