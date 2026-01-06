# 🚀 Deployment & Setup Guide

Tài liệu này hướng dẫn cách thiết lập môi trường, cơ sở dữ liệu và triển khai ứng dụng Lì Xì 2025.

## 1. Environment Variables (.env)

Bạn cần tạo file `.env` trong cả hai thư mục `frontend` và `backend`.

### 📂 Backend (`/backend/.env`)
```env
PORT=3000
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
CORS_ORIGIN=http://localhost:3000   # URL của Frontend khi deploy
```
*Lưu ý: Để lấy `DATABASE_URL`, truy cập Supabase > Project Settings > Database.*

### 📂 Frontend (`/frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000  # URL của Backend khi deploy
```

---

## 2. Database Migration (Supabase)

Vì chúng ta sử dụng TypeORM với `synchronize: true` trong môi trường phát triển, schema sẽ tự động đồng bộ khi bạn kết nối tới database lần đầu.

**Các bước thực hiện:**
1. Tạo Project trên [Supabase](https://supabase.com).
2. Lấy Connection String.
3. Cập nhật `DATABASE_URL` trong `/backend/.env`.
4. Chạy Backend: `cd backend && npm run start`.
5. Bảng sẽ tự động được tạo trong Postgres của Supabase.

---

## 3. Deploy Guide

### 🧱 Backend (Render Free Tier)
1. Kết nối Repository với Render.
2. Chọn loại dịch vụ: **Web Service**.
3. Cấu hình:
   - **Environment:** `Docker`.
   - **Root Directory:** `backend`.
4. Add Environment Variables (như mục 1).

### 🎨 Frontend (Vercel)
1. Kết nối Repository với Vercel.
2. Cấu hình:
   - **Framework Preset:** `Next.js`.
   - **Root Directory:** `frontend`.
3. Add Environment Variable: `NEXT_PUBLIC_API_URL`.

---

## 4. Local Testing Walkthrough

Để kiểm tra toàn bộ quy trình cục bộ:

1. **Khởi động Backend:**
   - Đảm bảo đã cắm `DATABASE_URL` (có thể dùng Docker Postgres local hoặc Supabase).
   - `cd backend && npm run start:dev`
   - Kiểm tra API tại `http://localhost:3000/orders`.

2. **Khởi động Frontend:**
   - `cd frontend && npm run dev`
   - Truy cập `http://localhost:3000`.

3. **Luồng kiểm thử:**
   - **B1:** Chọn sản phẩm "Lì Xì Rồng Vàng".
   - **B2:** Nhấn "Thêm vào giỏ hàng".
   - **B3:** Vào Giỏ hàng, kiểm tra số lượng.
   - **B4:** Nhấn "Thanh toán", điền form và xác nhận.
   - **B5:** Kiểm tra trang "Cám ơn" và check database/backend log.
   - **B6:** Gửi một bình luận và kiểm tra bình luận hiện lên (client-side load).

---

## ⚠️ Lưu ý Quan trọng
- Trang sản phẩm sử dụng **ISR (Incremental Static Regeneration)** với cache 1 ngày. Để xem thay đổi ngay lập tức trên production sau khi cập nhật DB, bạn có thể cấu hình On-demand Revalidation (tùy chọn).
- Giỏ hàng được lưu hoàn toàn tại `localStorage` của trình duyệt.
