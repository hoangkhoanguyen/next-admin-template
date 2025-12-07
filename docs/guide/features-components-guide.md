# Features Components Guide

## Giới thiệu

Thư mục `src/components/features` là nơi chứa các component đặc thù cho từng tính năng (feature/module) của hệ thống admin. Mục đích là giúp tổ chức code rõ ràng, dễ mở rộng, dễ bảo trì và phân chia công việc theo từng nhóm nghiệp vụ hoặc chức năng.

## Khi nào nên đặt component vào đây?

- Khi component chỉ phục vụ cho một tính năng/module cụ thể, không có tính tái sử dụng rộng rãi cho toàn hệ thống.
- Khi component gắn với logic nghiệp vụ, UI hoặc data đặc thù của một feature.
- Khi muốn tách biệt code theo domain để dễ phát triển song song nhiều tính năng.

## Không nên đặt gì ở đây?

- Các component dùng chung cho nhiều tính năng (ví dụ: filter bar, dynamic form, image picker, table, button, ...). Những thành phần này nên đặt ở `shared` hoặc `ui`.
- Các helper, hook, util dùng chung cho toàn hệ thống.

## Cấu trúc hiện tại

```
src/components/features/
  storybook/   # Feature storybook cho các ui components
  products/    # Demo: chứa các component liên quan đến tính năng products
```

> Lưu ý: Các thư mục trên chỉ là ví dụ demo. Khi phát triển thực tế, hãy tạo thư mục theo từng tính năng thực sự của dự án.

## Hướng dẫn phát triển

- Mỗi feature nên có thư mục riêng, đặt tên rõ ràng, ngắn gọn, phản ánh đúng chức năng.
- Đặt các component, hook, helper chỉ phục vụ cho feature đó vào đúng thư mục.
- Nếu phát hiện component có thể dùng lại cho nhiều feature, hãy cân nhắc chuyển sang `shared`.
- Có thể tạo thêm các sub-folder bên trong mỗi feature nếu tính năng phức tạp (ví dụ: `components/`, `hooks/`, `utils/` riêng cho feature đó).

---

> Tóm lại: `features` là nơi để dev phát triển các thành phần UI/logic đặc thù cho từng module, giúp codebase rõ ràng, dễ mở rộng và bảo trì.
