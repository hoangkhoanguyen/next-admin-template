# Phase 2: Core UI Components & Design System

> **Goal:** Build reusable UI component library and establish design system
>
> **Duration:** 1 week (5-7 days)  
> **Dependencies:** Phase 1 (Foundation)  
> **Next Phase:** [Phase 3: Authentication & Layout](./phase-3-auth-layout.md)

---

## 📋 Overview

This phase focuses on building a comprehensive UI component library that will be used throughout the admin template. Instead of building components ad-hoc, we establish a solid foundation first.

**Why this phase is important:**

- Consistent UI/UX across all pages
- Reusable components = faster development
- Design system = maintainable code
- Accessibility baked in from the start
- Dark mode support

---

## 🎯 Deliverables Checklist

### Base Components (Shadcn UI)

- [ ] Button (8 variants)
- [ ] Input (text, password, email, number, search)
- [ ] Textarea
- [ ] Label
- [ ] Card (with header, content, footer slots)
- [ ] Badge (8 color variants)
- [ ] Avatar (with fallback)
- [ ] Dialog/Modal
- [ ] Dropdown Menu
- [ ] Tabs
- [ ] Tooltip
- [ ] Popover
- [ ] Select
- [ ] Checkbox
- [ ] Radio Group
- [ ] Switch
- [ ] Separator

### Feedback Components

- [ ] Toast/Notification system
- [ ] Loading Spinner
- [ ] Loading Skeleton
- [ ] Empty State
- [ ] Error State
- [ ] Alert (info, success, warning, error)

### Utility Components

- [ ] Typography components (H1-H6, P, Text, Code)
- [ ] Section wrapper
- [ ] Container
- [ ] Flex/Grid utilities

### Design System

- [ ] Color palette (light & dark mode)
- [ ] Typography scale
- [ ] Spacing system
- [ ] Border radius scale
- [ ] Shadow scale
- [ ] Animation/transition utilities

### UI Showcase/Storybook

- [ ] Showcase page (`/ui-showcase`)
- [ ] All components documented with examples
- [ ] Interactive demos
- [ ] Code snippets for each component
- [ ] Dark mode toggle on showcase
- [ ] Navigation between component sections

### Basic Forms Demo

- [ ] Forms demo page (`/forms-demo`)
- [ ] Test React Hook Form integration
- [ ] Demonstrate all form components (Input, Select, Checkbox, Radio, Switch)
- [ ] Show validation examples
- [ ] Form submission handling
- [ ] Error state display

---

## 🛠️ Step-by-Step Implementation

### Step 1: Install Shadcn UI Components (30 min)

**Install all base components at once:**

```bash
# Form components
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add switch

# Layout components
npx shadcn@latest add card
npx shadcn@latest add separator
npx shadcn@latest add tabs

# Overlay components
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add popover
npx shadcn@latest add tooltip

# Feedback components
npx shadcn@latest add toast
npx shadcn@latest add alert

# Display components
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add skeleton
```

**Verify installation:**

```bash
ls components/ui
# Should see all components listed above
```

---

### Step 2: Test Button Variants (15 min)

**Create test page:** `app/test-ui/page.tsx`

```typescript
import { Button } from "@/components/ui/button";

export default function TestUIPage() {
  return (
    <div className="container py-10 space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Button Sizes</h2>
        <div className="flex items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <span className="sr-only">Icon</span>
            ⚙️
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Button States</h2>
        <div className="flex gap-4">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
          <Button>
            <span className="mr-2">Loading</span>
            <LoadingSpinner />
          </Button>
        </div>
      </section>
    </div>
  );
}
```

**Test:**

```bash
npm run dev
# Visit http://localhost:3000/test-ui
# All buttons should render correctly
```

---

### Step 3: Create Loading Components (20 min)

**File:** `components/feedback/LoadingSpinner.tsx`

```typescript
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-primary border-t-transparent",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
```

**File:** `components/feedback/LoadingSkeleton.tsx`

```typescript
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  variant?: "card" | "table" | "form";
  count?: number;
}

export function LoadingSkeleton({
  variant = "card",
  count = 1,
}: LoadingSkeletonProps) {
  if (variant === "card") {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 pt-4">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" /> {/* Header */}
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (variant === "form") {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
```

**Add to test page:**

```typescript
<section>
  <h2 className="text-2xl font-bold mb-4">Loading States</h2>
  <div className="grid gap-4 md:grid-cols-2">
    <div>
      <h3 className="font-semibold mb-2">Spinner</h3>
      <LoadingSpinner size="lg" />
    </div>
    <div>
      <h3 className="font-semibold mb-2">Skeleton (Card)</h3>
      <LoadingSkeleton variant="card" />
    </div>
  </div>
</section>
```

---

### Step 4: Create Empty & Error States (20 min)

**File:** `components/feedback/EmptyState.tsx`

```typescript
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && (
        <div className="mb-4 rounded-full bg-muted p-3">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

**File:** `components/feedback/ErrorState.tsx`

```typescript
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function ErrorState({
  title = "Error",
  message,
  retry,
}: ErrorStateProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        {message}
        {retry && (
          <Button variant="outline" size="sm" onClick={retry} className="mt-2">
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
```

**Test examples:**

```typescript
import { Package, AlertCircle } from "lucide-react";

<EmptyState
  icon={Package}
  title="No products found"
  description="Get started by creating your first product"
  action={{
    label: "Create Product",
    onClick: () => console.log("Create product"),
  }}
/>

<ErrorState
  message="Failed to load products. Please try again."
  retry={() => console.log("Retry")}
/>
```

---

### Step 5: Create Typography System (15 min)

**File:** `components/shared/Typography.tsx`

```typescript
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function H1({ className, children, ...props }: TypographyProps) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ className, children, ...props }: TypographyProps) {
  return (
    <h2
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({ className, children, ...props }: TypographyProps) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function H4({ className, children, ...props }: TypographyProps) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  );
}

export function P({ className, children, ...props }: TypographyProps) {
  return (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function Text({ className, children, ...props }: TypographyProps) {
  return (
    <span className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </span>
  );
}

export function Code({ className, children, ...props }: TypographyProps) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}
```

**Usage:**

```typescript
import { H1, H2, P, Text, Code } from "@/components/shared/Typography";

<H1>Dashboard</H1>
<H2>Recent Activity</H2>
<P>This is a paragraph with <Code>inline code</Code></P>
<Text>Muted text for secondary information</Text>
```

---

### Step 6: Create Section & Container Components (10 min)

**File:** `components/shared/Section.tsx`

```typescript
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function Section({
  children,
  className,
  title,
  description,
  action,
}: SectionProps) {
  return (
    <section className={cn("space-y-6", className)}>
      {(title || description || action) && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            )}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
```

**Usage:**

```typescript
<Container>
  <Section
    title="Products"
    description="Manage your product inventory"
    action={<Button>Add Product</Button>}
  >
    {/* Content here */}
  </Section>
</Container>
```

---

### Step 7: Configure Dark Mode (20 min)

**File:** `components/shared/ThemeProvider.tsx`

```typescript
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

**Install next-themes:**

```bash
npm install next-themes
```

**Update root layout:** `app/layout.tsx`

```typescript
import { ThemeProvider } from "@/components/shared/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**File:** `components/shared/ThemeToggle.tsx`

```typescript
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

**Test:**

```typescript
import { ThemeToggle } from "@/components/shared/ThemeToggle";

<ThemeToggle />;
// Click to switch between light/dark/system modes
```

---

### Step 8: Create Badge Variants (10 min)

**Test all badge variants:**

```typescript
import { Badge } from "@/components/ui/badge";

<div className="flex flex-wrap gap-2">
  <Badge>Default</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="destructive">Destructive</Badge>
  <Badge variant="outline">Outline</Badge>

  {/* Custom status badges */}
  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
    Active
  </Badge>
  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
    Pending
  </Badge>
  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactive</Badge>
  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Draft</Badge>
</div>;
```

---

### Step 9: Create UI Showcase Page (Complete) (45 min)

Now we'll create a comprehensive showcase page that documents all components. This serves as both a testing ground and living documentation.

**File:** `app/ui-showcase/page.tsx`

```typescript
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { H1, H2, H3, P, Text, Code } from "@/components/shared/Typography";
import { Container, Section } from "@/components/shared/Section";
import {
  Package,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  Mail,
  User,
  Settings,
} from "lucide-react";

export const metadata: Metadata = {
  title: "UI Component Showcase",
  description: "Complete collection of reusable UI components",
};

export default function UIShowcasePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <Container className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <H1>UI Component Library</H1>
              <Text>Complete collection of reusable components</Text>
            </div>
            <ThemeToggle />
          </div>
        </Container>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <Container>
          <nav className="flex gap-6 py-4 overflow-x-auto">
            <a
              href="#buttons"
              className="text-sm hover:text-primary whitespace-nowrap"
            >
              Buttons
            </a>
            <a
              href="#inputs"
              className="text-sm hover:text-primary whitespace-nowrap"
            >
              Inputs
            </a>
            <a
              href="#cards"
              className="text-sm hover:text-primary whitespace-nowrap"
            >
              Cards
            </a>
            <a
              href="#badges"
              className="text-sm hover:text-primary whitespace-nowrap"
            >
              Badges
            </a>
            <a
              href="#alerts"
              className="text-sm hover:text-primary whitespace-nowrap"
            >
              Alerts
            </a>
            <a
              href="#loading"
              className="text-sm hover:text-primary whitespace-nowrap"
            >
              Loading
            </a>
            <a
              href="#feedback"
              className="text-sm hover:text-primary whitespace-nowrap"
            >
              Feedback
            </a>
            <a
              href="#typography"
              className="text-sm hover:text-primary whitespace-nowrap"
            >
              Typography
            </a>
            <a
              href="#tabs"
              className="text-sm hover:text-primary whitespace-nowrap"
            >
              Tabs
            </a>
          </nav>
        </Container>
      </div>

      <Container className="py-10 space-y-16">
        {/* Buttons Section */}
        <Section
          id="buttons"
          title="Buttons"
          description="Button components with multiple variants and sizes"
        >
          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
              <CardDescription>
                Different button styles for various use cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Default Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-3">Sizes</h4>
                <div className="flex items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-3">States</h4>
                <div className="flex gap-3">
                  <Button>Normal</Button>
                  <Button disabled>Disabled</Button>
                  <Button>
                    <Mail className="mr-2 h-4 w-4" />
                    With Icon
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50">
              <Code>import {"{ Button }"} from "@/components/ui/button";</Code>
            </CardFooter>
          </Card>
        </Section>

        {/* Inputs Section */}
        <Section
          id="inputs"
          title="Form Inputs"
          description="Input components for collecting user data"
        >
          <Card>
            <CardHeader>
              <CardTitle>Input Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="text">Text Input</Label>
                  <Input id="text" placeholder="Enter text..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Number</Label>
                  <Input id="number" type="number" placeholder="0" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="textarea">Textarea</Label>
                <Textarea
                  id="textarea"
                  placeholder="Enter long text..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="select">Select</Label>
                <Select>
                  <SelectTrigger id="select">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Checkboxes & Radio</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" />
                  <Label htmlFor="notifications">Enable notifications</Label>
                </div>
                <RadioGroup defaultValue="option1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option1" id="r1" />
                    <Label htmlFor="r1">Option 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option2" id="r2" />
                    <Label htmlFor="r2">Option 2</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50">
              <Code>
                import {"{ Input, Label, Textarea }"} from
                "@/components/ui/...";
              </Code>
            </CardFooter>
          </Card>
        </Section>

        {/* Cards Section */}
        <Section
          id="cards"
          title="Cards"
          description="Container components for grouping content"
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
                <CardDescription>Card with header and content</CardDescription>
              </CardHeader>
              <CardContent>
                <P>
                  This is the card content area. You can put any content here.
                </P>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>With Footer</CardTitle>
                <CardDescription>Card with actions</CardDescription>
              </CardHeader>
              <CardContent>
                <P>Content area with footer buttons below.</P>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
                <Button className="w-full">Save</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/avatar.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>User Card</CardTitle>
                    <CardDescription>With avatar</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <P>Card with user information and avatar.</P>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-6">
            <CardFooter className="bg-muted/50 justify-center">
              <Code>
                import {"{ Card, CardHeader, CardTitle }"} from
                "@/components/ui/card";
              </Code>
            </CardFooter>
          </Card>
        </Section>

        {/* Badges Section */}
        <Section
          id="badges"
          title="Badges"
          description="Status indicators and labels"
        >
          <Card>
            <CardHeader>
              <CardTitle>Badge Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Default Variants</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-3">Status Colors</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    Active
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                    Pending
                  </Badge>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                    Inactive
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    Draft
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                    Featured
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-3">With Icons</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Success
                  </Badge>
                  <Badge variant="destructive">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Error
                  </Badge>
                  <Badge variant="secondary">
                    <Info className="mr-1 h-3 w-3" />
                    Info
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50">
              <Code>import {"{ Badge }"} from "@/components/ui/badge";</Code>
            </CardFooter>
          </Card>
        </Section>

        {/* Alerts Section */}
        <Section
          id="alerts"
          title="Alerts"
          description="Important messages and notifications"
        >
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                This is an informational alert. Use it for neutral messages.
              </AlertDescription>
            </Alert>

            <Alert className="border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-100">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Operation completed successfully! Your changes have been saved.
              </AlertDescription>
            </Alert>

            <Alert className="border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-100">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Please review your settings before proceeding.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Something went wrong. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
          <Card className="mt-6">
            <CardFooter className="bg-muted/50 justify-center">
              <Code>
                import {"{ Alert, AlertTitle }"} from "@/components/ui/alert";
              </Code>
            </CardFooter>
          </Card>
        </Section>

        {/* Loading States Section */}
        <Section
          id="loading"
          title="Loading States"
          description="Spinners and skeleton loaders"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Spinner</CardTitle>
                <CardDescription>Animated loading indicator</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8 gap-6">
                <LoadingSpinner size="sm" />
                <LoadingSpinner size="md" />
                <LoadingSpinner size="lg" />
              </CardContent>
              <CardFooter className="bg-muted/50">
                <Code>{"<LoadingSpinner size='lg' />"}</Code>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skeleton Loader</CardTitle>
                <CardDescription>Content placeholder</CardDescription>
              </CardHeader>
              <CardContent>
                <LoadingSkeleton variant="card" count={1} />
              </CardContent>
              <CardFooter className="bg-muted/50">
                <Code>{"<LoadingSkeleton variant='card' />"}</Code>
              </CardFooter>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Skeleton Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Table Loading</h4>
                <LoadingSkeleton variant="table" count={3} />
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-3">Form Loading</h4>
                <LoadingSkeleton variant="form" count={3} />
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* Feedback States Section */}
        <Section
          id="feedback"
          title="Feedback States"
          description="Empty states and error handling"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <EmptyState
                  icon={Package}
                  title="No products found"
                  description="Get started by creating your first product. It only takes a few minutes."
                  action={{
                    label: "Create Product",
                    onClick: () => alert("Create product clicked"),
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <EmptyState
                  icon={User}
                  title="No users yet"
                  description="Invite team members to collaborate on this project."
                  action={{
                    label: "Invite Users",
                    onClick: () => alert("Invite users clicked"),
                  }}
                />
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Error State</CardTitle>
            </CardHeader>
            <CardContent>
              <ErrorState
                title="Failed to load data"
                message="We couldn't fetch the data. Please check your connection and try again."
                retry={() => alert("Retry clicked")}
              />
            </CardContent>
          </Card>
        </Section>

        {/* Typography Section */}
        <Section
          id="typography"
          title="Typography"
          description="Text styles and formatting"
        >
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <H1>Heading 1</H1>
                <Text>Used for page titles</Text>
              </div>
              <Separator />
              <div>
                <H2>Heading 2</H2>
                <Text>Used for section titles</Text>
              </div>
              <Separator />
              <div>
                <H3>Heading 3</H3>
                <Text>Used for subsection titles</Text>
              </div>
              <Separator />
              <div>
                <P>
                  This is a paragraph with regular text. You can include{" "}
                  <Code>inline code</Code>, <strong>bold text</strong>,{" "}
                  <em>italic text</em>, and{" "}
                  <a href="#" className="text-primary hover:underline">
                    links
                  </a>
                  .
                </P>
              </div>
              <Separator />
              <div>
                <Text>This is muted text for secondary information.</Text>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50">
              <Code>
                import {"{ H1, P, Text, Code }"} from
                "@/components/shared/Typography";
              </Code>
            </CardFooter>
          </Card>
        </Section>

        {/* Tabs Section */}
        <Section
          id="tabs"
          title="Tabs"
          description="Tabbed navigation for content"
        >
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="space-y-4">
                  <H3>Account Settings</H3>
                  <P>Manage your account settings and preferences here.</P>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input placeholder="Enter username" />
                  </div>
                </TabsContent>
                <TabsContent value="password" className="space-y-4">
                  <H3>Password Settings</H3>
                  <P>Change your password or update security settings.</P>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </TabsContent>
                <TabsContent value="settings" className="space-y-4">
                  <H3>General Settings</H3>
                  <P>Configure your application preferences.</P>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifications-tab" />
                    <Label htmlFor="notifications-tab">
                      Enable notifications
                    </Label>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="bg-muted/50">
              <Code>
                import {"{ Tabs, TabsList, TabsTrigger }"} from
                "@/components/ui/tabs";
              </Code>
            </CardFooter>
          </Card>
        </Section>

        {/* Footer */}
        <Separator />
        <div className="text-center py-8">
          <Text>Built with Next.js 15 + Shadcn UI + Tailwind CSS</Text>
        </div>
      </Container>
    </div>
  );
}
```

**What this page includes:**

- ✅ **Sticky navigation** - Jump to any section
- ✅ **All components** - Every UI element documented
- ✅ **Interactive examples** - Real working components
- ✅ **Code snippets** - Import statements for each section
- ✅ **Dark mode** - Theme toggle in header
- ✅ **Responsive** - Works on mobile/tablet/desktop
- ✅ **Organized sections** - Easy to navigate

**Test the showcase:**

```bash
npm run dev
# Visit http://localhost:3000/ui-showcase
```

---

### Step 10: Add Showcase to Navigation (5 min)

**Update root page** `app/page.tsx` with link to showcase:

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { H1, P } from "@/components/shared/Typography";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6">
        <H1>Toy Store Admin</H1>
        <P>Production-ready admin dashboard</P>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/ui-showcase">View UI Components</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

### Step 11: Test All Components Together (30 min)

**Update test page with comprehensive examples:**

**File:** `app/test-ui/page.tsx` (Alternative minimal test page)

> **Note:** You can use either `/ui-showcase` (full documentation) or `/test-ui` (quick testing).
> The showcase page in Step 9 is more comprehensive and production-ready.

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { H1, H2, H3, P, Text, Code } from "@/components/shared/Typography";
import { Container, Section } from "@/components/shared/Section";
import { Package, AlertCircle, Info } from "lucide-react";

export default function TestUIPage() {
  return (
    <Container className="py-10">
      <div className="flex items-center justify-between mb-8">
        <H1>UI Component Library</H1>
        <ThemeToggle />
      </div>

      {/* Buttons */}
      <Section title="Buttons" className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>All available button styles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Form Elements */}
      <Section title="Form Elements" className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@example.com" />
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Badges */}
      <Section title="Badges" className="mb-12">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge className="bg-green-100 text-green-800">Success</Badge>
          <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
        </div>
      </Section>

      {/* Loading States */}
      <Section title="Loading States" className="mb-12">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Spinner</CardTitle>
            </CardHeader>
            <CardContent>
              <LoadingSpinner size="lg" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <LoadingSkeleton variant="card" />
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Empty & Error States */}
      <Section title="Feedback States" className="mb-12">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <EmptyState
                icon={Package}
                title="No items found"
                description="Get started by adding your first item"
                action={{
                  label: "Add Item",
                  onClick: () => alert("Add item clicked"),
                }}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <ErrorState
                message="Failed to load data"
                retry={() => alert("Retry clicked")}
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Alerts */}
      <Section title="Alerts" className="mb-12">
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>
              This is an informational message.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Something went wrong. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography" className="mb-12">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <H1>Heading 1</H1>
            <H2>Heading 2</H2>
            <H3>Heading 3</H3>
            <P>
              This is a paragraph with <Code>inline code</Code> and regular
              text.
            </P>
            <Text>This is muted text for secondary information</Text>
          </CardContent>
        </Card>
      </Section>
    </Container>
  );
}
```

---

## ✅ Verification Checklist

### Component Testing

```bash
npm run dev
# Visit http://localhost:3000/ui-showcase (main showcase)
# OR http://localhost:3000/test-ui (quick tests)
```

- [ ] UI Showcase page loads correctly
- [ ] All sections visible and navigable
- [ ] Sticky navigation works when scrolling
- [ ] All buttons render with correct styles
- [ ] Button hover/active states work
- [ ] Inputs accept text and show focus states
- [ ] Cards display with correct spacing
- [ ] Badges show all color variants
- [ ] Loading spinner animates
- [ ] Skeleton shows loading state
- [ ] Empty state displays with icon and action
- [ ] Error state shows retry button
- [ ] Alerts display with icons and correct colors
- [ ] Typography renders correctly
- [ ] Tabs switch between content
- [ ] Dark mode toggle works on showcase page
- [ ] All components responsive on mobile

### TypeScript Check

```bash
npm run type-check
```

- [ ] No TypeScript errors
- [ ] All component props typed correctly

### Accessibility Check

- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader text present (sr-only)
- [ ] ARIA labels on interactive elements
- [ ] Focus visible on all focusable elements
- [ ] Color contrast meets WCAG AA

---

## 📦 Output Files Summary

### Shadcn Components (in `components/ui/`)

- ✅ `button.tsx`
- ✅ `input.tsx`
- ✅ `textarea.tsx`
- ✅ `label.tsx`
- ✅ `card.tsx`
- ✅ `badge.tsx`
- ✅ `avatar.tsx`
- ✅ `dialog.tsx`
- ✅ `dropdown-menu.tsx`
- ✅ `tabs.tsx`
- ✅ `tooltip.tsx`
- ✅ `popover.tsx`
- ✅ `select.tsx`
- ✅ `checkbox.tsx`
- ✅ `radio-group.tsx`
- ✅ `switch.tsx`
- ✅ `separator.tsx`
- ✅ `toast.tsx`
- ✅ `alert.tsx`
- ✅ `skeleton.tsx`

### Custom Components (in `components/`)

- ✅ `feedback/LoadingSpinner.tsx`
- ✅ `feedback/LoadingSkeleton.tsx`
- ✅ `feedback/EmptyState.tsx`
- ✅ `feedback/ErrorState.tsx`
- ✅ `shared/Typography.tsx`
- ✅ `shared/Section.tsx`
- ✅ `shared/ThemeProvider.tsx`
- ✅ `shared/ThemeToggle.tsx`

### Test Files

- ✅ `app/ui-showcase/page.tsx` - Complete UI component showcase (production-ready)
- ✅ `app/test-ui/page.tsx` - Quick component testing page (optional)
- ✅ `app/page.tsx` - Home page with links to showcase

---

## 🚀 Next Steps

After completing Phase 2:

1. **Review all components** - Test each component works correctly
2. **Test dark mode** - Toggle between light/dark themes
3. **Check mobile responsive** - Test on small screens
4. **Commit your work** - `git commit -m "feat: complete Phase 2 UI components"`
5. **Move to Phase 3** - [Authentication & Layout](./phase-3-auth-layout.md)

---

## 💡 Usage Examples for Next Phases

### In Auth Pages (Phase 3)

```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

<Card>
  <CardHeader>
    <CardTitle>Login</CardTitle>
  </CardHeader>
  <CardContent>
    <form className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
      </div>
      <Button className="w-full">Sign In</Button>
    </form>
  </CardContent>
</Card>;
```

### In Product List (Phase 6)

```typescript
import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { Badge } from "@/components/ui/badge";

{
  isLoading && <LoadingSkeleton variant="card" count={3} />;
}

{
  isEmpty && (
    <EmptyState
      icon={Package}
      title="No products yet"
      action={{ label: "Add Product", onClick: handleCreate }}
    />
  );
}

{
  product.status === "active" && (
    <Badge className="bg-green-100 text-green-800">Active</Badge>
  );
}
```

### In Dashboard (Phase 8)

```typescript
import { Section } from "@/components/shared/Section";
import { H2 } from "@/components/shared/Typography";

<Section
  title="Dashboard"
  description="Overview of your store"
  action={<ThemeToggle />}
>
  {/* Dashboard content */}
</Section>;
```

---

## 📚 UI Showcase Features

The `/ui-showcase` page serves as:

1. **Living Documentation**

   - All components in one place
   - Real working examples
   - Code snippets for easy copy-paste

2. **Testing Ground**

   - Test dark mode compatibility
   - Verify responsive behavior
   - Check accessibility

3. **Developer Reference**

   - Quick lookup for component props
   - Visual examples of all variants
   - Import statements included

4. **Design System**
   - Consistent color palette
   - Typography scale
   - Spacing system
   - Component variants

**Sections included:**

- ✅ Buttons (6 variants, 3 sizes, states)
- ✅ Form Inputs (text, email, password, select, checkbox, radio, switch)
- ✅ Cards (3 examples with different layouts)
- ✅ Badges (status colors, with icons)
- ✅ Alerts (info, success, warning, error)
- ✅ Loading (spinner sizes, skeleton variants)
- ✅ Feedback (empty states, error states)
- ✅ Typography (headings, paragraphs, code)
- ✅ Tabs (3-tab example with content)

---

### Step 12: Create Basic Forms Demo Page (45 min)

**File:** `app/forms-demo/page.tsx`

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Container, Section } from "@/components/shared/Section";
import { H1, H2, Text } from "@/components/shared/Typography";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.string().min(1, "Please select a role"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  notifications: z.boolean().default(false),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
});

type FormValues = z.infer<typeof formSchema>;

export default function FormsDemoPage() {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notifications: false,
      theme: "system",
      terms: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Form submitted:", data);

    toast({
      title: "Success!",
      description: "Form submitted successfully.",
    });

    // Reset form after successful submission
    reset();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <Container className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <H1>Forms Demo</H1>
              <Text>
                Test React Hook Form + Zod validation with UI components
              </Text>
            </div>
            <ThemeToggle />
          </div>
        </Container>
      </div>

      <Container className="py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>User Registration Form</CardTitle>
            <CardDescription>
              Complete form example with all input types and validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Text Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    {...register("firstName")}
                    aria-invalid={errors.firstName ? "true" : "false"}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    {...register("lastName")}
                    aria-invalid={errors.lastName ? "true" : "false"}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Input (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  {...register("phone")}
                />
              </div>

              {/* Select Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="role">
                  Role <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("role", value)}
                  defaultValue=""
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-destructive">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Textarea */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  rows={4}
                  {...register("bio")}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum 500 characters
                </p>
                {errors.bio && (
                  <p className="text-sm text-destructive">
                    {errors.bio.message}
                  </p>
                )}
              </div>

              {/* Radio Group */}
              <div className="space-y-3">
                <Label>Preferred Theme</Label>
                <RadioGroup
                  defaultValue="system"
                  onValueChange={(value) =>
                    setValue("theme", value as "light" | "dark" | "system")
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label
                      htmlFor="light"
                      className="font-normal cursor-pointer"
                    >
                      Light
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label
                      htmlFor="dark"
                      className="font-normal cursor-pointer"
                    >
                      Dark
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label
                      htmlFor="system"
                      className="font-normal cursor-pointer"
                    >
                      System
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Switch */}
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about your account activity
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={watch("notifications")}
                  onCheckedChange={(checked) =>
                    setValue("notifications", checked)
                  }
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={watch("terms")}
                  onCheckedChange={(checked) =>
                    setValue("terms", checked as boolean)
                  }
                />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="terms" className="cursor-pointer">
                    Accept terms and conditions{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    You agree to our Terms of Service and Privacy Policy
                  </p>
                  {errors.terms && (
                    <p className="text-sm text-destructive">
                      {errors.terms.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Submitting..." : "Submit Form"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Form State Debug (Optional) */}
        <Card className="max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-sm">Form State (Debug)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto">
              {JSON.stringify(watch(), null, 2)}
            </pre>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
```

**Test the form:**

```bash
npm run dev
# Visit http://localhost:3000/forms-demo
```

**Test cases:**

- [ ] Submit empty form - should show validation errors
- [ ] Fill all required fields - should submit successfully
- [ ] Test email validation with invalid email
- [ ] Test checkbox requirement for terms
- [ ] Test switch toggle
- [ ] Test radio group selection
- [ ] Test select dropdown
- [ ] Test textarea character limit (type 501+ characters)
- [ ] Test reset button
- [ ] Test dark mode toggle
- [ ] Test mobile responsive layout

---

## 🎯 Success Criteria

Phase 2 is complete when:

- ✅ All 30+ Shadcn components installed
- ✅ All 8 custom components created
- ✅ UI Showcase page fully functional
- ✅ Forms Demo page fully functional
- ✅ All component sections documented
- ✅ Sticky navigation works
- ✅ Code snippets included for each section
- ✅ Dark mode toggle works perfectly
- ✅ React Hook Form + Zod validation working
- ✅ All form components tested (Input, Select, Checkbox, Radio, Switch)
- ✅ Form validation errors display correctly
- ✅ Form submission handling works
- ✅ Mobile responsive (test on 375px width)
- ✅ Accessibility checks pass
- ✅ No TypeScript errors
- ✅ Committed to Git

**Pages URLs:**

- UI Showcase: http://localhost:3000/ui-showcase
- Forms Demo: http://localhost:3000/forms-demo

---

**Status:** Ready to implement  
**Estimated Time:** 1 week (UI Showcase: 1 day, Forms Demo: 45 min, rest: custom components)  
**Next Phase:** [Phase 3: Dynamic Forms System →](./phase-3-dynamic-forms.md)

Let's build beautiful, accessible components! 🎨
