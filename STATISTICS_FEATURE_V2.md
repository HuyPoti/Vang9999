# Chức năng Thống kê - Phiên bản 2.0

## 🎉 Tính năng mới

### 1. Lọc theo thời gian
- Date range picker cho phép chọn khoảng thời gian tùy chỉnh
- Mặc định hiển thị thống kê 30 ngày gần nhất
- Tự động reload khi thay đổi ngày

### 2. Biểu đồ đường doanh thu
- Hiển thị doanh thu theo từng ngày
- Sử dụng thư viện Recharts
- Responsive, tương tác tốt
- Tooltip hiển thị chi tiết khi hover

### 3. Export Excel
- Xuất thống kê ra file Excel với 3 sheets:
  - **Tổng quan**: Các chỉ số tổng hợp
  - **Doanh thu theo ngày**: Chi tiết doanh thu từng ngày
  - **Sản phẩm**: Top sản phẩm bán chạy
- Hỗ trợ filter theo thời gian khi export

---

## 📦 Thư viện đã thêm

```bash
# Frontend
npm install recharts
npm install --save-dev @types/recharts
```

**Lưu ý**: `date-fns` đã có sẵn trong project.

---

## 🔧 Thay đổi Backend

### 1. OrderService - `order.service.ts`

**Phương thức đã cập nhật:**

```typescript
async getStatistics(dateRange?: { startDate?: string; endDate?: string })
```
- Thêm tham số `dateRange` để filter theo thời gian
- Sử dụng QueryBuilder thay vì `find()`
- Thêm logic tính `daily_revenue`

```typescript
async getProductStatistics(dateRange?: { startDate?: string; endDate?: string })
```
- Thêm tham số `dateRange`
- Join với bảng `order` để filter theo `created_at`

**Phương thức mới:**

```typescript
private calculateDailyRevenue(orders: Order[])
```
- Tính doanh thu theo từng ngày
- Trả về mảng `{ date: string, revenue: number }[]`
- Sắp xếp theo ngày tăng dần

```typescript
async exportStatistics(res: any, dateRange?: { startDate?: string; endDate?: string })
```
- Export thống kê ra file Excel
- 3 sheets: Tổng quan, Doanh thu theo ngày, Sản phẩm
- Hỗ trợ filter theo thời gian

### 2. OrderController - `order.controller.ts`

**Endpoint đã cập nhật:**

```typescript
@Get('statistics/overview')
async getStatistics(@Query() query: { startDate?: string; endDate?: string })
```
- Nhận query params `startDate` và `endDate`
- Truyền xuống service

**Endpoint mới:**

```typescript
@Get('statistics/export')
async exportStatistics(@Res() res: any, @Query() query: { startDate?: string; endDate?: string })
```
- Export thống kê ra Excel
- Yêu cầu authentication

### 3. DTO - `statistics.dto.ts`

**Cập nhật:**

```typescript
export class OrderStatisticsDto {
    // ... existing fields
    daily_revenue: { date: string; revenue: number }[];  // ✨ Mới
}
```

---

## 🎨 Thay đổi Frontend

### 1. Statistics Service - `statistics.service.ts`

**Interface mới:**

```typescript
export interface DateRange {
    startDate?: string;
    endDate?: string;
}
```

**Hàm đã cập nhật:**

```typescript
export async function getStatistics(dateRange?: DateRange): Promise<StatisticsResponse>
```
- Nhận tham số `dateRange`
- Build query params từ dateRange
- Gửi kèm request

**Hàm mới:**

```typescript
export async function exportStatistics(dateRange?: DateRange): Promise<void>
```
- Gọi API export
- Tự động download file Excel
- Xử lý blob response

### 2. StatisticsManager Component

**State mới:**

```typescript
const [startDate, setStartDate] = useState<string>('');
const [endDate, setEndDate] = useState<string>('');
const [exporting, setExporting] = useState(false);
```

**UI mới:**

1. **Date Range Picker**
   - 2 input type="date" cho start và end
   - Icon Calendar
   - Responsive layout

2. **Biểu đồ đường**
   - Component: `LineChart` từ Recharts
   - Hiển thị doanh thu theo ngày
   - Tooltip với format VND
   - X-axis: Ngày (dd/MM)
   - Y-axis: Doanh thu (triệu VND)

3. **Nút Export Excel**
   - Icon Download
   - Hiển thị "Đang xuất..." khi đang export
   - Disabled state khi đang xử lý

**Logic mới:**

```typescript
useEffect(() => {
    // Set default: last 30 days
    const end = new Date();
    const start = subDays(end, 30);
    setStartDate(format(start, 'yyyy-MM-dd'));
    setEndDate(format(end, 'yyyy-MM-dd'));
}, []);

useEffect(() => {
    if (startDate && endDate) {
        loadStatistics();
    }
}, [startDate, endDate]);
```

---

## 📊 API Documentation

### GET /orders/statistics/overview

**Query Parameters:**
- `startDate` (optional): ISO 8601 date string (e.g., "2026-01-01T00:00:00.000Z")
- `endDate` (optional): ISO 8601 date string

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
      },
      "daily_revenue": [
        { "date": "2026-01-01", "revenue": 1500000 },
        { "date": "2026-01-02", "revenue": 2000000 }
      ]
    },
    "product_statistics": [...]
  }
}
```

### GET /orders/statistics/export

**Query Parameters:**
- `startDate` (optional): ISO 8601 date string
- `endDate` (optional): ISO 8601 date string

**Response:**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- File: `statistics.xlsx`

**Excel Structure:**

**Sheet 1: Tổng quan**
| Chỉ số | Giá trị |
|--------|---------|
| Tổng số đơn hàng | 150 |
| Tổng doanh thu | 45000000 |
| ... | ... |

**Sheet 2: Doanh thu theo ngày**
| Ngày | Doanh thu |
|------|-----------|
| 2026-01-01 | 1500000 |
| 2026-01-02 | 2000000 |

**Sheet 3: Sản phẩm**
| Tên sản phẩm | Số lượng bán | Số đơn hàng | Doanh thu |
|--------------|--------------|-------------|-----------|
| Lì xì vàng 9999 | 500 | 80 | 25000000 |

---

## 🚀 Cách sử dụng

### 1. Lọc theo thời gian

1. Click vào ô "Từ ngày" để chọn ngày bắt đầu
2. Click vào ô "Đến ngày" để chọn ngày kết thúc
3. Thống kê tự động reload khi thay đổi

**Ví dụ:**
- Xem thống kê tháng 1: `2026-01-01` đến `2026-01-31`
- Xem thống kê tuần này: Chọn ngày đầu tuần đến ngày cuối tuần

### 2. Xem biểu đồ

- Biểu đồ tự động hiển thị dưới phần tổng quan
- Hover vào điểm trên đường để xem chi tiết
- Nếu không có dữ liệu, biểu đồ sẽ ẩn

### 3. Export Excel

1. Chọn khoảng thời gian (nếu muốn)
2. Click nút "Xuất Excel"
3. File `statistics.xlsx` sẽ tự động download
4. Mở file bằng Excel/LibreOffice để xem

---

## 🎨 UI/UX Improvements

### Responsive Design
- Mobile: Date picker stack vertically
- Tablet: 2 columns layout
- Desktop: Full width với biểu đồ lớn

### Visual Enhancements
- Biểu đồ với màu xanh (#3b82f6)
- Smooth transitions
- Hover effects trên biểu đồ
- Loading state khi export

### Accessibility
- Date inputs có label rõ ràng
- Buttons có disabled state
- Error messages dễ đọc

---

## 🔮 Tính năng có thể mở rộng

### 1. Preset Date Ranges
```typescript
const presets = [
  { label: 'Hôm nay', days: 0 },
  { label: '7 ngày qua', days: 7 },
  { label: '30 ngày qua', days: 30 },
  { label: 'Tháng này', type: 'month' },
];
```

### 2. Nhiều loại biểu đồ
- Bar chart cho so sánh sản phẩm
- Pie chart cho phân bố trạng thái
- Area chart cho xu hướng

### 3. So sánh thời gian
- So sánh tháng này vs tháng trước
- Tính % tăng/giảm
- Highlight trends

### 4. Real-time updates
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    loadStatistics();
  }, 60000); // Refresh mỗi 1 phút
  return () => clearInterval(interval);
}, []);
```

### 5. Advanced filters
- Filter theo sản phẩm cụ thể
- Filter theo khu vực
- Filter theo nguồn đơn hàng

---

## 📝 Files đã thay đổi

**Backend:**
- 🔧 `backend/src/modules/order/order.service.ts`
- 🔧 `backend/src/modules/order/order.controller.ts`
- 🔧 `backend/src/modules/order/dto/statistics.dto.ts`

**Frontend:**
- 🔧 `frontend/lib/statistics.service.ts`
- 🔧 `frontend/components/admin/StatisticsManager.tsx`
- ✨ `frontend/package.json` (added recharts)

**Documentation:**
- ✨ `STATISTICS_FEATURE_V2.md` (this file)

---

## 🐛 Troubleshooting

### Biểu đồ không hiển thị
- Kiểm tra có dữ liệu `daily_revenue` không
- Xem console có lỗi recharts không
- Đảm bảo đã cài `recharts` và `@types/recharts`

### Export Excel bị lỗi
- Kiểm tra backend có cài `exceljs` không
- Xem network tab để debug API call
- Kiểm tra token authentication

### Date picker không hoạt động
- Kiểm tra browser có hỗ trợ `input[type="date"]` không
- Xem console có lỗi date-fns không

### Dữ liệu không đúng
- Verify query params được gửi đúng
- Kiểm tra timezone conversion
- Debug SQL query trong backend

---

## ✅ Checklist hoàn thành

- [x] Backend hỗ trợ filter theo thời gian
- [x] API trả về `daily_revenue`
- [x] Endpoint export Excel
- [x] Frontend date picker
- [x] Biểu đồ đường doanh thu
- [x] Nút export Excel
- [x] Responsive design
- [x] Loading states
- [x] Error handling
- [x] Documentation

---

## 🎯 Performance Notes

- **Backend**: Sử dụng QueryBuilder thay vì load toàn bộ data
- **Frontend**: Recharts tự động optimize rendering
- **Export**: Stream Excel file thay vì load vào memory
- **Date range**: Limit tối đa 1 năm để tránh quá tải

---

Chúc bạn sử dụng tốt! 🚀
