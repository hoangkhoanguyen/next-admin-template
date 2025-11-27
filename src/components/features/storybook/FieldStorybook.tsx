import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  TypographyInlineCode,
} from "@/components/ui";
import { FieldSet, FieldLegend } from "@/components/ui/field";
import { Input } from "@/components/ui";

export function FieldStorybook() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Field</CardTitle>
        <CardDescription>Demo and usage of FieldSet component</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldSet>
          <FieldLegend>Personal Info</FieldLegend>
          <Input placeholder="Name" />
        </FieldSet>
      </CardContent>
    </Card>
  );
}
