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
import { Container } from "@/components/shared/layout/Container";
import { ThemeToggle } from "@/components/shared/layout/ThemeToggle";
import { SelectStorybook } from "@/components/features/storybook/SelectStorybook";
import ImageUploaderDemo from "@/components/features/storybook/ImageUploaderDemo";
import {
  StandaloneAvatarPicker,
  StandaloneGalleryManager,
  StandaloneCombinedExample,
} from "@/components/features/storybook/StandaloneImagePickerExamples";
import { ImagePickerDialogProvider } from "@/components/shared/image/ImagePickerDialogContext";

export default function UIStorybookPage() {
  return (
    <ImagePickerDialogProvider>
      <Container className="py-10 space-y-12">
        <TypographyH1>UI Storybook</TypographyH1>
        <TypographyP>Showcase of all UI components grouped by type</TypographyP>
        <ThemeToggle />

        {/* ImagePicker Standalone Examples */}
        <div className="space-y-8">
          <TypographyH1>ImagePicker Standalone Examples</TypographyH1>
          <TypographyP>
            ImagePicker can be used outside of DynamicForm - here are some
            examples
          </TypographyP>

          <div className="grid gap-6">
            <StandaloneAvatarPicker />
            <StandaloneGalleryManager />
            <StandaloneCombinedExample />
          </div>
        </div>

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
        <ImageUploaderDemo />
      </Container>
    </ImagePickerDialogProvider>
  );
}
