"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { SWRConfig } from "swr";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { UserStoreProvider } from "@/stores/user-store-provider";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

function localStorageProvider() {
  if (typeof window === "undefined") {
    // add this check to avoid the error
    // Return a dummy storage for server-side rendering
    return new Map();
  }

  const map = new Map<string, any>(
    JSON.parse(localStorage.getItem("app-cache") || "[]"),
  );

  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));

    localStorage.setItem("app-cache", appCache);
  });

  return map;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <SWRConfig value={{ provider: localStorageProvider }}>
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>
          <UserStoreProvider>{children}</UserStoreProvider>
        </NextThemesProvider>
      </HeroUIProvider>
    </SWRConfig>
  );
}
