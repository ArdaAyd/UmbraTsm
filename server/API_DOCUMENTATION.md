# **Umbra Görev Yönetim Sistemi - API Dokümantasyonu**

**Sürüm:** 1.0.0
**Ana Dizin:** `/api`

---

## **Kimlik Doğrulama ve Yetkilendirme**

Kimlik doğrulama, JSON Web Token (JWT) aracılığıyla gerçekleştirilir. Korunan tüm rotalar için `Authorization` başlığında bir JWT gönderilmelidir.

- **Format:** `Authorization: Bearer <your_jwt_token>`
- **Kullanıcı Rolleri:**
  - `User`: Kendi görevlerine ve profiline erişimi olan standart kullanıcı.
  - `Admin`: Sistemdeki tüm kullanıcılara ve görevlere tam erişime sahiptir.

---

## **Kullanıcı API Uç Noktaları**

**Ana Dizin:** `/api/user`

### `POST /register`
- **Açıklama:** Yeni bir kullanıcı kaydeder ve bir doğrulama e-postası gönderir.
- **Yetki:** Yok
- **Gövde:**
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123",
    "title": "Yazılım Mühendisi"
  }
  ```
- **Başarılı Yanıt (201 Oluşturuldu):**
  ```json
  {
    "success": true,
    "message": "Kullanıcı başarıyla kaydedildi, kaydınızı tamamlamak için lütfen e-postanızı kontrol edin."
  }
  ```

### `POST /login`
- **Açıklama:** Bir kullanıcıyı oturum açar ve bir JWT token'ı döndürür.
- **Yetki:** Yok
- **Gövde:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }
  ```
- **Başarılı Yanıt (200 OK):**
  ```json
  {
    "success": true,
    "message": "Giriş başarılı.",
    "token": "<jwt_access_token>",
    "user": {
      "_id": "<user_id>",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "isAdmin": false
    }
  }
  ```

### `GET /verify-email/:token`
- **Açıklama:** Kullanıcının e-posta adresini, kendisine gönderilen token ile doğrular.
- **Yetki:** Yok
- **URL Parametreleri:**
  - `token` (string, gerekli): E-posta bağlantısından gelen doğrulama token'ı.
- **Başarılı Yanıt (200 OK):**
  - İstemcideki giriş sayfasına bir başarı mesajıyla yönlendirir.

### `POST /logout`
- **Açıklama:** Kullanıcının oturumunu kapatır. Ana eylem istemci tarafındadır (token'ı temizlemek), ancak bu uç nokta gerekirse sunucu tarafı günlük kaydı için kullanılabilir.
- **Yetki:** `User`
- **Başarılı Yanıt (200 OK):**
  ```json
  {
    "message": "Başarıyla çıkış yapıldı"
  }
  ```

### `POST /verify-code`
- **Açıklama:** Kullanıcının e-postasına gönderilen altı haneli bir kodu doğrular (ör. şifre sıfırlama veya iki faktörlü kimlik doğrulama için).
- **Yetki:** Yok
- **Gövde:**
  ```json
  {
    "email": "john.doe@example.com",
    "code": "123456"
  }
  ```
- **Başarılı Yanıt (200 OK):**
  ```json
  {
    "success": true,
    "message": "Kod başarıyla doğrulandı."
  }
  ```

### `GET /get-team`
- **Açıklama:** Tüm ekip üyelerinin bir listesini alır.
- **Yetki:** `Admin`
- **Sorgu Parametreleri:**
  - `search` (string, isteğe bağlı): Kullanıcıları ada veya e-postaya göre filtreleyin.
- **Başarılı Yanıt (200 OK):**
  ```json
  {
    "success": true,
    "users": [
      {
        "_id": "<user_id>",
        "name": "Jane Smith",
        "title": "Proje Yöneticisi",
        "email": "jane.smith@example.com",
        "isActive": true
      }
    ]
  }
  ```

### `GET /notifications`
- **Açıklama:** Giriş yapmış kullanıcı için tüm okunmamış bildirimleri alır.
- **Yetki:** `User`
- **Başarılı Yanıt (200 OK):**
  ```json
  {
    "success": true,
    "notifications": [
      {
        "text": "'Üretim Ortamına Dağıt' adlı yeni görev size atandı.",
        "task": "<task_id>",
        "createdAt": "..."
      }
    ]
  }
  ```

### `PUT /profile`
- **Açıklama:** Giriş yapmış kullanıcının profil bilgilerini günceller.
- **Yetki:** `User`
- **Gövde:**
  ```json
  {
    "name": "Johnathan Doe",
    "title": "Kıdemli Yazılım Mühendisi",
    "avatarUrl": "https://example.com/new_avatar.png"
  }
  ```
- **Başarılı Yanıt (200 OK):**
  ```json
  {
    "success": true,
    "message": "Kullanıcı profili başarıyla güncellendi."
  }
  ```

### `PUT /read-noti`
- **Açıklama:** Giriş yapmış kullanıcı için tüm okunmamış bildirimleri okundu olarak işaretler.
- **Yetki:** `User`
- **Başarılı Yanıt (200 OK):**
  ```json
  {
    "success": true,
    "message": "Bildirimler okundu olarak işaretlendi."
  }
  ```

### `PUT /change-password`
- **Açıklama:** Giriş yapmış kullanıcının şifresini değiştirir.
- **Yetki:** `User`
- **Gövde:**
  ```json
  {
    "oldPassword": "securePassword123",
    "newPassword": "evenMoreSecurePassword456"
  }
  ```
- **Başarılı Yanıt (200 OK):**
  ```json
  {
    "success": true,
    "message": "Şifre başarıyla değiştirildi."
  }
  ```

### `PUT /:id`
- **Açıklama:** Bir kullanıcının profilini etkinleştirir veya devre dışı bırakır.
- **Yetki:** `Admin`
- **URL Parametreleri:**
  - `id` (string, gerekli): Güncellenecek kullanıcının ID'si.
- **Gövde:**
  ```json
  {
    "isActive": false
  }
  ```
- **Başarılı Yanıt (200 OK):**
  ```json
  {
    "success": true,
    "message": "Kullanıcı durumu başarıyla güncellendi."
  }
  ```

### `DELETE /:id`
- **Açıklama:** Bir kullanıcı profilini sistemden siler.
- **Yetki:** `Admin`
- **URL Parametreleri:**
  - `id` (string, gerekli): Silinecek kullanıcının ID'si.
- **Başarılı Yanıt (200 OK):**
  ```json
  {
    "success": true,
    "message": "Kullanıcı başarıyla silindi."
  }
  ```

---

## **Görev API Uç Noktaları**

**Ana Dizin:** `/api/task`

### `POST /create`
- **Açıklama:** Yeni bir görev oluşturur.
- **Yetki:** `Admin`
- **Gövde:**
  ```json
  {
    "title": "Yeni Ana Sayfa Tasarla",
    "team": ["<user_id_1>", "<user_id_2>"],
    "stage": "todo",
    "date": "2024-12-31T00:00:00.000Z",
    "priority": "HIGH",
    "assets": ["http://example.com/asset1.jpg"]
  }
  ```
- **Başarılı Yanıt (201 Oluşturuldu):**
  ```json
  {
    "success": true,
    "message": "Görev başarıyla oluşturuldu.",
    "task": { "_id": "<new_task_id>", ... }
  }
  ```

### `GET /`
- **Açıklama:** Tüm görevleri listeler. Sorgu parametreleri ile filtrelenebilir. Yöneticiler tüm görevleri görür; kullanıcılar kendilerine atanan görevleri görür.
- **Yetki:** `User`
- **Sorgu Parametreleri:**
  - `stage` (string, isteğe bağlı): "todo", "in progress", veya "completed".
  - `priority` (string, isteğe bağlı): "HIGH", "MEDIUM", "NORMAL", "LOW".
  - `search` (string, isteğe bağlı): Görev başlıkları için arama terimi.
- **Başarılı Yanıt (200 OK):**
  ```json
  {
    "success": true,
    "tasks": [
      {
        "_id": "<task_id>",
        "title": "Yeni Ana Sayfa Tasarla",
        "stage": "todo",
        "priority": "HIGH",
        ...
      }
    ]
  }
  ```

### `GET /:id`
- **Açıklama:** Tek bir görevin ayrıntılarını alır.
- **Yetki:** `User`
- **URL Parametreleri:**
  - `id` (string, gerekli): Görevin ID'si.
- **Başarılı Yanıt (200 OK):**
  ```json
  {
    "success": true,
    "task": {
      "_id": "<task_id>",
      "title": "Yeni Ana Sayfa Tasarla",
      ...
    }
  }
  ```

### `PUT /update/:id`
- **Açıklama:** Mevcut bir görevin ayrıntılarını günceller.
- **Yetki:** `Admin`
- **URL Parametreleri:**
  - `id` (string, gerekli): Güncellenecek görevin ID'si.
- **Gövde:**
  ```json
  {
    "title": "Güncellenmiş Görev Başlığı",
    "priority": "MEDIUM"
  }
  ```
- **Başarılı Yanıt (200 OK):**
  ```json
  {
    "success": true,
    "message": "Görev başarıyla güncellendi."
  }
  ```

### `PUT /:id`
- **Açıklama:** Bir görevi çöp kutusuna taşır (geçici silme).
- **Yetki:** `Admin`
- **URL Parametreleri:**
  - `id` (string, gerekli): Çöp kutusuna taşınacak görevin ID'si.
- **Başarılı Yanıt (200 OK):**
  ```json
  {
    "success": true,
    "message": "Görev başarıyla çöp kutusuna taşındı."
  }
  ```

### `DELETE /delete-restore/:id`
- **Açıklama:** Bir görevi kalıcı olarak siler veya çöp kutusundan geri yükler.
- **Yetki:** `Admin`
- **URL Parametreleri:**
  - `id` (string, gerekli): Görevin ID'si.
- **Sorgu Parametreleri:**
  - `action` (string, isteğe bağlı): Çöp kutusuna taşınmış bir görevi geri yüklemek için "restore" olarak ayarlayın. Sağlanmazsa, görev kalıcı olarak silinir.
- **Başarılı Yanıt (200 OK):**
  ```json
  {
    "success": true,
    "message": "Görev başarıyla silindi/geri yüklendi."
  }
  ``` 