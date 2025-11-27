import { TypographyH1, TypographyP } from "@/components/ui";
import { InputsStorybook } from "@/components/features/storybook/InputsStorybook";
import { ButtonsStorybook } from "@/components/features/storybook/ButtonsStorybook";
import { TypographyStorybook } from "@/components/features/storybook/TypographyStorybook";
import { ToastStorybook } from "@/components/features/storybook/ToastStorybook";
import { Container } from "@/components/shared/Container";

import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { toast } from "sonner";

export default function UIStorybookPage() {
  return (
    <Container className="py-10 space-y-12">
      <TypographyH1>UI Storybook</TypographyH1>
      <TypographyP>Showcase of all UI components grouped by type</TypographyP>

      <ThemeToggle />

      <ToastStorybook />
      <TypographyStorybook />
      <InputsStorybook />
      <ButtonsStorybook />
    </Container>
  );
}
