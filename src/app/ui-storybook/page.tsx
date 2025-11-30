import { TypographyH1, TypographyP } from "@/components/ui";
import { InputsStorybook } from "@/components/features/storybook/InputsStorybook";
import { ButtonsStorybook } from "@/components/features/storybook/ButtonsStorybook";
import { TypographyStorybook } from "@/components/features/storybook/TypographyStorybook";
import { ToastStorybook } from "@/components/features/storybook/ToastStorybook";
import { BreadcrumbStorybook } from "@/components/features/storybook/BreadcrumbStorybook";
import { AccordionStorybook } from "@/components/features/storybook/AccordionStorybook";
import { AlertDialogStorybook } from "@/components/features/storybook/AlertDialogStorybook";
import { BadgeStorybook } from "@/components/features/storybook/BadgeStorybook";
import { CheckboxStorybook } from "@/components/features/storybook/CheckboxStorybook";
import { DialogStorybook } from "@/components/features/storybook/DialogStorybook";
import { DrawerStorybook } from "@/components/features/storybook/DrawerStorybook";
import { DropdownMenuStorybook } from "@/components/features/storybook/DropdownMenuStorybook";
import { EmptyStorybook } from "@/components/features/storybook/EmptyStorybook";
import { FieldStorybook } from "@/components/features/storybook/FieldStorybook";
import { Container } from "@/components/shared/Container";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { SelectStorybook } from "@/components/features/storybook/SelectStorybook";

export default function UIStorybookPage() {
  return (
    <Container className="py-10 space-y-12">
      <TypographyH1>UI Storybook</TypographyH1>
      <TypographyP>Showcase of all UI components grouped by type</TypographyP>
      <ThemeToggle />
      <SelectStorybook />
      <ToastStorybook />
      <AlertDialogStorybook />
      <BadgeStorybook />
      <CheckboxStorybook />
      <DialogStorybook />
      <DrawerStorybook />
      <DropdownMenuStorybook />
      <EmptyStorybook />
      <FieldStorybook />
      <BreadcrumbStorybook />
      <AccordionStorybook />
      <TypographyStorybook />
      <InputsStorybook />
      <ButtonsStorybook />
    </Container>
  );
}
