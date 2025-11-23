# Phase 1: Project Foundation & Setup

> **Goal:** Set up the Next.js project with all necessary dependencies and folder structure
>
> **Duration:** 1 week (5-7 days)  
> **Dependencies:** None (starting from scratch)

---

## 📋 Overview

This phase establishes the foundation for the entire admin template:

- Initialize Next.js 15 project with App Router
- Configure TypeScript with strict mode
- Set up Tailwind CSS 4 + Shadcn UI
- Install all required dependencies
- Create folder structure
- Configure development tools (ESLint, Prettier)

---

## 🎯 Deliverables Checklist

### Core Setup

- [ ] Next.js 15 project created
- [ ] TypeScript configured (strict mode)
- [ ] Tailwind CSS 4 installed and configured
- [ ] Shadcn UI initialized
- [ ] Environment variables template created
- [ ] Git repository initialized with .gitignore

### Development Tools

- [ ] ESLint configured
- [ ] Prettier configured
- [ ] VS Code settings (recommended extensions)
- [ ] Package.json scripts set up

### Folder Structure

- [ ] `/app` - Next.js App Router pages
- [ ] `/components` - React components
- [ ] `/lib` - Utilities and helpers
- [ ] `/types` - TypeScript type definitions
- [ ] `/public` - Static assets
- [ ] `/docs` - Documentation

### Verification

- [ ] `npm run dev` starts successfully
- [ ] TypeScript compiles without errors
- [ ] Tailwind CSS works (test with utility classes)
- [ ] Shadcn components can be added
- [ ] ESLint runs without errors

---

## 🛠️ Step-by-Step Implementation

### Step 1: Create Next.js Project (10 min)

```bash
# Create Next.js 15 app with TypeScript, Tailwind, App Router
npx create-next-app@latest next-admin-template \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd next-admin-template
```

**What this does:**

- Creates Next.js 15 project
- Enables TypeScript
- Installs Tailwind CSS
- Uses App Router (not Pages Router)
- Sets up path alias `@/` for imports

**Verify:**

```bash
npm run dev
# Open http://localhost:3000
# Should see Next.js welcome page
```

---

### Step 2: Configure TypeScript (5 min)

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    },
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Key Settings:**

- `strict: true` - Enable all strict checks
- `noUnusedLocals/Parameters` - Catch unused variables
- `noImplicitReturns` - Ensure all code paths return
- Path alias `@/*` for clean imports

**Verify:**

```bash
npx tsc --noEmit
# Should compile without errors
```

---

### Step 3: Configure Tailwind CSS 4 (10 min)

**File:** `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

**File:** `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Install Tailwind plugin:**

```bash
npm install tailwindcss-animate
```

**Verify:**
Create test page with Tailwind classes and check in browser.

---

### Step 4: Initialize Shadcn UI (15 min)

```bash
# Initialize Shadcn UI
npx shadcn@latest init
```

**Configuration prompts:**

```
✔ Would you like to use TypeScript? … yes
✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Slate
✔ Where is your global CSS file? … app/globals.css
✔ Would you like to use CSS variables for colors? … yes
✔ Are you using a custom tailwind prefix eg. tw-? … no
✔ Where is your tailwind.config.js located? … tailwind.config.ts
✔ Configure the import alias for components: … @/components
✔ Configure the import alias for utils: … @/lib/utils
✔ Are you using React Server Components? … yes
```

**This creates:**

- `components.json` - Shadcn config
- `lib/utils.ts` - Utility functions (cn helper)

**Install initial components:**

```bash
# Core UI components needed for Phase 1
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add card
npx shadcn@latest add toast
npx shadcn@latest add form
```

**Verify:**

```typescript
// Test in app/page.tsx
import { Button } from "@/components/ui/button";

export default function Home() {
  return <Button>Test Button</Button>;
}
```

---

### Step 5: Install Core Dependencies (10 min)

```bash
# Form handling
npm install react-hook-form zod @hookform/resolvers

# Data fetching
npm install @tanstack/react-query axios

# Tables
npm install @tanstack/react-table

# Icons
npm install lucide-react

# Utilities
npm install clsx tailwind-merge
npm install date-fns

# Development
npm install -D @types/node
```

**Purpose:**

- `react-hook-form` + `zod` - Form validation
- `@tanstack/react-query` - API calls & caching
- `@tanstack/react-table` - Data tables
- `lucide-react` - Icons
- `clsx` + `tailwind-merge` - Utility classes
- `date-fns` - Date formatting

**Verify:**

```bash
npm list
# Check all packages installed
```

---

### Step 6: Create Folder Structure (10 min)

```bash
# Create folders
mkdir -p app/(auth)/(dashboard)
mkdir -p components/{ui,layout,forms,tables,dashboard}
mkdir -p lib/{auth,api,utils,dynamic-forms,tables}
mkdir -p types
mkdir -p public/{images,icons}
mkdir -p docs/phases
```

**Final structure:**

```
next-admin-template/
├── app/
│   ├── (auth)/              # Auth pages (login, register)
│   ├── (dashboard)/         # Protected dashboard pages
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Shadcn components
│   ├── layout/              # Layout components (Sidebar, Topbar)
│   ├── forms/               # Dynamic form components
│   ├── tables/              # Data table components
│   └── dashboard/           # Dashboard widgets
├── lib/
│   ├── auth/                # Authentication utilities
│   ├── api/                 # API client setup
│   ├── utils/               # Helper functions
│   ├── dynamic-forms/       # Form system
│   └── tables/              # Table utilities
├── types/
│   ├── index.ts             # Shared types
│   ├── auth.ts              # Auth types
│   ├── product.ts           # Product types
│   └── order.ts             # Order types
├── public/
│   ├── images/              # Images
│   └── icons/               # Icons
├── docs/
│   ├── phases/              # Phase documents
│   └── dynamic-forms/       # Form documentation
├── .env.example             # Environment template
├── .env.local               # Local environment (gitignored)
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── components.json
├── eslint.config.mjs
├── postcss.config.mjs
└── README.md
```

---

### Step 7: Environment Variables Setup (5 min)

**File:** `.env.example`

```bash
# App
NEXT_PUBLIC_APP_NAME="Toy Store Admin"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API
NEXT_PUBLIC_API_URL=http://localhost:3001/api
API_SECRET_KEY=your-secret-key-here

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
JWT_SECRET=your-jwt-secret-here

# Database (for future)
DATABASE_URL=postgresql://user:password@localhost:5432/toystore

# Optional: Third-party services
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

**File:** `.env.local` (create and gitignore)

```bash
# Copy from .env.example and fill in actual values
cp .env.example .env.local
```

**Update `.gitignore`:**

```
.env.local
.env*.local
```

---

### Step 8: Configure ESLint & Prettier (10 min)

**File:** `eslint.config.mjs` (update existing)

```javascript
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];

export default eslintConfig;
```

**File:** `.prettierrc` (create)

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**File:** `.prettierignore` (create)

```
node_modules
.next
out
dist
build
.env*
*.log
package-lock.json
pnpm-lock.yaml
```

**Install Prettier:**

```bash
npm install -D prettier eslint-config-prettier
```

**Add scripts to `package.json`:**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "type-check": "tsc --noEmit"
  }
}
```

**Verify:**

```bash
npm run lint
npm run format
npm run type-check
```

---

### Step 9: VS Code Configuration (5 min)

**File:** `.vscode/settings.json` (create)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

**File:** `.vscode/extensions.json` (create)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "usernamehw.errorlens"
  ]
}
```

---

### Step 10: Initialize Git Repository (5 min)

```bash
# Initialize Git
git init

# Create .gitignore (should exist from create-next-app)
# Verify it includes:
# - node_modules
# - .next
# - .env*.local
# - *.log

# Initial commit
git add .
git commit -m "chore: initial project setup with Next.js 15, TypeScript, Tailwind CSS, Shadcn UI"

# (Optional) Connect to remote
# git remote add origin <your-repo-url>
# git push -u origin main
```

---

### Step 11: Create Initial Utility Files (15 min)

**File:** `lib/utils.ts` (should exist from Shadcn)

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

**File:** `lib/api/client.ts`

```typescript
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handle errors)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

**File:** `types/index.ts`

```typescript
// Common types used across the app

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}
```

---

## ✅ Verification Checklist

### 1. Dev Server

```bash
npm run dev
```

- [ ] Server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Hot reload works

### 2. TypeScript

```bash
npm run type-check
```

- [ ] No TypeScript errors
- [ ] Types resolve correctly
- [ ] Path alias `@/` works

### 3. Linting

```bash
npm run lint
npm run format
```

- [ ] ESLint runs without errors
- [ ] Prettier formats code
- [ ] No warnings in console

### 4. Tailwind CSS

```typescript
// Test in app/page.tsx
<div className="bg-primary text-primary-foreground p-4 rounded-lg">
  Tailwind works!
</div>
```

- [ ] Styles apply correctly
- [ ] CSS variables work
- [ ] Dark mode ready (test with `class="dark"`)

### 5. Shadcn UI

```typescript
import { Button } from "@/components/ui/button";
<Button variant="default">Click me</Button>;
```

- [ ] Button renders
- [ ] Variants work
- [ ] Components styled correctly

### 6. Dependencies

```bash
npm list
```

- [ ] All packages installed
- [ ] No vulnerability warnings (or acceptable)
- [ ] Package versions compatible

---

## 📦 Output Files Summary

### Configuration Files

- ✅ `package.json` - Dependencies & scripts
- ✅ `tsconfig.json` - TypeScript config
- ✅ `tailwind.config.ts` - Tailwind config
- ✅ `next.config.ts` - Next.js config
- ✅ `components.json` - Shadcn config
- ✅ `eslint.config.mjs` - ESLint config
- ✅ `.prettierrc` - Prettier config
- ✅ `.env.example` - Environment template
- ✅ `.env.local` - Local environment (gitignored)

### Code Files

- ✅ `lib/utils.ts` - Utility functions
- ✅ `lib/api/client.ts` - API client
- ✅ `types/index.ts` - TypeScript types
- ✅ `app/globals.css` - Global styles
- ✅ `app/layout.tsx` - Root layout
- ✅ `app/page.tsx` - Home page

### Folders Created

- ✅ `components/ui` - Shadcn components
- ✅ `components/layout` - Layout components
- ✅ `components/forms` - Form components
- ✅ `lib/dynamic-forms` - Form system
- ✅ `types` - Type definitions
- ✅ `docs/phases` - Phase documents

---

## 🚀 Next Steps

After completing Phase 1:

1. **Test everything** - Run all verification checks
2. **Commit your work** - `git commit -m "feat: complete Phase 1 foundation"`
3. **Move to Phase 2** - [Authentication & Layout](./phase-2-auth-layout.md)

---

## 💡 Tips for AI Implementation

### Context to Provide

```
I'm implementing Phase 1: Project Foundation.

Current state:
- Fresh Next.js project OR existing project

Task: [Specific step from above]

Requirements:
- Follow the exact configuration above
- Use TypeScript strictly
- Verify each step before moving on

Start with [step number]
```

### Common Issues & Solutions

**Issue 1: Shadcn init fails**

```bash
# Solution: Ensure tailwind.config.ts exists first
npm install -D tailwindcss@latest
```

**Issue 2: TypeScript errors in Shadcn components**

```bash
# Solution: Update TypeScript version
npm install -D typescript@latest
```

**Issue 3: ESLint conflicts**

```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Progress Tracking

```
Phase 1 Progress:
├─ Step 1: Create Next.js project       [ ]
├─ Step 2: Configure TypeScript         [ ]
├─ Step 3: Configure Tailwind           [ ]
├─ Step 4: Initialize Shadcn UI         [ ]
├─ Step 5: Install dependencies         [ ]
├─ Step 6: Create folder structure      [ ]
├─ Step 7: Environment variables        [ ]
├─ Step 8: ESLint & Prettier            [ ]
├─ Step 9: VS Code config               [ ]
├─ Step 10: Initialize Git              [ ]
└─ Step 11: Create utility files        [ ]

Overall: 0% complete
```

---

**Status:** Ready to implement  
**Estimated Time:** 1-2 hours for experienced developers  
**Next Phase:** [Phase 2: Authentication & Layout →](./phase-2-auth-layout.md)

Happy coding! 🎉
