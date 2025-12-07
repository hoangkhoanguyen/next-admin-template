# Pagination Display Rules

Tài liệu này mô tả quy luật hiển thị các button của pagination component trong hệ thống.

## 📋 Tổng quan

Pagination component được xây dựng dựa trên Shadcn UI và có các thành phần chính:

- **Previous/Next buttons**: Điều hướng trang trước/sau
- **Page number buttons**: Các button hiển thị số trang
- **Ellipsis (...)**: Dấu ba chấm thể hiện có nhiều trang bị ẩn

## 🎯 Các trường hợp hiển thị

### 1. Trường hợp cơ bản (≤ 7 trang)

Khi tổng số trang **nhỏ hơn hoặc bằng 7**, hiển thị tất cả các trang.

```
[ Previous ] [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ] [ Next ]
```

**Quy tắc:**

- Hiển thị đầy đủ tất cả page buttons
- Không sử dụng ellipsis
- Previous button disabled khi ở trang 1
- Next button disabled khi ở trang cuối

### 2. Trang đầu (page ≤ 3) với nhiều trang

Khi đang ở **trang 1, 2, hoặc 3** và tổng số trang > 7:

```
Trang 1: [ Previous ] [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ] ... [ 10 ] [ Next ]
Trang 2: [ Previous ] [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ] ... [ 10 ] [ Next ]
Trang 3: [ Previous ] [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ] ... [ 10 ] [ Next ]
```

**Quy tắc:**

- Hiển thị 5 trang đầu tiên
- Ellipsis sau trang 5
- Hiển thị trang cuối cùng
- Previous disabled nếu page = 1

### 3. Trang cuối (page ≥ totalPages - 2) với nhiều trang

Khi đang ở **3 trang cuối** và tổng số trang > 7:

```
Trang 8:  [ Previous ] [ 1 ] ... [ 6 ] [ 7 ] [ 8 ] [ 9 ] [ 10 ] [ Next ]
Trang 9:  [ Previous ] [ 1 ] ... [ 6 ] [ 7 ] [ 8 ] [ 9 ] [ 10 ] [ Next ]
Trang 10: [ Previous ] [ 1 ] ... [ 6 ] [ 7 ] [ 8 ] [ 9 ] [ 10 ] [ Next ]
```

**Quy tắc:**

- Hiển thị trang đầu tiên
- Ellipsis sau trang 1
- Hiển thị 5 trang cuối cùng
- Next disabled nếu page = totalPages

### 4. Trang giữa (3 < page < totalPages - 2)

Khi đang ở **trang giữa** và tổng số trang > 7:

```
Trang 5: [ Previous ] [ 1 ] ... [ 4 ] [ 5 ] [ 6 ] ... [ 10 ] [ Next ]
Trang 6: [ Previous ] [ 1 ] ... [ 5 ] [ 6 ] [ 7 ] ... [ 10 ] [ Next ]
```

**Quy tắc:**

- Hiển thị trang đầu tiên
- Ellipsis đầu
- Hiển thị 3 trang: (current - 1), current, (current + 1)
- Ellipsis cuối
- Hiển thị trang cuối cùng

## 🔧 Implementation hiện tại

### File: `src/components/ui/pagination.tsx`

Component cung cấp các building blocks:

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious />
    </PaginationItem>

    <PaginationItem>
      <PaginationLink isActive={true}>1</PaginationLink>
    </PaginationItem>

    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>

    <PaginationItem>
      <PaginationNext />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

### File: `src/app/(dashboard)/products/page.tsx`

Implementation hiện tại (đơn giản):

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        aria-disabled={page === 1}
      />
    </PaginationItem>

    {/* Hiển thị TẤT CẢ các trang */}
    {Array.from({ length: pageCount }).map((_, i) => (
      <PaginationItem key={i}>
        <PaginationLink
          isActive={page === i + 1}
          onClick={() => setPage(i + 1)}
        >
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    ))}

    <PaginationItem>
      <PaginationNext
        onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
        aria-disabled={page === pageCount}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

**Vấn đề:** Implementation này hiển thị TẤT CẢ các trang, không phù hợp khi có nhiều trang (> 10).

## 📐 Công thức tính toán

### Helper function để tạo danh sách page buttons

```typescript
function generatePaginationButtons(
  currentPage: number,
  totalPages: number,
  maxButtons: number = 7
): (number | "ellipsis")[] {
  // Nếu tổng số trang <= maxButtons, hiển thị tất cả
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const buttons: (number | "ellipsis")[] = [];

  // Luôn hiển thị trang 1
  buttons.push(1);

  if (currentPage <= 3) {
    // Trường hợp: Đang ở đầu
    for (let i = 2; i <= 5; i++) {
      buttons.push(i);
    }
    buttons.push("ellipsis");
    buttons.push(totalPages);
  } else if (currentPage >= totalPages - 2) {
    // Trường hợp: Đang ở cuối
    buttons.push("ellipsis");
    for (let i = totalPages - 4; i <= totalPages; i++) {
      buttons.push(i);
    }
  } else {
    // Trường hợp: Đang ở giữa
    buttons.push("ellipsis");
    buttons.push(currentPage - 1);
    buttons.push(currentPage);
    buttons.push(currentPage + 1);
    buttons.push("ellipsis");
    buttons.push(totalPages);
  }

  return buttons;
}
```

### Usage example

```tsx
const buttons = generatePaginationButtons(page, pageCount);

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        aria-disabled={page === 1}
      />
    </PaginationItem>

    {buttons.map((button, index) => (
      <PaginationItem key={index}>
        {button === "ellipsis" ? (
          <PaginationEllipsis />
        ) : (
          <PaginationLink
            isActive={page === button}
            onClick={() => setPage(button)}
          >
            {button}
          </PaginationLink>
        )}
      </PaginationItem>
    ))}

    <PaginationItem>
      <PaginationNext
        onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
        aria-disabled={page === pageCount}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>;
```

## 🎨 Visual States

### Active state

```tsx
<PaginationLink isActive={true}>5</PaginationLink>
```

- Variant: `outline`
- Visual: Border với background khác biệt
- Aria: `aria-current="page"`

### Inactive state

```tsx
<PaginationLink isActive={false}>3</PaginationLink>
```

- Variant: `ghost`
- Visual: Transparent background, hover effect
- Interactive: Clickable

### Disabled state

```tsx
<PaginationPrevious aria-disabled={true} tabIndex={-1} />
<PaginationNext aria-disabled={true} tabIndex={-1} />
```

- Visual: Mờ đi, không hover
- Accessibility: `aria-disabled`, `tabIndex={-1}`
- Behavior: Không trigger onClick

## 📱 Responsive behavior

### Desktop (≥ 640px)

```tsx
<PaginationPrevious>
  <ChevronLeftIcon />
  <span className="hidden sm:block">Previous</span>
</PaginationPrevious>
```

- Hiển thị icon + text "Previous"/"Next"

### Mobile (< 640px)

- Chỉ hiển thị icon (ẩn text)
- Giữ nguyên logic hiển thị trang

## 🎯 Best Practices

### 1. Accessibility

- ✅ Sử dụng `aria-label` cho Previous/Next buttons
- ✅ Sử dụng `aria-current="page"` cho trang hiện tại
- ✅ Sử dụng `aria-disabled` cho disabled buttons
- ✅ Sử dụng `tabIndex={-1}` cho disabled buttons
- ✅ Sử dụng `role="navigation"` cho pagination nav

### 2. Performance

- ✅ Tránh render quá nhiều buttons (max 7-9 buttons)
- ✅ Sử dụng `React.memo()` cho pagination component
- ✅ Sử dụng `key` prop hợp lý khi map

### 3. UX

- ✅ Visual feedback rõ ràng cho trang hiện tại
- ✅ Disabled state rõ ràng cho Previous/Next
- ✅ Hover state cho các button clickable
- ✅ Smooth transition khi chuyển trang

## 🔄 Server-side Pagination

Khi làm việc với server-side pagination:

```tsx
const { data, isLoading } = useProducts({
  page, // Current page (1-indexed)
  pageSize: 10, // Items per page
  // ... other filters
});

const total = data?.meta.total || 0;
const pageCount = data?.meta.totalPages || 1;
```

**Lưu ý:**

- API thường dùng 1-indexed (page 1, 2, 3...)
- TanStack Table dùng 0-indexed (pageIndex: 0, 1, 2...)
- Cần convert khi integrate: `pageIndex + 1` hoặc `page - 1`

## 📊 Test Cases

### Test case 1: Ít trang

- Input: `currentPage = 2, totalPages = 5`
- Expected: `[1] [2] [3] [4] [5]`

### Test case 2: Đầu danh sách

- Input: `currentPage = 2, totalPages = 20`
- Expected: `[1] [2] [3] [4] [5] ... [20]`

### Test case 3: Cuối danh sách

- Input: `currentPage = 19, totalPages = 20`
- Expected: `[1] ... [16] [17] [18] [19] [20]`

### Test case 4: Giữa danh sách

- Input: `currentPage = 10, totalPages = 20`
- Expected: `[1] ... [9] [10] [11] ... [20]`

### Test case 5: Edge cases

- Input: `currentPage = 1, totalPages = 1`
- Expected: `[1]` (Previous & Next disabled)

## 🚀 Roadmap

### ✅ Đã có

- [x] Basic pagination component (Shadcn UI)
- [x] Previous/Next navigation
- [x] Simple all-pages display
- [x] Disabled states
- [x] Active state styling

### 🎯 Cần cải thiện

- [ ] Smart pagination với ellipsis
- [ ] Reusable `usePagination` hook
- [ ] Page jump input (Go to page: \_\_\_)
- [ ] Page size selector
- [ ] Total items display
- [ ] Keyboard navigation (Arrow keys)
- [ ] URL sync với query params
- [ ] Animation transitions

## 📚 References

- Shadcn UI Pagination: https://ui.shadcn.com/docs/components/pagination
- TanStack Table Pagination: https://tanstack.com/table/v8/docs/guide/pagination
- WAI-ARIA Pagination Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/pagination/

---

**Cập nhật:** December 5, 2025
