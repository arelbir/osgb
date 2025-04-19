# Frontend ve Backend Bağlantısı için Yapılandırma

## .env.local Dosyası
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Bağlantı Ayarları
API bağlantısı için `src/lib/api.ts` dosyasında axios kullanılarak bir istemci oluşturuldu. Bu istemci, kimlik doğrulama token'ını otomatik olarak isteklere ekliyor.

## Kimlik Doğrulama Entegrasyonu
Kimlik doğrulama için Zustand store kullanılıyor. Kullanıcı girişi yapıldığında token ve kullanıcı bilgileri saklanıyor.

## Veri Alışverişi
Tüm API çağrıları ilgili servis fonksiyonları aracılığıyla yapılıyor:
- authApi: Kimlik doğrulama işlemleri
- patientApi: Hasta yönetimi
- companyApi: Firma yönetimi
- protocolApi: Protokol yönetimi
- labResultApi: Laboratuvar sonuçları
- paymentApi: Ödeme işlemleri

## Hata Yönetimi
Tüm API çağrılarında try-catch blokları kullanılarak hata yönetimi yapılıyor. Hatalar sonner toast bileşeni ile kullanıcıya gösteriliyor.

## Bağlantı Testi
Backend ve frontend arasındaki bağlantıyı test etmek için aşağıdaki adımlar izlenmelidir:

1. Backend sunucusunu başlat:
```
cd osgb-clone/backend
npm run dev
```

2. Frontend uygulamasını başlat:
```
cd osgb-clone/frontend
npm run dev
```

3. Tarayıcıda http://localhost:3000 adresine git
4. Giriş sayfasında kullanıcı adı ve şifre ile giriş yap
5. Dashboard ve diğer sayfaları test et

## Notlar
- Backend API'si http://localhost:5000/api adresinde çalışıyor olmalıdır
- Frontend uygulaması http://localhost:3000 adresinde çalışıyor olmalıdır
- Kimlik doğrulama için JWT token kullanılıyor
- API isteklerinde CORS yapılandırması backend tarafında yapılmıştır
