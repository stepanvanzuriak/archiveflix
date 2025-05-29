"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HeroUINavbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink
            className="flex justify-start items-center text-foreground"
            href="/"
          >
            <Button variant="bordered">ArchiveFlix</Button>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden sm:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem
              key={item.label}
              isActive={pathname === item.href}
              className="text-secondary data-[active=true]:text-primary data-[active=true]:font-medium"
            >
              <NextLink href={item.href}>{item.label}</NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <Link href="/profile">
          <Button>Profile</Button>
        </Link>
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link href="/profile">
          <Button>Profile</Button>
        </Link>
        <ThemeSwitch />

        <NavbarMenu>
          {siteConfig.navMenuItems.map(({ label, href }, index) => (
            <NavbarMenuItem key={label} onClick={() => setIsMenuOpen(false)}>
              <Link
                className="w-full"
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href={href}
              >
                {label}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>
    </HeroUINavbar>
  );
};
