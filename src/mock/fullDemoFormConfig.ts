import { z } from "zod";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";

export const fullDemoFormConfig: FieldConfig[] = [
  {
    name: "birthday",
    type: "date",
    label: "Ngày sinh",
    placeholder: "Chọn ngày sinh",
    defaultValue: null,
    zodSchema: z.date({ error: "Vui lòng chọn ngày sinh" }),
  },
  {
    name: "gender",
    type: "radio-group",
    label: "Giới tính",
    options: [
      { label: "Nam", value: "male" },
      { label: "Nữ", value: "female" },
      { label: "Khác", value: "other" },
    ],
    // defaultValue: "male",
    zodSchema: z.string().min(1, "Vui lòng chọn giới tính"),
  },
  {
    name: "isActive",
    type: "switch",
    label: "Kích hoạt tài khoản",
    defaultValue: false,
    zodSchema: z.boolean(),
  },
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
    buttonAfter: {
      label: "Kiểm tra",
      variant: "default",
      onClick: (formValues) => {
        alert(`Kiểm tra email: ${formValues.email}`);
      },
    },
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
    buttonAfter: {
      label: "Mở",
      variant: "secondary",
      onClick: (formValues) => {
        window.open(formValues.website as string, "_blank");
      },
    },
  },
  {
    name: "phone",
    type: "tel",
    label: "Số điện thoại",
    placeholder: "Nhập số điện thoại",
    zodSchema: z.string().min(8, "Số điện thoại không hợp lệ"),
  },
  {
    name: "role",
    type: "select-single",
    label: "Vai trò",
    placeholder: "Chọn vai trò...",
    options: [
      { label: "Admin", value: "admin" },
      { label: "Editor", value: "editor" },
      { label: "Viewer", value: "viewer" },
    ],
    zodSchema: z.string().min(1, "Vui lòng chọn vai trò"),
  },
  {
    name: "skills",
    type: "select-multi",
    label: "Kỹ năng",
    placeholder: "Chọn kỹ năng...",
    options: [
      { label: "React", value: "react" },
      { label: "TypeScript", value: "typescript" },
      { label: "Next.js", value: "nextjs" },
      { label: "Node.js", value: "nodejs" },
      { label: "Python", value: "python" },
      { label: "Docker", value: "docker" },
    ],
    zodSchema: z.array(z.string()).min(1, "Chọn ít nhất 1 kỹ năng"),
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
        type: "textarea",
        label: "Mô tả",
        placeholder: "Nhập mô tả",
        zodSchema: z.string().optional(),
      },
    ],
    arrayConfig: {
      itemLabel: (item, idx) => `Liên kết #${idx + 1}`,
      keyName: "uuid",
      actions: ["remove"],
      arraySchema(schema) {
        return schema.min(1, "Phải có ít nhất 1 liên kết");
      },
    },
  },
];
