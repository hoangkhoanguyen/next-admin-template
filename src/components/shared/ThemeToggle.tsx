"use client";

import { useTheme } from "next-themes";
import { Label, Switch } from "../ui";

export const ThemeToggle = () => {
  const { theme, themes, setTheme } = useTheme();
  console.log("theme", theme, themes);
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="airplane-mode"
        checked={theme === "dark"}
        onCheckedChange={(checked) => {
          setTheme(checked ? "dark" : "light");
        }}
      />
      <Label htmlFor="airplane-mode">Dark Mode</Label>
    </div>
  );
};
