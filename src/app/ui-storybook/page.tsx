import {
  Button,
  Input,
  SearchInput,
  Textarea,
  PasswordInput,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui";
import { Container } from "@/components/shared/Container";
import { H1, Text } from "@/components/shared/Typography";
import { Code } from "@/components/shared/Code";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function UIStorybookPage() {
  return (
    <Container className="py-10 space-y-12">
      <H1>UI Storybook</H1>
      <Text>Showcase of all UI components grouped by type</Text>

      <ThemeToggle />

      {/* Input Group */}
      <Card>
        <CardHeader>
          <CardTitle>Input Variants</CardTitle>
          <CardDescription>All available input types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div className="space-y-2">
              <label htmlFor="input-text" className="text-sm font-medium">
                Text Input
              </label>
              <Input id="input-text" type="text" placeholder="Enter text..." />
            </div>
            <div className="space-y-2">
              <label htmlFor="input-email" className="text-sm font-medium">
                Email Input
              </label>
              <Input
                id="input-email"
                type="email"
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="input-password" className="text-sm font-medium">
                Password Input
              </label>
              <PasswordInput id="input-password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <label htmlFor="input-number" className="text-sm font-medium">
                Number Input
              </label>
              <Input id="input-number" type="number" placeholder="123" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Search Input (icon end)
              </label>
              <SearchInput placeholder="Search..." iconPosition="end" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Search Input (icon start)
              </label>
              <SearchInput placeholder="Search..." iconPosition="start" />
            </div>
            <div className="space-y-2">
              <label htmlFor="input-textarea" className="text-sm font-medium">
                Textarea
              </label>
              <Textarea
                id="input-textarea"
                placeholder="Enter multi-line text..."
              />
            </div>
          </div>
          <Code>{`import { Input } from "@/components/ui/input";`}</Code>
        </CardContent>
      </Card>
      {/* Button Group */}
      <Card>
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
          <CardDescription>All available button styles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-6">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="default" disabled>
              Disabled
            </Button>
            <Button variant="destructive" disabled>
              Disabled
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Settings">
              ⚙️
            </Button>
          </div>
          <Code>{`import { Button } from "@/components/ui/button";`}</Code>
        </CardContent>
      </Card>
    </Container>
  );
}
