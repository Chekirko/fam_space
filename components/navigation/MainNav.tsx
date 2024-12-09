import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { IUserDoc } from "@/database/user.model";
import { api } from "@/lib/api";

import { ModeToggle } from "../theme-toggler";
import { Button } from "../ui/button";

export async function MainNav() {
  const session = await auth();
  let user;
  if (session?.user?.id) {
    const { data: existingUser } = (await api.users.getById(
      session?.user?.id
    )) as ActionResponse<IUserDoc>;
    user = existingUser;
  }

  return (
    <>
      <nav className="fixed z-50 flex w-full items-center justify-between gap-5 bg-purple-400  p-6 sm:px-12">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/logo.png"
            width={80}
            height={80}
            alt="Logo"
            className="rounded-lg"
          />
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  My family
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Find Users
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Create Family
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center justify-between gap-5">
          <ModeToggle />
          {user ? (
            <Avatar>
              <AvatarImage src={user?.image} alt="avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ) : (
            <Button asChild>
              <Link href="/sign-in">
                <p className="font-bold text-purple-700">Log in</p>
              </Link>
            </Button>
          )}
        </div>
      </nav>
    </>
  );
}
