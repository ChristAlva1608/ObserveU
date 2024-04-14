"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../../components/ui/button";

export default function Navbar() {
  const router = useRouter();
  return (
    <nav className="bg-muted/40 w-full flex h-16 pr-14 px-8 items-center border-b fixed select-none backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div
        className="flex items-center gap-1 cursor-pointer"
        onClick={() => {
          router.push("/");
        }}
      >
        <Image src="/logo.jpg" alt="website-logo" width={0} height={0} className="h-[40px] w-full" />
      </div>
      <UserNav />
    </nav>
  );
}

const UserNav: React.FC = () => {
  const router = useRouter();
  return (
    <div className="ml-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full select-none"
          >
            <Avatar className="h-10 w-10">
              {/* <AvatarImage src="/avatars/01.png" alt="@shadcn" /> */}
              <AvatarFallback>AW</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">atware</p>
              <p className="text-xs leading-none text-muted-foreground">
                m@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              router.push("/auth/login");
            }}
          >
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
