import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyBlockquote,
  TypographyInlineCode,
  TypographyLead,
  TypographyLarge,
  TypographySmall,
  TypographyMuted,
} from "@/components/ui";

export function TypographyStorybook() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Typography</CardTitle>
        <CardDescription>Demo of all typography components</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <TypographyH1>Heading 1 - TypographyH1</TypographyH1>
          <TypographyH2>Heading 2 - TypographyH2</TypographyH2>
          <TypographyH3>Heading 3 - TypographyH3</TypographyH3>
          <TypographyH4>Heading 4 - TypographyH4</TypographyH4>
          <TypographyP>
            This is a paragraph using <b>TypographyP</b> component.
          </TypographyP>
          <TypographyLead>
            This is a lead text using <b>TypographyLead</b> component.
          </TypographyLead>
          <TypographyLarge>
            This is large text using <b>TypographyLarge</b> component.
          </TypographyLarge>
          <TypographySmall>
            This is small text using <b>TypographySmall</b> component.
          </TypographySmall>
          <TypographyMuted>
            This is muted text using <b>TypographyMuted</b> component.
          </TypographyMuted>
          <TypographyBlockquote>
            This is a blockquote using <b>TypographyBlockquote</b> component.
          </TypographyBlockquote>
          <TypographyInlineCode>
            <span>console.log(&apos;Hello world&apos;)</span>
          </TypographyInlineCode>
        </div>
        <TypographyInlineCode>{`import { TypographyH1, TypographyH2, TypographyH3, TypographyH4, TypographyP, TypographyBlockquote, TypographyInlineCode, TypographyLead, TypographyLarge, TypographySmall, TypographyMuted } from "@/components/ui/typography";`}</TypographyInlineCode>
      </CardContent>
    </Card>
  );
}
