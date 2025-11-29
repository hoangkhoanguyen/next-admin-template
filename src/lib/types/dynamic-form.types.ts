import { type ZodType } from "zod";

export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "url"
  | "tel"
  | "password"
  | "array"
  | "group";

export interface FieldConfig {
  /** Field name (form key) */
  name: string;

  /** Field type */
  type: FieldType;

  /** Display label */
  label?: string;

  /** Placeholder text */
  placeholder?: string;

  /** Help text / description */
  description?: string;

  /** Default value cho field thường */
  defaultValue?: string | number | boolean | unknown[];

  /** Disabled state */
  disabled?: boolean;

  /** Read-only state */
  readOnly?: boolean;

  /** Custom CSS classes */
  className?: string;

  /** Zod schema cho field này (ví dụ: z.string(), z.number(), ...) */
  zodSchema?: ZodType;

  /** Input mode for mobile keyboards */
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "email" | "url";

  /** Nếu type là 'array', định nghĩa các field cho mỗi item */
  fields?: FieldConfig[];

  /** Các thuộc tính dành riêng cho field array */
  arrayConfig?: {
    actions?: Array<"add" | "remove" | "moveUp" | "moveDown" | string>;
    /** Giá trị mặc định cho mỗi item khi thêm mới vào array */
    itemDefaultValue?: Record<string, unknown>;
    /** Trạng thái không cho phép chỉnh sửa/xóa item */
    disabled?: boolean;
    readOnly?: boolean;
    /** Label cho mỗi item trong array (có thể là string hoặc hàm nhận item/index) */
    itemLabel?: string | ((item: unknown, index: number) => string);
    keyName: string;
  };

  /** Tùy chỉnh giao diện cho group/array */
  customUI?: {
    itemHeader?: (item: unknown, index: number) => string;
    itemIcon?: string;
    itemClassName?: string;
    [key: string]: unknown;
  };
}
