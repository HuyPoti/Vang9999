# Chức năng Thống kê - Hướng dẫn sử dụng

## Tổng quan

Chức năng thống kê cung cấp cái nhìn tổng quan về hoạt động kinh doanh, bao gồm:
- Tổng số đơn hàng đã đặt
- Tổng doanh thu
- Phân loại đơn hàng theo trạng thái (Pending, Confirmed, Shipping, Completed, Cancelled)
- Top sản phẩm bán chạy (số lượng bán, số đơn hàng, doanh thu)

## Cấu trúc Code

### Backend

**1. DTO - `backend/src/modules/order/dto/statistics.dto.ts`**
- `OrderStatisticsDto`: Thống kê tổng quan đơn hàng
- `ProductStatisticsDto`: Thống kê theo sản phẩm
- `StatisticsResponseDto`: Response wrapper

**2. Service - `backend/src/modules/order/order.service.ts`**
- `getStatistics()`: Lấy thống kê tổng quan
  - Tính tổng số đơn hàng
  - Tính tổng doanh thu
  - Phân loại theo trạng thái
- `getProductStatistics()`: Lấy thống kê theo sản phẩm
  - Sử dụng SQL aggregation (SUM, COUNT, GROUP BY)
  - Sắp xếp theo doanh thu giảm dần

**3. Controller - `backend/src/modules/order/order.controller.ts`**
- `GET /orders/statistics/overview`: Endpoint lấy thống kê
- Yêu cầu authentication (JwtAuthGuard)

### Frontend

**1. Service - `frontend/lib/statistics.service.ts`**
- `getStatistics()`: Gọi API lấy thống kê
- Tự động gửi token authentication

**2. Component - `frontend/components/admin/StatisticsManager.tsx`**
- Hiển thị thống kê dạng dashboard
- Auto-refresh khi mount
- Loading và error states
- Format tiền tệ VND

**3. Dashboard - `frontend/app/admin/dashboard/page.tsx`**
- Thêm tab "Thống kê" vào sidebar
- Tab mặc định khi vào dashboard

## API Endpoint

### GET /orders/statistics/overview

**Authentication:** Required (Bearer Token)

**Response:**
```json
{
  "status": "success",
  "data": {
    "order_statistics": {
      "total_orders": 150,
      "total_revenue": 45000000,
      "status_breakdown": {
        "pending": 10,
        "confirmed": 20,
        "shipping": 15,
        "completed": 100,
        "cancelled": 5
      }
    },
    "product_statistics": [
      {
        "product_id": "uuid",
        "product_name": "Lì xì vàng 9999",
        "total_quantity": 500,
        "total_revenue": 25000000,
        "order_count": 80
      }
    ]
  }
}
```

## Cách sử dụng

### 1. Khởi động Backend
```bash
cd backend
npm run start:dev
```

### 2. Khởi động Frontend
```bash
cd frontend
npm run dev
```

### 3. Truy cập Dashboard
1. Đăng nhập admin tại: `http://localhost:3000/admin/login`
2. Sau khi đăng nhập, dashboard sẽ hiển thị tab "Thống kê" đầu tiên
3. Click vào tab "Thống kê" để xem báo cáo

## Tính năng UI

### 1. Tổng quan (Cards)
- **Tổng đơn hàng**: Card màu xanh dương với icon giỏ hàng
- **Tổng doanh thu**: Card màu xanh lá với icon tiền tệ
- Format số tiền theo chuẩn VND

### 2. Thống kê theo trạng thái
- 5 cards nhỏ với màu sắc phân biệt:
  - Chờ xác nhận: Vàng
  - Đã xác nhận: Xanh dương
  - Đang giao: Tím
  - Hoàn thành: Xanh lá
  - Đã hủy: Đỏ

### 3. Top sản phẩm bán chạy
- Bảng hiển thị chi tiết:
  - Tên sản phẩm
  - Số lượng bán
  - Số đơn hàng
  - Doanh thu
- Sắp xếp theo doanh thu giảm dần

### 4. Nút làm mới
- Reload dữ liệu thống kê
- Hiển thị loading spinner khi đang tải

## Mở rộng trong tương lai

### 1. Lọc theo thời gian
```typescript
// Thêm vào API
@Query() query: { 
  startDate?: string; 
  endDate?: string; 
}
```

### 2. Export Excel
```typescript
// Thêm endpoint
@Get('statistics/export')
exportStatistics(@Res() res: any) {
  return this.orderService.exportStatistics(res);
}
```

### 3. Biểu đồ
```typescript
// Sử dụng thư viện như recharts hoặc chart.js
import { LineChart, BarChart } from 'recharts';
```

### 4. Real-time updates
```typescript
// Sử dụng WebSocket hoặc polling
useEffect(() => {
  const interval = setInterval(loadStatistics, 30000); // 30s
  return () => clearInterval(interval);
}, []);
```

## Lưu ý kỹ thuật

1. **Performance**: Với lượng đơn hàng lớn, nên thêm caching hoặc pagination
2. **Security**: Endpoint đã được bảo vệ bằng JwtAuthGuard
3. **Data consistency**: Sử dụng transaction khi cần thiết
4. **Error handling**: Đã xử lý lỗi ở cả backend và frontend

## Troubleshooting

### Lỗi "Failed to fetch statistics"
- Kiểm tra backend đang chạy
- Kiểm tra token authentication còn hợp lệ
- Xem console log để biết chi tiết lỗi

### Dữ liệu không hiển thị
- Đảm bảo có đơn hàng trong database
- Kiểm tra API response trong Network tab

### Số liệu không chính xác
- Kiểm tra logic tính toán trong `getStatistics()` và `getProductStatistics()`
- Verify dữ liệu trong database
