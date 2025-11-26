import {
  Button,
  Input,
  SearchInput,
  Textarea,
  PasswordInput,
} from "@/components/ui";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { H1, Text } from "@/components/shared/Typography";
import { Code } from "@/components/shared/Code";

export default function UIStorybookPage() {
  return (
    <Container className="py-10 space-y-12">
      <H1>UI Storybook</H1>
      <Text>Showcase of all UI components grouped by type</Text>

      {/* Input Group */}
      <Section title="Input Variants" description="All available input types">
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
            <Input id="input-email" type="email" placeholder="your@email.com" />
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
      </Section>
      {/* Button Group */}
      <Section
        title="Button Variants"
        description="All available button styles"
      >
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
      </Section>
    </Container>
  );
}
