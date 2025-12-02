import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  Button,
  TypographyH4,
} from "@/components/ui";
import { Home, Settings, Apple, LogOut, BrickWallShield } from "lucide-react";
import User from "./User";

const items = [
  { title: "Home", url: "#", icon: Home },
  { title: "Products", url: "#", icon: Apple },
  { title: "Settings", url: "#", icon: Settings },
];

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <BrickWallShield />
          <TypographyH4>Admin</TypographyH4>
        </div>
      </SidebarHeader>
      <SidebarContent className="justify-between">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-row">
        <div className="flex-1">
          <User name="John Doe" avatarUrl="/path/to/avatar.jpg" />
        </div>
        <Button size={"icon"} variant={"ghost"}>
          <LogOut />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
