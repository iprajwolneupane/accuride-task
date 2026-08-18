import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Moon } from "lucide-react";

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
            <Button variant={"ghost"} size={"icon-lg"} className={"rounded-full"}>
                <Moon />
            </Button>
        </div>
    )
}