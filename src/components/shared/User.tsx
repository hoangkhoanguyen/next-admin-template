import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  TypographyP,
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
        <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none">
          <Avatar>
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          {/* <span className="font-medium text-gray-900 dark:text-gray-100">
            {name}
          </span> */}
          <TypographyP>{name}</TypographyP>
        </button>
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
