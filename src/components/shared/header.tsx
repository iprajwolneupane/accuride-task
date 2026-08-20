"use client";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Moon } from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";

const LocaleSelect = dynamic(() => import("@/components/shared/locale-select"), {
    ssr: false,
});
export default function Header({
    children,
}: { children?: React.ReactNode }) {


    return (
        <div className="w-full flex items-center justify-between bg-gray-50 p-4 h-16 border-b">
            <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="flex flex-col">
                    {children}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <LocaleSelect />
                <Button variant={"ghost"} size={"icon-lg"} className={"rounded-full"}>
                    <Moon />
                </Button>
            </div>
        </div>
    )
}