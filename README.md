[🇬🇧 English](README.md) | [🇻🇳 Tiếng Việt](README.vi.md)

# 🧧 Project Lộc bếp Việt - Monorepo

The high-end red envelope E-commerce system, integrated with order management, logistics, and a commenting system. The project is designed with a modern Monorepo model, optimized for fast development and deployment.

## 🚀 Key Features

### 🛒 For Customers
- **Homepage & Products:** Smooth display with premium effects, SEO support.
- **Cart:** Flexible cart management using LocalStorage.
- **Payment:** Simple ordering process, with immediate email notification.
- **Comments:** Submit feedback and view user reviews intuitively.

### 🛡️ For Administrators (Admin Dashboard)
- **Order Management:**
  - Sequential status tracking: Pending -> Confirmed -> Delivery -> Completed.
  - Advanced search (Name, Phone, Email).
  - Professional Excel report export.
- **Product Management:**
  - Add, edit information and toggle business status.
  - Cloudinary integration for image optimization.
- **Comment Management:** Moderation for showing/hiding customer comments.

## 🛠 Tech Stack

- **Frontend:** Next.js 15+ (App Router), Tailwind CSS, Lucide Icons, React Hot Toast.
- **Backend:** NestJS, TypeORM, PostgreSQL (via Supabase).
- **Utilities:** ExcelJS (Excel Export), Cloudinary (Image Storage), Nodemailer (Email).
- **Source Management:** Git Monorepo.

## 📁 Directory Structure

```text
/
├── backend/          # NestJS API Server
├── frontend/         # Next.js Web App
├── DEPLOYMENT.md     # Detailed deployment guide
└── .gitignore        # Keep repo clean
```

## 🛠 Development Guide (Local)

### 1. Backend
```bash
cd backend
npm install
npm run start:dev
```
Requires `.env` file configuration (See `DEPLOYMENT.md`).

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Requires `.env` file configuration (See `DEPLOYMENT.md`).

## ✍️ Authors
- Development Engineers: Gia Huy, Đức Anh
- Development Year: 2026

## 📜 License
Project developed exclusively for Lộc bếp Việt business purposes.
