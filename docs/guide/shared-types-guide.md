# Shared Types Guide (`src/types`)

## Mục đích

Thư mục `src/types` **chỉ dùng để chứa các type, interface, enum dùng chung cho toàn bộ dự án**. Việc tách riêng các định nghĩa type này giúp tái sử dụng, giảm trùng lặp và đảm bảo sự nhất quán khi phát triển các module, feature khác nhau.

## Chỉ đặt type dùng chung

- **Chỉ đặt các type/interface/enum mà nhiều feature/module cùng sử dụng.**
- **Không đặt bất kỳ type/interface/enum nào chỉ dùng riêng cho một feature/module cụ thể ở đây.**
- Nếu một type chỉ dùng cho một feature/module, hãy đặt nó trong thư mục của feature/module đó (ví dụ: `src/features/products/types.ts` hoặc ngay trong file feature đó).

### Tổng kết nguyên tắc

- `/types` chỉ chứa type dùng chung toàn app.
- Type đặc thù cho feature để trong thư mục feature đó, bất kể feature nằm ở đâu trong cấu trúc project.

---

> **Tóm lại:** `src/types` chỉ nên chứa các type/interface/enum dùng chung cho nhiều nơi trong dự án. **Không đặt type riêng cho từng feature/module ở đây.**
