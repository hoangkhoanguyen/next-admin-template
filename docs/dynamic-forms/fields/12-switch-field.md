# Switch Field

## Tổng quan

Switch field là một thành phần giao diện cho phép người dùng chuyển đổi giữa hai trạng thái (bật/tắt, true/false). Thường dùng cho các lựa chọn dạng boolean trong dynamic form.

## Cấu hình

```ts
{
  type: 'switch',
  name: 'isActive',
  label: 'Kích hoạt',
  defaultValue: false,
  required: false,
  // ...các thuộc tính khác
}
```

## UI Component

Sử dụng component `Switch` trong thư mục `src/components/ui/switch.tsx`.

## Ví dụ sử dụng

```tsx
<Switch checked={field.value} onCheckedChange={field.onChange} />
```

## Validation

- Có thể kết hợp với các rule kiểm tra boolean.
- Thường không bắt buộc, nhưng có thể thêm thuộc tính `required` nếu cần.

## UX Patterns

- Nên có label rõ ràng mô tả ý nghĩa của trạng thái bật/tắt.
- Trạng thái mặc định nên phù hợp với ngữ cảnh sử dụng.

## Tích hợp với Dynamic Form

Switch field được tích hợp như một loại field trong cấu hình dynamic form, xử lý giá trị boolean và trigger các sự kiện khi thay đổi trạng thái.

## Lưu ý

- Đảm bảo accessibility: có thể sử dụng bàn phím để chuyển đổi trạng thái.
- Hiển thị trạng thái rõ ràng cho người dùng.
