# 🚀 Hướng Dẫn Triển Khai (Deployment Guide)

Tài liệu này cung cấp các bước cần thiết để thiết lập và chạy dự án **Lì Xì 2026** trên môi trường Production (như Vercel và Render).

## 1. Biến môi trường (Environment Variables)

Bạn phải thiết lập các tham số sau để hệ thống hoạt động chính xác.

### 📂 Backend (`/backend/.env`)
| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `PORT` | Cổng chạy server | `3001` |
| `DATABASE_URL` | Kết nối Postgres (Supabase) | `postgresql://...` |
| `JWT_SECRET` | Khóa bảo mật đăng nhập Admin | `your_super_secret_key` |
| `ADMIN_EMAIL` | Email nhận thông báo đơn hàng | `admin@example.com` |
| `CORS_ORIGIN` | URL của Frontend khi deploy | `https://your-app.vercel.app` |
| **Email (SMTP)** | | |
| `SMTP_HOST` | Địa chỉ máy chủ Email | `smtp.gmail.com` |
| `SMTP_USER` | Tài khoản gửi mail | `sender@gmail.com` |
| `SMTP_PASS` | Mật khẩu ứng dụng (App Password) | `xxxx xxxx xxxx xxxx` |
| **Cloudinary** | (Lưu trữ ảnh sản phẩm) | |
| `CLOUDINARY_NAME` | Cloud Name | `...` |
| `CLOUDINARY_API_KEY` | API Key | `...` |
| `CLOUDINARY_API_SECRET`| API Secret | `...` |

### 📂 Frontend (`/frontend/.env`)
| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `NEXT_PUBLIC_API_URL` | Địa chỉ Backend đã deploy | `https://your-backend.onrender.com` |

---

## 2. Thiết lập Dịch vụ bên thứ ba

### 🐘 Cơ sở dữ liệu (Supabase)
1. Tạo Project trên [Supabase](https://supabase.com).
2. Copy `Connection String` (Transaction mode) và dán vào `DATABASE_URL`.
3. Server NestJS sẽ tự động tạo các bảng khi khởi chạy lần đầu nhờ `synchronize: true`.

### ☁️ Hình ảnh (Cloudinary)
1. Tạo tài khoản [Cloudinary](https://cloudinary.com).
2. Lấy thông tin Credentials và điền vào file `.env` của Backend.
3. Đây là nơi lưu trữ các ảnh bạn upload trong mục Quản trị.

### 📧 Gửi Email (Gmail SMTP)
1. Bật **Xác minh 2 lớp** cho tài khoản Gmail gửi.
2. Tạo **Mật khẩu ứng dụng (App Password)**.
3. Sử dụng mật khẩu đó cho `SMTP_PASS`.

---

## 3. Quy trình Triển khai (CI/CD)

Dự án dạng Monorepo nên cần cấu hình đúng thư mục gốc (Root Directory).

### 🧱 Triển khai Backend (Render.com)

Có 2 cách để triển khai Backend trên Render:

#### Cách 1: Sử dụng Docker (Khuyên dùng - Ổn định nhất)
1. Tạo một **Web Service** mới, kết nối với Github.
2. **Root Directory:** `backend`
3. **Environment:** Chọn **Docker**. Render sẽ tự động tìm file `backend/Dockerfile`.
4. Render sẽ thực hiện Build 2 giai đoạn (Multi-stage) dựa trên Dockerfile của bạn:
   - Giai đoạn 1: Build mã nguồn TypeScript sang JavaScript.
   - Giai đoạn 2: Chỉ copy code đã build và chạy môi trường Production gọn nhẹ.
5. Nhập các biến môi trường vào phần **Environment Variables**.

#### Cách 2: Sử dụng Node.js (Truyền thống)
1. **Root Directory:** `backend`
2. **Environment:** `Node`
3. **Build Command:** `npm install && npm run build`
4. **Start Command:** `npm run start:prod`
5. Nhập các biến môi trường vào phần **Environment Variables**.

---

## 4. Hướng dẫn chi tiết về Docker (Dành cho Local & Server khác)

Nếu bạn muốn chạy Docker cục bộ hoặc trên các VPS khác (như Railway, DigitalOcean):

### Chạy cục bộ (Local Docker):
1. Mở Terminal tại thư mục `backend/`.
2. Build Image:
   ```bash
   docker build -t lixi-backend .
   ```
3. Chạy Container:
   ```bash
   docker run -p 3001:3000 --env-file .env lixi-backend
   ```
   *(Lưu ý: Map port 3001 của máy khách vào port 3000 của container)*

### Tại sao nên dùng Docker cho Backend này?
- **Tính nhất quán:** Đảm bảo môi trường chạy trên máy bạn và trên máy chủ là giống hệt nhau (Node 18 Alpine).
- **Gọn nhẹ:** Sử dụng Multi-stage build giúp giảm kích thước Image cuối cùng, giúp deploy nhanh hơn và tiết kiệm dung lượng.
- **Dễ mở rộng:** Bạn có thể dễ dàng di chuyển Docker image này sang bất kỳ nền tảng nào hỗ trợ Docker mà không cần cài đặt lại Node.js hay dependencies.

---

## 5. Quy trình Triển khai Frontend (Vercel)
1. **Import Projekt** từ Github.
2. **Framework Preset:** `Next.js`.
3. **Root Directory:** `frontend`.
4. **Build Command:** `npm run build`
5. Nhập biến `NEXT_PUBLIC_API_URL`.

---

## 🔒 Bảo mật Admin
- Mật khẩu Admin hiện đang được cấu hình cứng trong code (Dạng Demo) hoặc quản lý qua DB.
- Đảm bảo `JWT_SECRET` đủ mạnh và không chia sẻ file `.env` ra ngoài Repo (File `.gitignore` đã thực hiện việc này).

## 📊 Vận hành & Quản lý
- **Xuất Excel:** Tính năng đã được tối ưu hóa. Nếu gặp lỗi khi deploy trên Free Tier (như Render), hãy kiểm tra bộ nhớ RAM (ExcelJS có thể tốn tài nguyên nếu file quá lớn).
- **Trạng thái đơn hàng:** Đã được thiết lập ràng buộc tuần tự. Không được bỏ qua các bước của vận đơn.

---

## ⚡ Giải quyết lỗi Kết nối Database (ENETUNREACH IPv6)

Nếu bạn chạy Docker local và gặp lỗi `ENETUNREACH` kèm một địa chỉ IPv6 (như của Supabase), đó là do mạng Docker Bridge chưa hỗ trợ IPv6.

**Cách xử lý:**
1. Tôi đã thêm `ENV NODE_OPTIONS="--dns-result-order=ipv4first"` vào Dockerfile. Lệnh này ép Node.js ưu tiên tìm địa chỉ IPv4 của Supabase trước.
2. Nếu vẫn lỗi, hãy kiểm tra xem bạn có đang dùng Hostname của Supabase (ví dụ: `db.xxxx.supabase.co`) không. Một số khu vực của Supabase hiện đã chuyển sang IPv6-only. Bạn có thể sử dụng **Connection Pooling** (cổng 6543) hoặc IPv4 address nếu Supabase có cung cấp.

---
🚀 *Chúc bạn kinh doanh hồng phát trong mùa Lì Xì 2026!*
