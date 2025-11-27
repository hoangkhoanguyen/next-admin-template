import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  TypographyInlineCode,
} from "@/components/ui";

export function ButtonsStorybook() {
  return (
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
        <TypographyInlineCode>{`import { Button } from "@/components/ui/button";`}</TypographyInlineCode>
      </CardContent>
    </Card>
  );
}
