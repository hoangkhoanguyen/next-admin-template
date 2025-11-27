import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  TypographyInlineCode,
} from "@/components/ui";
import { Empty, EmptyHeader } from "@/components/ui/empty";

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
