# Admin Dashboard - Core Features Development Plan

> **Mục tiêu**: Xây dựng các core features và layout có thể tái sử dụng cho admin dashboard, không phụ thuộc vào nghiệp vụ cụ thể của dự án next-admin-template.

## 📋 Tổng Quan

Tài liệu này mô tả chiến lược và kế hoạch xây dựng các core features cho admin dashboard. Các features này được thiết kế để:

- Có tính tái sử dụng cao
- Dễ dàng tùy chỉnh và mở rộng
- Có thể áp dụng cho nhiều dự án khác nhau
- Tuân thủ best practices và design patterns

## 🎯 Chiến Lược Phát Triển

### 1. Nguyên Tắc Thiết Kế

- **Component-First Approach**: Xây dựng các component độc lập, có thể tái sử dụng
- **Atomic Design**: Chia component thành các cấp độ: Atoms → Molecules → Organisms → Templates
- **Configuration Over Hardcoding**: Ưu tiên cấu hình linh hoạt thay vì hard-code
- **Type-Safe**: Sử dụng TypeScript để đảm bảo type safety
- **Responsive & Accessible**: Đảm bảo responsive và accessibility (ARIA, keyboard navigation)
- **Performance**: Tối ưu hiệu suất (lazy loading, code splitting, memoization)

### 2. Tech Stack Core

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + **Shadcn UI**
- **API Handling**: **Axios + @tanstack/react-query (React Query)**
- **Data Table**: **@tanstack/react-table (TanStack Table)**
- **Form Handling**: React Hook Form + Zod
- **UI Components**: **Shadcn UI** (built on Radix UI)
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Query (server state) + Zustand/Context (client state nếu cần)
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## 📦 Core Features Checklist

### Phase 1: Foundation & Layout System

#### 1.1 Design System Foundation

- [ ] **Shadcn UI Setup**
  - [ ] Initialize shadcn-ui (`npx shadcn@latest init`)
  - [ ] Configure components.json
  - [ ] Setup CSS variables trong globals.css
  - [ ] Configure Tailwind với shadcn preset
- [ ] **Colors & Theme**
  - [ ] Setup Shadcn color system (HSL-based)
  - [ ] Dark mode / Light mode support (next-themes)
  - [ ] Theme provider và theme switching
  - [ ] Custom color tokens nếu cần
- [ ] **Typography System**
  - [ ] Font configuration với Geist/Inter (đã có sẵn)
  - [ ] Typography scale theo Shadcn convention
  - [ ] Line heights và spacing chuẩn
- [ ] **Spacing & Grid System**
  - [ ] Tailwind config mở rộng (đã có trong shadcn)
  - [ ] Container sizes
  - [ ] Breakpoints chuẩn

#### 1.2 Core Layout Components

- [ ] **AppShell / AdminLayout**
  - [ ] Sidebar navigation (collapsible)
  - [ ] Top header/navbar
  - [ ] Main content area
  - [ ] Footer (optional)
  - [ ] Responsive layout (mobile menu)
- [ ] **Sidebar Component**
  - [ ] Multi-level navigation menu
  - [ ] Active state indication
  - [ ] Icon support
  - [ ] Collapse/expand functionality
  - [ ] Mobile overlay variant
- [ ] **Header Component**
  - [ ] User profile dropdown
  - [ ] Notifications bell
  - [ ] Search bar (global)
  - [ ] Breadcrumbs
  - [ ] Theme toggle button

#### 1.3 Navigation System

- [ ] **Navigation Configuration**
  - [ ] Type-safe navigation config
  - [ ] Role-based menu visibility
  - [ ] Dynamic route generation
  - [ ] Active link detection
- [ ] **Breadcrumbs**
  - [ ] Auto-generate from route
  - [ ] Custom breadcrumb support
  - [ ] Click navigation

### Phase 2: UI Components Library

#### 2.1 Basic Components (Atoms)

> **Note**: Sử dụng Shadcn UI components, customize theo nhu cầu

- [ ] **Button** (`npx shadcn@latest add button`)
  - [ ] Variants (default, secondary, outline, ghost, link, destructive)
  - [ ] Sizes (sm, default, lg, icon)
  - [ ] States (default, hover, active, disabled, loading)
  - [ ] Icon support với lucide-react
- [ ] **Input** (`npx shadcn@latest add input`)
  - [ ] Text input với validation states
  - [ ] Password input với show/hide toggle (custom extension)
  - [ ] Number input
  - [ ] Textarea (`npx shadcn@latest add textarea`)
  - [ ] Input với prefix/suffix icons (custom extension)
- [ ] **Select & Dropdown** (`npx shadcn@latest add select`)
  - [ ] Single select (Shadcn Select)
  - [ ] Multi select (custom extension hoặc dùng Combobox)
  - [ ] Combobox (`npx shadcn@latest add combobox`) - searchable
  - [ ] Grouped options
  - [ ] Custom option rendering
- [ ] **Checkbox & Radio**
  - [ ] Checkbox (`npx shadcn@latest add checkbox`)
  - [ ] Radio Group (`npx shadcn@latest add radio-group`)
  - [ ] Switch/Toggle (`npx shadcn@latest add switch`)
- [ ] **Badge & Tag** (`npx shadcn@latest add badge`)
  - [ ] Status badges (default, secondary, destructive, outline)
  - [ ] Removable tags (custom extension)
  - [ ] Count badges
- [ ] **Avatar** (`npx shadcn@latest add avatar`)
  - [ ] Image avatar với fallback
  - [ ] Initials avatar
  - [ ] Custom sizes (extend component)
  - [ ] Status indicator (custom extension)
- [ ] **Icon**
  - [ ] Sử dụng lucide-react directly
  - [ ] Icon wrapper component nếu cần
  - [ ] Consistent sizing system

#### 2.2 Feedback Components

- [ ] **Alert** (`npx shadcn@latest add alert`)
  - [ ] Variants (default, destructive)
  - [ ] Dismissible (custom extension)
  - [ ] With actions
- [ ] **Toast/Notification** (`npx shadcn@latest add toast` + `npx shadcn@latest add sonner`)
  - [ ] Sonner for better toast experience (recommended)
  - [ ] Toast provider và useToast hook
  - [ ] Position variants
  - [ ] Auto-dismiss với timer
  - [ ] Action buttons
- [ ] **Modal/Dialog** (`npx shadcn@latest add dialog`)
  - [ ] Basic dialog
  - [ ] Alert Dialog (`npx shadcn@latest add alert-dialog`)
  - [ ] Size variants (custom extension)
  - [ ] Nested modals support
  - [ ] Focus trap và keyboard navigation (built-in)
- [ ] **Drawer/Sidebar Panel** (`npx shadcn@latest add drawer`)
  - [ ] Sheet component (`npx shadcn@latest add sheet`)
  - [ ] Position (left, right, top, bottom)
  - [ ] Size variants
  - [ ] Overlay backdrop (built-in)
- [ ] **Loading States**
  - [ ] Spinner component (custom hoặc lucide icons)
  - [ ] Skeleton (`npx shadcn@latest add skeleton`)
  - [ ] Progress (`npx shadcn@latest add progress`)
  - [ ] Full-page loader (custom)

#### 2.3 Data Display Components

- [ ] **Table** (`npx shadcn@latest add table`)
  - [ ] Basic table với styling (Shadcn Table)
  - [ ] Data Table với TanStack Table (`npx shadcn@latest add data-table`)
  - [ ] Sortable columns
  - [ ] Row selection (single, multiple)
  - [ ] Pagination (integrate với pagination component)
  - [ ] Loading state (skeleton)
  - [ ] Empty state
  - [ ] Expandable rows (custom extension)
  - [ ] Fixed header
  - [ ] Responsive (mobile card view - custom)
- [ ] **Card** (`npx shadcn@latest add card`)
  - [ ] Basic card container
  - [ ] Card với header/footer/content sections
  - [ ] Card variations (extend styles)
- [ ] **Tabs** (`npx shadcn@latest add tabs`)
  - [ ] Horizontal tabs (default)
  - [ ] Vertical tabs (custom variant)
  - [ ] Icon support (custom)
  - [ ] Badge/count support (custom)
- [ ] **Accordion** (`npx shadcn@latest add accordion`)
  - [ ] Single expand (type="single")
  - [ ] Multiple expand (type="multiple")
  - [ ] Icon customization (built-in)
- [ ] **List**
  - [ ] Simple list (custom với ul/li styled)
  - [ ] List với actions
  - [ ] Draggable list (dnd-kit integration)

#### 2.4 Form Components (Molecules)

- [ ] **Form** (`npx shadcn@latest add form`)
  - [ ] Form component với React Hook Form + Zod integration
  - [ ] FormField, FormItem, FormLabel, FormControl
  - [ ] FormDescription (helper text)
  - [ ] FormMessage (error message)
  - [ ] Required indicator (custom)
- [ ] **Dynamic Form System** ⭐ _See DYNAMIC_FORMS.md for details_
  - [ ] Config-driven form renderer
  - [ ] Auto Zod schema generation từ config
  - [ ] Support tất cả field types (text, select, date, file, etc.)
  - [ ] Conditional field rendering (show/hide based on values)
  - [ ] Multi-section forms
  - [ ] Grid layout support
  - [ ] API-driven forms (fetch config từ backend)
  - [ ] Form builder UI (optional - Phase 5)
- [ ] **Form Layout**
  - [ ] Vertical form (default)
  - [ ] Horizontal form (custom layout)
  - [ ] Inline form (custom layout)
  - [ ] Grid layout support
  - [ ] Multi-step form wrapper
- [ ] **File Upload**
  - [ ] Single file upload (custom component)
  - [ ] Multiple files upload
  - [ ] Drag & drop area (use react-dropzone)
  - [ ] Preview (image, file name)
  - [ ] Progress indicator
- [ ] **Date & Time Picker**
  - [ ] Calendar (`npx shadcn@latest add calendar`) - react-day-picker
  - [ ] Date picker (`npx shadcn@latest add date-picker`)
  - [ ] Date range picker (extend calendar)
  - [ ] DateTime picker (combine date + time)
  - [ ] Popover (`npx shadcn@latest add popover`) for picker UI
- [ ] **Rich Text Editor** (Optional - Phase 3)
  - [ ] Tiptap / Lexical integration
  - [ ] Basic formatting (bold, italic, underline)
  - [ ] Lists (ordered, unordered)
  - [ ] Links
  - [ ] Image upload

### Phase 3: Advanced Features & Utilities

#### 3.1 Data Management

- [ ] **Pagination Component** (`npx shadcn@latest add pagination`)
  - [ ] Page numbers
  - [ ] Previous/Next buttons
  - [ ] Page size selector (custom extension)
  - [ ] Jump to page (custom)
- [ ] **Search & Filter**
  - [ ] Global search với Command (`npx shadcn@latest add command`)
  - [ ] Input search component
  - [ ] Advanced filter panel (custom với Sheet/Popover)
  - [ ] Filter tags/chips (Badge component)
  - [ ] Saved filters
- [ ] **Sorting**
  - [ ] Sort indicator (built-in với Data Table)
  - [ ] Multi-column sort
  - [ ] Sort state management (TanStack Table)

#### 3.2 Charts & Visualization

- [ ] **Chart Components**
  - [ ] Line chart
  - [ ] Bar chart
  - [ ] Pie/Donut chart
  - [ ] Area chart
  - [ ] Chart wrapper với loading state
- [ ] **Stats/Metrics Cards**
  - [ ] KPI card
  - [ ] Trend indicators (up/down)
  - [ ] Comparison metrics

#### 3.3 Utility Components

- [ ] **Empty State**
  - [ ] Empty illustration (lucide icons hoặc custom SVG)
  - [ ] Custom message
  - [ ] Call-to-action button
- [ ] **Error Boundary**
  - [ ] Global error boundary (React error boundary)
  - [ ] Error fallback UI
  - [ ] Error reporting integration
- [ ] **Copy to Clipboard**
  - [ ] Copy button component (custom với clipboard API)
  - [ ] Success feedback (toast)
- [ ] **Tooltip & Popover**
  - [ ] Tooltip (`npx shadcn@latest add tooltip`)
  - [ ] Popover (`npx shadcn@latest add popover`)
  - [ ] Hover Card (`npx shadcn@latest add hover-card`)
  - [ ] Position variants (built-in)

#### 3.4 Hooks & Utilities

- [ ] **Custom Hooks**
  - [ ] `useDisclosure` (modal, drawer open/close)
  - [ ] `useToast` (toast notifications)
  - [ ] `useLocalStorage` / `useSessionStorage`
  - [ ] `useDebounce` / `useThrottle`
  - [ ] `useMediaQuery` (responsive)
  - [ ] `useClickOutside`
  - [ ] `useKeyPress`
- [ ] **API Hooks (React Query)**
  - [ ] Query hooks factory pattern
  - [ ] Mutation hooks với auto-invalidation
  - [ ] Infinite query hooks (pagination)
  - [ ] Optimistic update helpers
  - [ ] Query key factory
- [ ] **Utility Functions**
  - [ ] Form validation helpers
  - [ ] Date formatting (date-fns)
  - [ ] Number formatting (currency, percentage)
  - [ ] String utilities
  - [ ] Axios interceptor utilities
  - [ ] API error handlers
  - [ ] Zod schema helpers

### Phase 4: Patterns & Templates

#### 4.1 Common Page Patterns

- [ ] **List/Index Page Template**
  - [ ] Header với title + actions
  - [ ] Search và filters
  - [ ] Data table
  - [ ] Pagination
- [ ] **Create/Edit Form Page Template**
  - [ ] Form layout
  - [ ] Validation
  - [ ] Save/Cancel actions
  - [ ] Unsaved changes warning
- [ ] **Detail/View Page Template**
  - [ ] Header với breadcrumb
  - [ ] Info sections
  - [ ] Related data tabs
  - [ ] Action buttons
- [ ] **Dashboard Page Template**
  - [ ] Stats grid
  - [ ] Charts section
  - [ ] Recent activity list
  - [ ] Quick actions

#### 4.2 Authentication Flow (UI Only)

- [ ] **Login Page**
  - [ ] Login form
  - [ ] Remember me
  - [ ] Forgot password link
- [ ] **Register Page** (if needed)
- [ ] **Forgot Password Page**
- [ ] **Reset Password Page**

#### 4.3 Settings Pages

- [ ] **Profile Settings Template**
  - [ ] Avatar upload
  - [ ] Personal info form
  - [ ] Password change
- [ ] **Preferences Template**
  - [ ] Theme settings
  - [ ] Language settings
  - [ ] Notification preferences

### Phase 5: Advanced Features

#### 5.1 Role-Based Access Control (UI)

- [ ] **Permission HOC/Component**
  - [ ] Hide/show based on permissions
  - [ ] Disable based on permissions
- [ ] **Route Protection**
  - [ ] Middleware for protected routes
  - [ ] Redirect logic

#### 5.2 Multi-language Support

- [ ] **i18n Setup**
  - [ ] next-intl or react-i18next
  - [ ] Language switcher
  - [ ] Translation files structure
  - [ ] RTL support (optional)

#### 5.3 Performance Optimization

- [ ] **Code Splitting**
  - [ ] Dynamic imports cho heavy components
  - [ ] Route-based splitting
- [ ] **Memoization**
  - [ ] React.memo cho expensive components
  - [ ] useMemo và useCallback optimization
- [ ] **Image Optimization**
  - [ ] Next.js Image component wrapper
  - [ ] Lazy loading images

#### 5.4 Developer Experience

- [ ] **Storybook** (Optional)
  - [ ] Setup Storybook
  - [ ] Stories cho core components
- [ ] **Component Documentation**
  - [ ] Props documentation
  - [ ] Usage examples
  - [ ] Best practices
- [ ] **Type Definitions**
  - [ ] Shared types file
  - [ ] API response types
  - [ ] Component prop types

## 📁 Cấu Trúc Thư Mục Đề Xuất

```
app/
├── (admin)/                    # Admin route group
│   ├── layout.tsx             # Admin layout wrapper
│   ├── dashboard/             # Dashboard pages
│   ├── settings/              # Settings pages
│   └── ...
├── (auth)/                    # Auth route group
│   ├── login/
│   └── ...
└── globals.css

components/
├── ui/                        # Shadcn UI components (auto-generated)
│   ├── button.tsx
│   ├── input.tsx
│   ├── table.tsx
│   └── ...
├── extended/                  # Extended Shadcn components
│   ├── data-table/           # TanStack Table + Shadcn
│   │   ├── DataTable.tsx
│   │   ├── DataTablePagination.tsx
│   │   ├── DataTableToolbar.tsx
│   │   └── columns.tsx
│   ├── file-upload/
│   └── ...
├── layout/                    # Layout components
│   ├── AdminLayout/
│   ├── Sidebar/
│   ├── Header/
│   └── ...
├── forms/                     # Form components (molecules)
│   ├── FormField/
│   ├── FileUpload/
│   └── ...
├── charts/                    # Chart components (Recharts)
└── patterns/                  # Page patterns/templates
    ├── ListPage/
    ├── FormPage/
    └── ...

lib/
├── api/                       # API layer (Axios)
│   ├── client.ts             # Axios instance
│   ├── interceptors.ts       # Request/Response interceptors
│   └── endpoints/            # API endpoints
│       ├── users.ts
│       ├── products.ts
│       └── ...
├── hooks/                     # Custom hooks
│   ├── use-disclosure.ts
│   ├── use-debounce.ts
│   └── ...
├── queries/                   # React Query hooks
│   ├── keys.ts               # Query key factory
│   ├── users/                # User-related queries
│   │   ├── use-users.ts
│   │   ├── use-user.ts
│   │   └── mutations.ts
│   └── products/
│       └── ...
├── schemas/                   # Zod schemas
│   ├── user.schema.ts
│   ├── product.schema.ts
│   ├── api-response.schema.ts
│   └── form-configs/         # Dynamic form configs
│       ├── user-form.config.ts
│       ├── product-form.config.ts
│       └── ...
├── utils/                     # Utility functions
│   ├── cn.ts                 # Class name utility
│   ├── format.ts             # Formatters
│   ├── error-handler.ts
│   └── form-schema-generator.ts  # Auto Zod from form config
├── constants/                 # Constants
│   ├── api.ts                # API constants
│   └── routes.ts
└── types/                     # Shared types
    ├── api.ts
    ├── entities.ts
    ├── dynamic-form.types.ts # Dynamic form types
    └── ...

providers/
├── ThemeProvider.tsx          # next-themes
├── QueryProvider.tsx          # React Query Provider
└── Providers.tsx              # Combined providers

config/
├── navigation.ts              # Navigation configuration
├── theme.ts                   # Theme configuration
└── site.ts                    # Site configuration

docs/                          # Documentation
├── ADMIN_CORE_FEATURES.md     # This file
├── API_INTEGRATION.md         # API integration guide
├── DYNAMIC_FORMS.md           # Dynamic forms guide
└── components/                # Component docs
```

## 🚀 Kế Hoạch Triển Khai

### Sprint 1 (Tuần 1-2): Foundation

**Mục tiêu**: Setup Shadcn UI và layout cơ bản

1. **Initialize Shadcn UI** (`npx shadcn@latest init`)
2. **Setup theme provider** với next-themes
3. **Install core components**: button, card, badge, avatar, separator
4. **Xây dựng AdminLayout** với Sidebar và Header
5. **Tạo navigation system** với navigation-menu hoặc custom
6. **Install layout components**: sheet, dropdown-menu, command
7. **Implement responsive behavior** và mobile menu

**Deliverables**:

- Shadcn UI configured và working
- Dark/Light mode switching
- Working admin layout với sidebar
- Responsive navigation
- Theme customization ready

**Components to add**:

```bash
npx shadcn@latest add button card badge avatar separator
npx shadcn@latest add sheet dropdown-menu command
npx shadcn@latest add navigation-menu breadcrumb
```

### Sprint 2 (Tuần 3-4): Basic UI Components

**Mục tiêu**: Install và customize Shadcn components

1. **Form inputs**: input, textarea, select, combobox
2. **Form controls**: checkbox, radio-group, switch, form, label
3. **Data display**: tabs, accordion, tooltip, hover-card
4. **Customize components** theo nhu cầu (add variants, extend styles)

**Deliverables**:

- All basic Shadcn components installed
- Extended components với custom variants
- Component usage documentation

**Components to add**:

```bash
npx shadcn@latest add input textarea select combobox
npx shadcn@latest add checkbox radio-group switch form label
npx shadcn@latest add tabs accordion tooltip hover-card popover
```

### Sprint 3 (Tuần 5-6): Feedback & Forms

**Mục tiêu**: Feedback components và form system

1. **Feedback components**: dialog, alert-dialog, toast, sonner, alert
2. **Drawer/Sheet** cho sidebar panels
3. **Loading states**: skeleton, progress
4. **Form system** với React Hook Form + Zod integration
5. **Dynamic Form System** (config-driven forms)
6. **Date picker** và calendar components
7. **File upload** component (custom extension)

**Deliverables**:

- Complete feedback system
- Form handling với validation
- **Dynamic Form Renderer** với auto schema generation
- Date/time pickers
- File upload component

**Components to add**:

```bash
npx shadcn@latest add dialog alert-dialog toast sonner alert
npx shadcn@latest add drawer sheet skeleton progress
npx shadcn@latest add calendar date-picker
```

**Dynamic Form Implementation**:

- Setup form types và config structure
- Implement form schema generator (Zod auto-generation)
- Create DynamicForm và DynamicField components
- Add conditional field logic
- Create example form configs (user, product, order)

### Sprint 4 (Tuần 7-8): Data Display & Tables

**Mục tiêu**: Advanced data display components

1. **Table components**: table, data-table (TanStack Table integration)
2. **Pagination** component
3. **Command palette** cho search
4. **Context menu** và dropdown-menu
5. **Empty state** và Error boundary components
6. **Customize data-table** với sorting, filtering, selection

**Deliverables**:

- Production-ready data table với all features
- Search/filter system
- Complete data handling components

**Components to add**:

```bash
npx shadcn@latest add table pagination
npx shadcn@latest add context-menu menubar
npm install @tanstack/react-table
```

### Sprint 5 (Tuần 9-10): Advanced Features

**Mục tiêu**: Charts, utilities và patterns

1. Chart components integration
2. Stats/Metrics cards
3. Custom hooks library
4. Page templates (List, Form, Detail, Dashboard)

**Deliverables**:

- Chart library
- Reusable page patterns
- Complete hooks library

### Sprint 6 (Tuần 11-12): Polish & Documentation

**Mục tiêu**: Hoàn thiện và tài liệu hóa

1. Performance optimization
2. Accessibility improvements
3. Complete documentation
4. Example pages
5. Migration guide for new projects

**Deliverables**:

- Optimized codebase
- Complete documentation
- Ready-to-use templates

## 📝 Dependencies Cần Cài Đặt

```bash
# ========================================
# BƯỚC 1: Initialize Shadcn UI
# ========================================
npx shadcn@latest init
# Chọn: Default style, Base color, CSS variables: Yes

# Shadcn sẽ tự động cài đặt:
# - tailwindcss-animate
# - class-variance-authority
# - clsx
# - tailwind-merge
# - lucide-react (cho icons)
# - @radix-ui/* (các primitive components)

# ========================================
# BƯỚC 2: Install Core Components từ Shadcn
# ========================================
# Form & Inputs
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add combobox
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add switch
npx shadcn@latest add form
npx shadcn@latest add label

# Feedback
npx shadcn@latest add alert
npx shadcn@latest add toast
npx shadcn@latest add sonner
npx shadcn@latest add dialog
npx shadcn@latest add alert-dialog
npx shadcn@latest add sheet
npx shadcn@latest add drawer
npx shadcn@latest add skeleton
npx shadcn@latest add progress

# Data Display
npx shadcn@latest add table
npx shadcn@latest add card
npx shadcn@latest add tabs
npx shadcn@latest add accordion
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add separator

# Utility
npx shadcn@latest add tooltip
npx shadcn@latest add popover
npx shadcn@latest add hover-card
npx shadcn@latest add dropdown-menu
npx shadcn@latest add context-menu
npx shadcn@latest add command
npx shadcn@latest add pagination

# Date & Calendar
npx shadcn@latest add calendar
npx shadcn@latest add date-picker

# Navigation
npx shadcn@latest add navigation-menu
npx shadcn@latest add breadcrumb
npx shadcn@latest add menubar

# ========================================
# BƯỚC 3: Core Dependencies
# ========================================
# API Handling - React Query + Axios
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install axios

# Data Table - TanStack Table
npm install @tanstack/react-table

# Form handling (React Hook Form + Zod đã có khi add form)
npm install react-hook-form zod @hookform/resolvers

# Theme
npm install next-themes

# Date utilities
npm install date-fns

# Charts
npm install recharts

# ========================================
# BƯỚC 4: Optional Dependencies
# ========================================
# File upload
npm install react-dropzone

# Drag & Drop
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Client state management (nếu cần thêm ngoài React Query)
npm install zustand

# i18n
npm install next-intl

# Rich Text Editor (Phase 3)
npm install @tiptap/react @tiptap/starter-kit @tiptap/pm
# hoặc
npm install lexical @lexical/react

# ========================================
# BƯỚC 5: Dev Dependencies (Optional)
# ========================================
# Mock Service Worker (API mocking cho development)
npm install -D msw

# Testing (nếu cần)
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @tanstack/react-query-devtools
```

## 🎨 Shadcn UI Setup Guide

### Initial Setup Steps

1. **Initialize Shadcn**

```bash
npx shadcn@latest init
```

Sẽ hỏi các câu hỏi:

- Style: **Default**
- Base color: **Slate** (hoặc chọn màu khác)
- CSS variables: **Yes**

2. **File sẽ được tạo/cập nhật:**

- `components.json` - Shadcn config
- `app/globals.css` - CSS variables cho theme
- `lib/utils.ts` - cn() utility function
- `tailwind.config.ts` - Extended config

3. **Theme Provider Setup**

```bash
npm install next-themes
```

Tạo theme provider wrapper cho dark mode support.

### Component Organization với Shadcn

```
components/
├── ui/                        # Shadcn components (auto-generated)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
├── extended/                  # Extended Shadcn components
│   ├── data-table/           # TanStack Table + Shadcn UI
│   │   ├── DataTable.tsx
│   │   ├── DataTablePagination.tsx
│   │   ├── DataTableToolbar.tsx
│   │   ├── DataTableColumnHeader.tsx
│   │   └── columns.tsx
│   ├── file-upload/          # Custom file upload
│   ├── date-range-picker/    # Extended date picker
│   └── ...
├── layout/                    # Layout components
│   ├── admin-layout.tsx
│   ├── sidebar.tsx
│   └── ...
└── patterns/                  # Page patterns
    ├── list-page.tsx
    └── ...

lib/
├── api/                       # Axios configuration
│   ├── client.ts             # Axios instance + interceptors
│   └── endpoints/
├── queries/                   # React Query hooks
│   ├── keys.ts               # Query key factory
│   └── [entity]/
│       ├── use-[entity].ts   # Query hooks
│       └── mutations.ts      # Mutation hooks
└── schemas/                   # Zod validation schemas
    └── [entity].schema.ts
```

## 🎨 Design References

### Inspiration

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Stripe Dashboard](https://dashboard.stripe.com/)
- [**Shadcn UI**](https://ui.shadcn.com/) - **PRIMARY REFERENCE**
- [Shadcn UI Examples](https://ui.shadcn.com/examples) - Dashboard examples
- [Taxonomy](https://tx.shadcn.com/) - Full-stack app template with Shadcn
- [Tremor](https://www.tremor.so/) - Charts and dashboards

### Shadcn UI Resources

- [Documentation](https://ui.shadcn.com/docs)
- [Components](https://ui.shadcn.com/docs/components)
- [Themes](https://ui.shadcn.com/themes)
- [Charts Guide](https://ui.shadcn.com/docs/components/chart)
- [Dark Mode](https://ui.shadcn.com/docs/dark-mode)

### Colors & Style Guide

- Shadcn's HSL-based color system
- Dark mode support via next-themes
- Clean, modern, minimal aesthetic
- High contrast cho accessibility
- Consistent spacing scale (Tailwind)
- Professional typography

## 📊 Success Metrics

- [ ] Tất cả core components đã được implement và test
- [ ] Documentation đầy đủ cho mỗi component
- [ ] Responsive trên mobile, tablet, desktop
- [ ] Accessibility score > 90 (Lighthouse)
- [ ] Performance score > 90 (Lighthouse)
- [ ] Type-safe 100% (no `any` types)
- [ ] Có thể tạo một admin page mới trong < 30 phút

## 🔄 Maintenance & Updates

### Regular Tasks

- [ ] Update dependencies monthly
- [ ] Review và refactor code
- [ ] Performance audit quarterly
- [ ] Accessibility audit quarterly
- [ ] Documentation updates khi có thay đổi

### Future Enhancements

- [ ] Animation system (Framer Motion?)
- [ ] Advanced data grid với virtual scrolling
- [ ] Drag & drop system
- [ ] Command palette (⌘K)
- [ ] Offline support (PWA)
- [ ] Print-friendly views
- [ ] Export functionality (PDF, Excel)

## 📚 Resources & Learning

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Table](https://tanstack.com/table/latest)

### Best Practices

- [React Best Practices](https://react.dev/learn)
- [Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

**Last Updated**: 2025-11-22  
**Version**: 1.0  
**Maintainer**: Admin Team
