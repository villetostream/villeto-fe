"use client";

import { useAuthStore } from "@/stores/auth-stores";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Bell, Info } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Menu } from "iconsax-reactjs";

export function UserSection() {
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);
    const router = useRouter();
    const pathname = usePathname()


    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
                <Menu />
                <h1 className="text-2xl font-bold">Overview</h1>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon">
                    <Info className="w-5 h-5" />
                </Button>
                {/* <Button variant="ghost" size="icon">
                    <Calendar className="w-5 h-5" />
                </Button> */}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
                </Button>
                <div className="flex items-center gap-2 ml-2">
                    <div className="w-8 h-8 rounded-full bg-muted" />
                    <span className="text-sm font-medium">XYZ Corporation</span>
                </div>
            </div>
        </div>
    );
}
