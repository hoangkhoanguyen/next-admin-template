import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  TypographyInlineCode,
  Badge,
} from "@/components/ui";

export function BadgeStorybook() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Badge</CardTitle>
        <CardDescription>Demo and usage of Badge component</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-6">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
