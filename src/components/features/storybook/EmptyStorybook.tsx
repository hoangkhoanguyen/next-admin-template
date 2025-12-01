import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  TypographyInlineCode,
  Empty,
  EmptyHeader,
} from "@/components/ui";

export function EmptyStorybook() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Empty</CardTitle>
        <CardDescription>Demo and usage of Empty component</CardDescription>
      </CardHeader>
      <CardContent>
        <Empty>
          <EmptyHeader>
            <span>No data found</span>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  );
}
