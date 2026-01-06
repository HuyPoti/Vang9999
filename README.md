# 🧧 Project Lì Xì 2026

Website bán bao lì xì hiệu năng cao, tối ưu chi phí deploy (Free Tier).

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Premium UI)
- **State:** React Hooks + LocalStorage (Cart)
- **Deploy:** Vercel
- **Performance:** SSG + ISR (Revalidate 86400s)

### Backend
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL (via Supabase)
- **ORM:** TypeORM
- **Container:** Docker (Multi-stage)
- **Deploy:** Render

## 📂 Architecture & Features

### 1. Sản phẩm (Product)
- **List:** Static Generation (SSG) + ISR.
- **Detail:** SSG + ISR.
- **Cache:** TTL 1 ngày.

### 2. Bình luận (Comment)
- **Strategy:** Client-side fetching.
- **Auth:** Anonymous (Guest).
- **Rate Limit:** Basic token bucket or IP based (Backend).

### 3. Đơn hàng (Order)
- **Flow:** Add to Cart (Local) -> Checkout Form -> API `POST /orders`.
- **Logic:** Validate serverside -> Save DB.

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- Docker Desktop
- Supabase Account (Connection String)

### Setup
1. **Frontend:** `cd frontend && npm install && npm run dev`
2. **Backend:** `cd backend && npm install && npm run start:dev`

## 📝 Environment Variables
See `.env.example` in each folder.
