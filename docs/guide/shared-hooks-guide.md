# Shared Hooks Guide

## Mục đích

Thư mục `src/hooks` là nơi tập trung các custom hook dùng chung cho toàn bộ dự án, không gắn với một feature/module nghiệp vụ cụ thể nào. Việc tách riêng các hook này giúp tái sử dụng, giảm trùng lặp code và tăng tính nhất quán khi phát triển UI/logic tổng quát.

## Khi nào nên đặt hook vào đây?

- Hook dùng lại ở nhiều nơi, không phụ thuộc vào business logic của từng feature.
- Hook phục vụ cho UI/UX tổng quát: responsive, theme, clipboard, event listener, debounce, ...
- Hook quản lý state hoặc logic toàn cục: authentication, user session, global settings, ...

## Không nên đặt gì ở đây?

- Hook chỉ phục vụ cho một feature/module cụ thể (nên đặt trong `src/features/[feature]/hooks`).
- Hook gắn với logic nghiệp vụ, API, data đặc thù của từng feature.

## Ví dụ các hook nên đặt ở đây

- `useMobile`, `useWindowSize`: phát hiện thiết bị, kích thước màn hình.
- `useTheme`: quản lý dark/light mode.
- `useEventListener`, `useDebounce`, `useClickOutside`, `useCopyToClipboard`: tiện ích UI tổng quát.
- `useAuth`, `useUser`: quản lý xác thực, thông tin user toàn app (nếu dùng toàn cục).

## Cấu trúc đề xuất

```
src/
  hooks/
    useMobile.ts
    useWindowSize.ts
    useTheme.ts
    useEventListener.ts
    ...
```

---

> Tóm lại: `src/hooks` chỉ nên chứa các hook thực sự generic, dùng lại ở nhiều nơi, không phụ thuộc vào logic nghiệp vụ của từng feature. Các hook đặc thù nên để trong thư mục feature tương ứng.
