"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  TypographyInlineCode,
  Toaster,
} from "@/components/ui";
import { toast } from "sonner";

export function ToastStorybook() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Toast Notifications</CardTitle>
        <CardDescription>Demo of Sonner toast notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            onClick={() =>
              toast.success("Success toast!", {
                description: "This is a success message.",
              })
            }
          >
            Show Success Toast
          </Button>
          <Button
            onClick={() =>
              toast.error("Error toast!", {
                description: "This is an error message.",
              })
            }
            variant="destructive"
          >
            Show Error Toast
          </Button>
          <Button
            onClick={() =>
              toast.info("Info toast!", {
                description: "This is an info message.",
              })
            }
            variant="secondary"
          >
            Show Info Toast
          </Button>
          <Button
            onClick={() =>
              toast.warning("Warning toast!", {
                description: "This is a warning message.",
              })
            }
            variant="outline"
          >
            Show Warning Toast
          </Button>
          <Button onClick={() => toast("Default toast!")}>
            Show Default Toast
          </Button>
        </div>
        <TypographyInlineCode>{`import { toast } from "sonner";`}</TypographyInlineCode>
        <Toaster position="top-right" richColors />
      </CardContent>
    </Card>
  );
}
