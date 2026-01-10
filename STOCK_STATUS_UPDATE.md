# Cập nhật: Thêm Trạng thái Hàng và Nút Xóa Sản phẩm

## Tóm tắt thay đổi

### 1. Backend Changes

#### Product Entity (`backend/src/entities/product.entity.ts`)
- ✅ Thêm enum `StockStatus` với 3 giá trị:
  - `in_stock`: Đang kinh doanh (còn hàng)
  - `out_of_stock`: Hết hàng (tạm thời)
  - `discontinued`: Ngừng kinh doanh
- ✅ Thêm trường `stock_status` vào Product entity với default là `in_stock`

#### DTO (`backend/src/modules/product/dto/create-product.dto.ts`)
- ✅ Thêm validation cho trường `stock_status` (optional)
- ✅ Import `StockStatus` enum từ entity

#### Migration (`backend/src/migrations/1736437200000-AddStockStatusToProduct.ts`)
- ✅ Tạo migration file để thêm cột `stock_status` vào database
- ✅ Hỗ trợ rollback nếu cần

#### API
- ✅ Endpoint DELETE `/products/:id` đã có sẵn
- ✅ Endpoint PATCH `/products/:id` hỗ trợ cập nhật `stock_status`

---

### 2. Frontend Changes

#### ProductManager (`frontend/components/admin/ProductManager.tsx`)
- ✅ Thêm `stock_status` vào interface Product
- ✅ Thêm dropdown chọn trạng thái hàng trong form (3 options)
- ✅ Thêm nút XÓA (màu đỏ) với xác nhận 2 lần
- ✅ Hiển thị badge trạng thái hàng trong bảng:
  - "Đang bán" (xanh lá)
  - "Hết hàng" (cam)
  - "Ngừng KD" (đỏ)
- ✅ Cập nhật form state để bao gồm `stock_status`

#### Product Detail Page (`frontend/app/products/[slug]/page.tsx`)
- ✅ Thêm `stock_status` vào interface Product
- ✅ Hiển thị badge trạng thái hàng phía trên giá:
  - Badge cam: "Hết hàng"
  - Badge đỏ: "Ngừng kinh doanh"
- ✅ Truyền `stock_status` xuống AddToCartButton

#### AddToCartButton (`frontend/app/products/[slug]/AddToCartButton.tsx`)
- ✅ Nhận prop `stockStatus`
- ✅ Disable tất cả nút khi `out_of_stock` hoặc `discontinued`
- ✅ Hiển thị thông báo cảnh báo (cam) khi hết hàng:
  - Icon AlertCircle
  - Message rõ ràng theo từng trạng thái
- ✅ Thay đổi text nút thành "Hết hàng" hoặc "Ngừng kinh doanh"
- ✅ Disable nút tăng/giảm số lượng khi hết hàng

---

## Hướng dẫn sử dụng

### Cho Admin:

1. **Thêm/Sửa sản phẩm:**
   - Chọn trạng thái hàng từ dropdown:
     - "Đang kinh doanh (Còn hàng)" - mặc định
     - "Hết hàng (Tạm thời)" - sản phẩm vẫn hiển thị nhưng không mua được
     - "Ngừng kinh doanh" - sản phẩm ngừng bán vĩnh viễn

2. **Xóa sản phẩm:**
   - Click nút thùng rác (đỏ) ở cuối mỗi dòng
   - Xác nhận 2 lần trước khi xóa
   - **LƯU Ý:** Hành động này KHÔNG THỂ HOÀN TÁC!

3. **Toggle trạng thái:**
   - Nút mắt: Bật/tắt hiển thị sản phẩm (is_active)
   - Dropdown trạng thái hàng: Quản lý tình trạng kho

### Cho Người dùng:

1. **Sản phẩm còn hàng:**
   - Hiển thị bình thường
   - Có thể thêm vào giỏ hàng

2. **Sản phẩm hết hàng:**
   - Hiển thị badge cam "Hết hàng"
   - Thông báo: "Sản phẩm tạm thời hết hàng. Vui lòng quay lại sau!"
   - Nút "Thêm vào giỏ hàng" bị disable (màu xám)
   - Không thể tăng/giảm số lượng

3. **Sản phẩm ngừng kinh doanh:**
   - Hiển thị badge đỏ "Ngừng kinh doanh"
   - Thông báo: "Sản phẩm này đã ngừng kinh doanh"
   - Nút bị disable hoàn toàn

---

## Database Migration

Nếu cần chạy migration thủ công (production):

```bash
cd backend
npm run typeorm migration:run
```

Để rollback:

```bash
npm run typeorm migration:revert
```

---

## Testing Checklist

- [ ] Backend restart thành công
- [ ] Cột `stock_status` được tạo trong database
- [ ] Tạo sản phẩm mới với stock_status
- [ ] Cập nhật stock_status của sản phẩm hiện có
- [ ] Xóa sản phẩm thành công
- [ ] Badge hiển thị đúng trong admin
- [ ] Badge hiển thị đúng trên trang chi tiết
- [ ] Nút "Thêm vào giỏ hàng" disable khi hết hàng
- [ ] Thông báo cảnh báo hiển thị đúng
- [ ] Không thể thêm sản phẩm hết hàng vào giỏ

---

## Notes

- Backend đang chạy với `synchronize: true` nên cột sẽ tự động được tạo khi restart
- Migration file được tạo để sử dụng trong production
- Lỗi TypeScript import ở backend sẽ tự động biến mất sau khi hot-reload
