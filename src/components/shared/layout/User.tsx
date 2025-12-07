import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  TypographyP,
  Button,
} from "@/components/ui";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui";
import { User2, Settings, LogOut } from "lucide-react";

export interface UserProps {
  name: string;
  avatarUrl?: string;
}

export default function User({ name, avatarUrl }: UserProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="w-full justify-start gap-2">
          <Avatar>
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          {/* <span className="font-medium text-gray-900 dark:text-gray-100">
            {name}
          </span> */}
          <TypographyP>{name}</TypographyP>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <User2 className="mr-2 h-4 w-4" /> Account
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
