import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  TypographyInlineCode,
  FieldSet,
  FieldLegend,
  Input,
} from "@/components/ui";

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
