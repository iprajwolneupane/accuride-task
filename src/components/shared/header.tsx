"use client";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { SidebarTrigger } from "@/components/ui/sidebar";
import dynamic from "next/dynamic";
import React from "react";
import { useTranslation } from "react-i18next";

const LocaleSelect = dynamic(() => import("@/components/shared/locale-select"), {
  ssr: false,
});

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <div className="w-full flex items-center justify-between bg-background dark:bg-card p-4 h-16 border-b dark:border-sidebar-border">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex flex-col">{children}</div>
      </div>
      <div className="flex items-center gap-2">
        <LocaleSelect />
        <AnimatedThemeToggler />
      </div>
    </div>
  );
}

export function TodoPageHeader() {
  const { t } = useTranslation();

  return (
    <Header>
      <h2 className="font-semibold text-sm">{t("todo.headerTitle")}</h2>
      <p className="text-xs text-muted-foreground">{t("todo.headerDescription")}</p>
    </Header>
  );
}

export function CalendarPageHeader() {
  const { t } = useTranslation();

  return (
    <Header>
      <h2 className="font-semibold text-sm">{t("calendar.headerTitle")}</h2>
      <p className="text-xs text-muted-foreground">{t("calendar.headerDescription")}</p>
    </Header>
  );
}