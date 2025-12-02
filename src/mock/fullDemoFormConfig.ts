import { z } from "zod";
import type { FieldConfig } from "@/lib/types/dynamic-form.types";

export const fullDemoFormConfig: FieldConfig[] = [
  {
    name: "price",
    type: "currency",
    label: "Giá tiền",
    placeholder: "Nhập giá",
    description: "Nhập giá sản phẩm bằng VNĐ. Ví dụ: 100000",
    defaultValue: 100000,
    unit: "₫",
    zodSchema: z.number().min(0, "Giá phải >= 0"),
    buttonAfter: {
      label: "Giảm 10%",
      variant: "secondary",
      onClick: (formValues) => {
        alert(`Giá sau giảm: ${Number(formValues.price) * 0.9}`);
      },
    },
  },
  {
    name: "discount",
    type: "percentage",
    label: "Giảm giá (%)",
    placeholder: "Nhập phần trăm giảm giá",
    description: "Nhập phần trăm giảm giá từ 0 đến 100. Ví dụ: 10, 20, 50...",
    defaultValue: 10,
    zodSchema: z.number().min(0).max(100, "Tối đa 100%"),
    buttonAfter: {
      label: "Đặt về 0%",
      variant: "secondary",
      onClick: (formValues) => {
        alert(`Giảm giá đã reset về 0%`);
      },
    },
  },
  {
    name: "quantity",
    type: "number",
    label: "Số lượng",
    placeholder: "Nhập số lượng",
    description: "Nhập số lượng sản phẩm. Ví dụ: 1, 2, 3...",
    defaultValue: 1,
    zodSchema: z.number().min(1, "Số lượng phải lớn hơn 0"),
    buttonAfter: {
      label: "Tăng gấp đôi",
      variant: "secondary",
      onClick: (formValues) => {
        alert(`Số lượng x2: ${Number(formValues.quantity) * 2}`);
      },
    },
  },
  {
    name: "avatar",
    type: "image-uploader",
    label: "Ảnh đại diện",
    placeholder: "Chọn ảnh đại diện",
    isMulti: false,
    accept: "image/*",
    defaultValue: null,
    zodSchema: z.any().optional(),
  },
  {
    name: "thumbnail",
    type: "imagepicker",
    label: "Ảnh sản phẩm (Single)",
    placeholder: "Chọn ảnh từ thư viện hoặc nhập URL",
    description: "Chọn 1 ảnh thumbnail cho sản phẩm",
    showPreview: true,
    showImageInfo: true,
    multiple: false,
    defaultValue: null,
    zodSchema: z
      .object({
        id: z.string().optional(),
        url: z.string(),
        thumbnail: z.string().optional(),
        alt: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        size: z.number().optional(),
        format: z.string().optional(),
        source: z.enum(["gallery", "url", "upload"]).optional(),
      })
      .nullable()
      .optional(),
  },
  {
    name: "productGallery",
    type: "imagepicker",
    label: "Thư viện ảnh sản phẩm (Multiple)",
    placeholder: "Chọn nhiều ảnh từ thư viện",
    description: "Chọn tối đa 5 ảnh cho gallery sản phẩm",
    showPreview: true,
    showImageInfo: true,
    multiple: true,
    maxImages: 5,
    minImages: 1,
    defaultValue: null,
    zodSchema: z
      .array(
        z.object({
          id: z.string().optional(),
          url: z.string(),
          thumbnail: z.string().optional(),
          alt: z.string().optional(),
          width: z.number().optional(),
          height: z.number().optional(),
          size: z.number().optional(),
          format: z.string().optional(),
          source: z.enum(["gallery", "url", "upload"]).optional(),
        })
      )
      .nullable()
      .optional(),
  },
  {
    name: "gallery",
    type: "image-uploader",
    label: "Image Uploader (để so sánh)",
    placeholder: "Chọn nhiều ảnh upload",
    isMulti: true,
    accept: "image/*",
    defaultValue: null,
    zodSchema: z.any().optional(),
  },
  {
    name: "documents",
    type: "file-uploader",
    label: "Tài liệu",
    placeholder: "Chọn file tài liệu",
    isMulti: true,
    accept: ".pdf,.doc,.docx",
    defaultValue: null,
    zodSchema: z.any().optional(),
  },
  {
    name: "birthday",
    type: "date",
    label: "Ngày sinh",
    placeholder: "Chọn ngày sinh",
    defaultValue: null,
    zodSchema: z.date({ error: "Vui lòng chọn ngày sinh" }),
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
    description: "Nhập tên đầy đủ của bạn.",
    zodSchema: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Nhập email",
    description: "Nhập địa chỉ email hợp lệ.",
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
    description: "Nhập mật khẩu có ít nhất 6 ký tự.",
    zodSchema: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  },
  {
    name: "bio",
    type: "textarea",
    label: "Giới thiệu",
    placeholder: "Giới thiệu về bản thân",
    description: "Viết một đoạn giới thiệu ngắn về bản thân bạn.",
    zodSchema: z.string(),
  },
  {
    name: "website",
    type: "url",
    label: "Website",
    placeholder: "https://example.com",
    description: "Nhập địa chỉ website cá nhân hoặc công việc.",
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
    description: "Nhập số điện thoại liên hệ của bạn.",
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
  {
    name: "isActive",
    type: "checkbox",
    label: "Kích hoạt sản phẩm",
    description: "Chọn để kích hoạt sản phẩm này.",
    defaultValue: true,
    zodSchema: z.boolean(),
  },
  {
    name: "eventTime",
    type: "datetime",
    label: "Thời gian sự kiện",
    description: "Chọn ngày giờ diễn ra sự kiện.",
    defaultValue: "2025-12-01T09:00",
    zodSchema: z.string().min(1, "Vui lòng chọn ngày giờ"),
  },
  {
    name: "remindAt",
    type: "time",
    label: "Giờ nhắc nhở",
    description: "Chọn giờ nhắc nhở mỗi ngày.",
    defaultValue: "08:00",
    zodSchema: z.string().min(1, "Vui lòng chọn giờ"),
  },
  {
    name: "productDescription",
    type: "richtext",
    label: "Mô tả sản phẩm",
    placeholder: "Nhập mô tả chi tiết về sản phẩm...",
    description:
      "Sử dụng rich text editor để định dạng nội dung, thêm hình ảnh và tạo nội dung hấp dẫn.",
    defaultValue: "<p>Sản phẩm chất lượng cao, đảm bảo uy tín.</p>",
    zodSchema: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
    customUI: {
      minHeight: "250px",
      maxHeight: "600px",
    },
  },
];
