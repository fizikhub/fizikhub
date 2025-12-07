# Veritabanı Kurulum Talimatları

## Adım 1: SQL Script'i Çalıştır

1. Supabase Dashboard'a git: https://supabase.com/dashboard
2. Projenizi seçin (fizikhub)
3. Sol menüden **SQL Editor** seçeneğine tıklayın
4. "New query" butonuna tıklayın
5. `supabase/migrations/messaging_setup.sql` dosyasının içeriğini kopyalayıp yapıştırın
6. **RUN** butonuna tıklayın

## Adım 2: Kontrol Et

Aşağıdaki tabloların oluşturulduğunu kontrol et:
- `conversations`
- `conversation_participants`  
- `messages`

Bunu **Table Editor** bölümünden görebilirsin.

## Yapılan İşlemler

✅ 3 tablo oluşturuldu
✅ İndeksler eklendi (performans için)
✅ RLS (Row Level Security) kuralları eklendi
✅ `create_conversation()` fonksiyonu eklendi
✅ Otomatik timestamp güncelleme trigger'ı eklendi

## Notlar

- SQL script'i birden fazla kez çalıştırabilirsin (tekrar hata vermez)
- Eski tablolarla çakışma varsa, önce eski tabloları silmen gerekebilir
- RLS kuralları sayesinde kullanıcılar sadece kendi mesajlarını görebilir
