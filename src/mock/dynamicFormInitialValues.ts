// Dữ liệu khởi tạo mẫu cho DynamicForm dựa trên fullDemoFormConfig
const dynamicFormInitialValues = {
  name: "Nguyen Van A",
  email: "a.nguyen@example.com",
  password: "123456",
  bio: "Xin chào, tôi là A",
  website: "https://example.com",
  phone: "0123456789",
  role: undefined,
  skills: ["react", "typescript", "nextjs"],
  profile: {
    bio: "Giới thiệu cá nhân",
    website: "https://profile.com",
  },
  links: [
    {
      url: "https://link1.com",
      desc: "Mô tả liên kết 1",
    },
    {
      url: "https://link2.com",
      desc: "Mô tả liên kết 2",
    },
  ],
};

export default dynamicFormInitialValues;
