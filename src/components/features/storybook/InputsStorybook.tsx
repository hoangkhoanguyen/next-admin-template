import {
  Input,
  SearchInput,
  Textarea,
  PasswordInput,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  TypographyInlineCode,
} from "@/components/ui";

export function InputsStorybook() {
  return (
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
        <TypographyInlineCode>{`import { Input } from "@/components/ui/input";`}</TypographyInlineCode>
      </CardContent>
    </Card>
  );
}
