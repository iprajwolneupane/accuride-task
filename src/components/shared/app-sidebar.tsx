"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import { useClerk, useUser } from "@clerk/nextjs";
import { CalendarDays, CheckSquare, LayoutList, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    {
        label: "My Todos",
        href: "/",
        icon: LayoutList,
    },
    {
        label: "Calendar",
        href: "/calendar",
        icon: CalendarDays,
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    const { signOut } = useClerk();
    const { user } = useUser();

    return (
        <Sidebar>
            <SidebarHeader className="border-b p-4 h-16">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                        <CheckSquare className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">Accuride Tasks</span>
                        <span className="text-xs text-muted-foreground">Task Manager</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="p-2">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {navItems.map((item) => (
                                <Link href={item.href} key={item.href}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            isActive={pathname === item.href}
                                            className="data-active:bg-primary/90 data-active:hover:bg-primary data-active:text-white data-active:hover:text-white hover:bg-primary-foreground"
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.label}</span>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </Link>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.imageUrl} />
                            <AvatarFallback>
                                {user?.firstName?.charAt(0)}
                                {user?.lastName?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">
                                {user?.fullName}
                            </span>
                            <span className="text-xs text-muted-foreground truncate max-w-32">
                                {user?.primaryEmailAddress?.emailAddress}
                            </span>
                        </div>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <LogOut
                                className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive transition-colors"
                            />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You will be logged out of your account and will need to sign in again to access it.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    variant={"destructive"}
                                    onClick={() => signOut({ redirectUrl: "/login" })}
                                >Logout</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>
            </SidebarFooter>
        </Sidebar >
    );
}