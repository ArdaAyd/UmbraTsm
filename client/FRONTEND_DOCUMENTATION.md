# **Umbra: Task Management System - Front-End Proje Dokümantasyonu**

### **1. Projeye Genel Bakış**

Bu doküman, Umbra Task Management System'in client (istemci) tarafı uygulamasının teknik detaylarını, mimarisini ve geliştirme süreçlerini açıklamaktadır. Uygulama, kullanıcılara görevlerini yönetebilecekleri, takım arkadaşlarıyla iş birliği yapabilecekleri ve proje ilerlemesini takip edebilecekleri zengin ve reaktif bir arayüz sunmak amacıyla geliştirilmiştir. Backend servisiyle REST API üzerinden haberleşir.

*   **Uygulama Türü:** Tek Sayfa Uygulaması (Single Page Application - SPA)
*   **Ana Özellikler:**
    *   Kullanıcı kimlik doğrulama (Giriş, Kayıt).
    *   Rol tabanlı arayüz (Admin, Standart Kullanıcı).
    *   Görev ve alt görev oluşturma, güncelleme, silme (CRUD).
    *   Sürükle-bırak (Drag-and-Drop) destekli Kanban panosu.
    *   Görev filtreleme ve arama.
    *   Kullanıcı profili yönetimi.
    *   Gerçek zamanlı bildirimler.
    *   Responsive (Duyarlı) tasarım.

### **2. Teknoloji Yığını**

*   **JavaScript Kütüphanesi:** React v18.2.0
*   **Geliştirme Ortamı ve Build Aracı:** Vite
*   **UI Kütüphanesi:**
    *   **Headless UI:** Erişilebilirlik ve özelleştirilebilirlik odaklı, stile sahip olmayan UI bileşenleri (Modal, Dropdown vb.).
    *   **React-Toastify:** Bildirim (toast) mesajları için.
    *   **React-Chartjs-2:** Dashboard metriklerini görselleştirmek için grafikler.
*   **Styling (Stil Yönetimi):**
    *   **Tailwind CSS:** Utility-first CSS framework'ü ile hızlı ve tutarlı UI geliştirme.
    *   **PostCSS:** CSS dönüşümleri için.
*   **State Management (Durum Yönetimi):**
    *   **Redux Toolkit:** Merkezi ve öngörülebilir state yönetimi için standartlaştırılmış, etkili bir çözüm.
*   **Routing (Yönlendirme):**
    *   **React-router-dom:** İstemci tarafı yönlendirme ve korumalı (protected) yollar için.
*   **API İletişimi:**
    *   **Axios:** HTTP isteklerini yönetmek için (Redux Toolkit'in `createAsyncThunk`'ı ile entegre).
*   **Form Yönetimi:**
    *   **React Hook Form:** Performanslı, esnek ve kolay form yönetimi ve validasyonu için.

### **3. Kurulum ve Geliştirme Ortamı**

**Ön Gereksinimler:**
*   Node.js (v18.x veya üstü)
*   NPM veya Yarn
*   Çalışan bir backend servisi

**Yerel Kurulum Adımları:**
1.  Projeyi klonladıktan sonra `client` dizinine gidin:
    ```bash
    cd Umbra_TMS/client
    ```
2.  Gerekli NPM paketlerini yükleyin:
    ```bash
    npm install
    ```
3.  Projenin ana dizininde `.env` dosyasını oluşturun ve backend sunucusunun adresini belirtin:
    ```
    VITE_APP_BASE_URL = "http://localhost:8800/api"
    ```
    *Not: Port numarası, backend sunucunuzun çalıştığı porta göre değiştirilmelidir.*
4.  Geliştirme sunucusunu başlatın:
    ```bash
    npm run dev
    ```
5.  Uygulamayı tarayıcıda görüntülemek için `http://localhost:5173` (veya Vite'nin belirttiği başka bir port) adresini ziyaret edin.

### **4. Klasör Yapısı**

Proje, sorumlulukların net bir şekilde ayrıldığı, bakımı ve genişletilmesi kolay, modüler bir klasör yapısını benimser.

```
client/src/
|
|--- assets/            # Statik varlıklar (resimler, ikonlar, SVG'ler).
|
|--- components/        # Tekrar kullanılabilir UI bileşenleri.
|   |--- **Button.jsx**     # Genel buton bileşeni.
|   |--- **Modal.jsx**      # Modal pencere bileşeni.
|   |--- **TaskCard.jsx**   # Kanban panosundaki görev kartı.
|   |--- ...              # Diğer küçük ve atomik bileşenler.
|
|--- pages/             # Uygulamanın ana sayfaları (route'lara karşılık gelir).
|   |--- **Login.jsx**      # Kullanıcı giriş sayfası.
|   |--- **Dashboard.jsx**  # Ana kontrol paneli sayfası.
|   |--- **Tasks.jsx**      # Görevlerin listelendiği sayfa.
|   |--- **Trash.jsx**      # Silinmiş görevlerin bulunduğu sayfa.
|   |--- ...              # Diğer sayfalar.
|
|--- redux/             # Redux Toolkit ile ilgili tüm dosyalar.
|   |--- **store.js**       # Redux store'un konfigürasyonu.
|   |--- **slices/**        # Her bir state dilimi için slice'lar.
|       |--- **api.js**       # API isteklerini yöneten ana API slice'ı.
|       |--- **authSlice.js** # Kullanıcı ve kimlik doğrulama state'i.
|       |--- **taskSlice.js** # Görevlerle ilgili state.
|
|--- utils/             # Yardımcı fonksiyonlar ve sabitler.
|   |--- **index.js**       # Proje genelinde kullanılan sabitler (renkler, tarihler vb.).
|   |--- **firebase.js**    # Firebase konfigürasyonu (eğer dosya yükleme için kullanılıyorsa).
|
|--- App.jsx            # Ana uygulama bileşeni, routing (yönlendirme) mantığını içerir.
|
|--- main.jsx           # Uygulamanın giriş noktası, React DOM'a render edilir.
|
|--- index.css          # Genel ve temel CSS stilleri (Tailwind importları dahil).
```

### **5. State (Durum) Yönetimi**

Uygulama genelindeki state yönetimi **Redux Toolkit** ile sağlanır. Bu yaklaşım, state'in merkezi, öngörülebilir ve yönetimi kolay olmasını sağlar.

*   **Store:** `redux/store.js` içinde yapılandırılmıştır. Tüm state "slice"ları burada birleştirilir.
*   **Slices:** Her bir veri alanı (auth, tasks) için ayrı "slice"lar oluşturulmuştur.
    *   `authSlice`: Kullanıcının giriş durumu, token'ı ve profil bilgileri gibi kimlik doğrulama verilerini yönetir.
    *   `taskSlice`: Görev listesi, aktif görev, filtreler gibi görevle ilgili state'leri yönetir.
*   **Async Thunks:** Backend API ile asenkron iletişim (`createAsyncThunk` kullanılarak) bu slice'lar içinde yönetilir. Bu, API isteklerinin (bekleme, başarılı, hatalı) durumlarını otomatik olarak ele almayı kolaylaştırır.

### **6. Bileşen (Component) Mimarisi**

Bileşenler, `pages` ve `components` klasörleri altında iki ana kategoriye ayrılmıştır:

1.  **Container/Page Components (`pages/`):**
    *   Her biri bir route'a karşılık gelir.
    *   Genellikle state'e erişirler (Redux'tan veri çekerler) ve iş mantığını içerirler.
    *   `Dashboard.jsx`, `Tasks.jsx` gibi bileşenler bu kategoriye girer.

2.  **Presentational/Reusable Components (`components/`):**
    *   Tekrar kullanılabilir, genellikle state bilgisi olmayan UI parçalarıdır.
    *   Görünümleri ve davranışları `props` aracılığıyla kontrol edilir.
    *   `Button.jsx`, `Modal.jsx`, `Input.jsx` gibi bileşenler bu kategoriye girer. Bu yaklaşım, tutarlı bir UI ve yüksek kod tekrar kullanılabilirliği sağlar.

### **7. Yönlendirme (Routing)**

*   **React-router-dom** kütüphanesi ile istemci tarafı yönlendirme yapılır.
*   `App.jsx` dosyası, uygulamanın ana yönlendiricisini (router) içerir. Hangi URL yolunun hangi `page` bileşenini render edeceğini tanımlar.
*   **Protected Routes (Korumalı Yollar):** Kullanıcının oturum açıp açmadığını veya yetkisini (admin/user) kontrol eden özel bir yönlendirici bileşeni kullanılır. Eğer kullanıcı yetkili değilse, giriş sayfasına yönlendirilir. Bu, uygulamanın güvenliğini sağlar.

### **8. API İletişimi**

*   Backend ile tüm iletişim, `redux/slices/api.js` dosyasında tanımlanan ve `axios` kullanan bir ana API katmanı üzerinden gerçekleştirilir.
*   API istekleri, Redux Toolkit'in `createAsyncThunk` özelliği ile yönetilir. Bu, isteklerin yaşam döngüsünü (pending, fulfilled, rejected) kolayca yönetmeyi ve state'i buna göre güncellemeyi sağlar.
*   Kullanıcı token'ı gibi bilgiler, `axios` interceptor'ları kullanılarak her yetkili isteğe otomatik olarak eklenir.

### **9. Kimlik Doğrulama Akışı**

1.  Kullanıcı `Login` sayfasında form bilgilerini girer.
2.  `authSlice` içindeki `loginUser` async thunk'ı tetiklenir ve backend'in `/user/login` endpoint'ine istek gönderilir.
3.  Başarılı cevap alındığında, dönen JWT token ve kullanıcı bilgileri Redux state'ine ve `localStorage`'a kaydedilir.
4.  Uygulama, kullanıcıyı ana `Dashboard` sayfasına yönlendirir.
5.  Sonraki tüm yetkili API isteklerinde, `localStorage`'dan alınan token `Authorization` başlığına eklenir.
6.  `Logout` işlemi, token'ı state'den ve `localStorage`'dan siler ve kullanıcıyı tekrar `Login` sayfasına yönlendirir.

### **10. Stil ve Tasarım**

*   **Tailwind CSS:** Projenin stil altyapısını oluşturur. Bileşenler doğrudan JSX içinde utility class'ları kullanarak stillendirilir. Bu, stil dosyaları arasında geçiş yapma ihtiyacını azaltır ve hızlı prototipleme sağlar.
*   **`tailwind.config.js`:** Projeye özgü renkler, fontlar ve diğer tasarım token'ları burada merkezi olarak tanımlanır.
*   **`index.css`:** Tailwind'in temel katmanlarını ve projeye özel genel (global) stilleri içerir.
*   **Responsive Tasarım:** Tailwind'in `sm:`, `md:`, `lg:` gibi breakpoint prefix'leri kullanılarak tüm cihazlarda tutarlı bir kullanıcı deneyimi hedeflenmiştir. 