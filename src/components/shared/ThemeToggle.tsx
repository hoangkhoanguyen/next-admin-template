"use client";

import { useTheme } from "next-themes";
import { Button } from "../ui";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, themes, setTheme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      size={"icon-sm"}
      variant="ghost"
    >
      {theme === "dark" ? <Moon /> : <Sun />}
    </Button>
  );
};
