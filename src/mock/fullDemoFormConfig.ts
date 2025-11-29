import { z } from "zod";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";

export const fullDemoFormConfig: FieldConfig[] = [
  {
    name: "name",
    type: "text",
    label: "Tên",
    placeholder: "Nhập tên của bạn",
    zodSchema: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Nhập email",
    zodSchema: z.email("Email không hợp lệ"),
  },
  {
    name: "password",
    type: "password",
    label: "Mật khẩu",
    placeholder: "Nhập mật khẩu",
    zodSchema: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  },
  {
    name: "bio",
    type: "textarea",
    label: "Giới thiệu",
    placeholder: "Giới thiệu về bản thân",
    zodSchema: z.string(),
  },
  {
    name: "website",
    type: "url",
    label: "Website",
    placeholder: "https://example.com",
    zodSchema: z.url("URL không hợp lệ"),
  },
  {
    name: "phone",
    type: "tel",
    label: "Số điện thoại",
    placeholder: "Nhập số điện thoại",
    zodSchema: z.string().min(8, "Số điện thoại không hợp lệ"),
  },
  {
    name: "profile",
    type: "group",
    label: "Thông tin cá nhân",
    fields: [
      {
        name: "bio",
        type: "text",
        label: "Giới thiệu",
        placeholder: "Giới thiệu về bản thân",
        zodSchema: z.string().min(1, "kljhvdfnj"),
      },
      {
        name: "website",
        type: "url",
        label: "Website",
        placeholder: "https://example.com",
        zodSchema: z.url("URL không hợp lệ"),
      },
    ],
  },
  {
    name: "links",
    type: "array",
    label: "Danh sách Liên kết",
    fields: [
      {
        name: "url",
        type: "url",
        label: "URL",
        placeholder: "https://example.com",
        zodSchema: z.url("URL không hợp lệ"),
      },
      {
        name: "desc",
        type: "text",
        label: "Mô tả",
        placeholder: "Nhập mô tả",
        zodSchema: z.string().optional(),
      },
    ],
    arrayConfig: {
      itemLabel: (item, idx) => `Liên kết #${idx + 1}`,
      keyName: "uuid",
      actions: ["remove"],
    },
  },
];
