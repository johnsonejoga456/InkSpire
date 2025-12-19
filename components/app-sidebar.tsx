'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, Plus, Settings, FileText, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-4 py-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg">Lumina</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <div className="px-4 py-2">
                        <Button className="w-full justify-start gap-2">
                            <Plus className="h-4 w-4" />
                            New Document
                        </Button>
                    </div>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/dashboard">
                                        <Home />
                                        <span>Home</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/dashboard/documents">
                                        <FileText />
                                        <span>Documents</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/dashboard/settings">
                                        <Settings />
                                        <span>Settings</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4">
                <div className="text-xs text-muted-foreground">
                    Using Free Tier
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
