import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  TypographyInlineCode,
} from "@/components/ui";
import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxStorybook() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkbox</CardTitle>
        <CardDescription>Demo and usage of Checkbox component</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6 items-center">
          <Checkbox id="cb1" />
          <label htmlFor="cb1">Checkbox</label>
        </div>
      </CardContent>
    </Card>
  );
}
