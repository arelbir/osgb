# TC Kimlik No ile Hasta Var mı? API Kullanım Dokümantasyonu

## Amaç
Frontend uygulamasında, kullanıcı bir TC kimlik numarası girdiğinde sistemde bu TC ile kayıtlı hasta olup olmadığını **anında** öğrenmek için kullanılır. Eğer yoksa yeni kayıt açılır; varsa uyarı gösterilir.

---

## 1. Kullanılacak Endpoint

```
GET /api/patients/exists?tc_identity_number=TCNO
```
Örnek:
```
GET /api/patients/exists?tc_identity_number=12345678901
```

**Cevap:**
```json
{ "exists": true } // veya false
```

---

## 2. Kullanım Senaryosu
- Hasta kayıt ekranında kullanıcı TC kimlik numarasını yazınca (veya yazmayı bitirdiğinde):
  - Bu endpoint'e GET isteği gönderilir.
  - Sonuç `{"exists": true}` ise, sistemde bu TC ile hasta zaten kayıtlıdır. Kullanıcıya uyarı göster.
  - Sonuç `{"exists": false}` ise, yeni hasta kaydı başlatılabilir.

---

## 3. Teknik Detaylar & İpuçları
- **Debounce** kullanılması önerilir (her tuş vuruşunda değil, kullanıcı yazmayı bitirdiğinde istek atmak için, örn. 300 ms bekleme).
- **Boş veya eksik TC** için istek atılmamalı.
- Gerekirse, hata durumları için kullanıcıya uygun mesaj gösterilmeli (ör. ağ hatası, eksik parametre vs).
- **Swagger/OpenAPI dokümantasyonu** üzerinden endpointi test edebilirsiniz: `/api/docs` adresinde “Patients” altında bulabilirsiniz.

---

## 4. Örnek (Javascript/Fetch ile)
```js
async function checkPatientExists(tc) {
  if (!tc) return false;
  const res = await fetch(`/api/patients/exists?tc_identity_number=${tc}`);
  if (!res.ok) throw new Error('Network error');
  const data = await res.json();
  return data.exists;
}
```

---

## 5. Ekstra Notlar
- Bu endpoint sadece “var/yok” kontrolü yapar, herhangi bir kişisel veri döndürmez. Güvenlidir.
- Eğer ileride “hızlı hasta arama/autocomplete” gibi bir özellik istenirse, benzer şekilde index ve endpoint ile genişletilebilir.

---

**Kısa özet:**
Frontend geliştiricisi, hasta kayıt formunda TC kimlik numarası girildiğinde yukarıdaki endpointi çağırmalı ve dönen boolean sonuca göre kullanıcıyı yönlendirmelidir.
