# 🧧 Project Lì Xì 2026 - Monorepo

Hệ thống E-commerce bán bao lì xì cao cấp, tích hợp quản lý đơn hàng, kho vận và hệ thống bình luận. Dự án được thiết kế theo mô hình Monorepo hiện đại, tối ưu cho việc phát triển và triển khai nhanh.

## 🚀 Tính năng nổi bật

### 🛒 Dành cho Khách hàng
- **Trang chủ & Sản phẩm:** Hiển thị mượt mà với hiệu ứng premium, hỗ trợ SEO.
- **Giỏ hàng:** Quản lý giỏ hàng linh hoạt bằng LocalStorage.
- **Thanh toán:** Quy trình đặt hàng đơn giản, có thông báo qua Email ngay lập tức.
- **Bình luận:** Gửi cảm nhận và xem đánh giá của người dùng khác một cách trực quan.

### 🛡️ Dành cho Quản trị viên (Admin Dashboard)
- **Quản lý Đơn hàng:** 
  - Theo dõi trạng thái tuần tự: Chờ xử lý -> Đã xác nhận -> Đang giao -> Hoàn thành.
  - Tìm kiếm nâng cao (Tên, SĐT, Email).
  - Xuất báo cáo Excel chuyên nghiệp.
- **Quản lý Sản phẩm:**
  - Thêm, sửa thông tin và bật/tắt trạng thái kinh doanh.
  - Tích hợp Cloudinary để tối ưu hóa hình ảnh.
- **Quản lý Bình luận:** Kiểm duyệt ẩn/hiện bình luận của khách hàng.

## 🛠 Tech Stack

- **Frontend:** Next.js 15+ (App Router), Tailwind CSS, Lucide Icons, React Hot Toast.
- **Backend:** NestJS, TypeORM, PostgreSQL (via Supabase).
- **Tiện ích:** ExcelJS (Xuất Excel), Cloudinary (Lưu trữ ảnh), Nodemailer (Email).
- **Quản lý source:** Git Monorepo.

## 📁 Cấu trúc thư mục

```text
/
├── backend/          # NestJS API Server
├── frontend/         # Next.js Web App
├── DEPLOYMENT.md     # Hướng dẫn triển khai chi tiết
└── .gitignore        # Giữ repo sạch sẽ
```

## 🛠 Hướng dẫn phát triển (Local)

### 1. Backend
```bash
cd backend
npm install
npm run start:dev
```
Cần cấu hình file `.env` (Tham khảo `DEPLOYMENT.md`).

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Cần cấu hình file `.env` (Tham khảo `DEPLOYMENT.md`).

## ✍️ Tác giả
- Kỹ sư phát triển: **Antigravity AI Assistant**
- Năm phát triển: 2026

## 📜 Giấy phép
Dự án được phát triển riêng cho mục đích kinh doanh Lì Xì 2026.
