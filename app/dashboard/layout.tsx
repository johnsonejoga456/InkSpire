import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full h-screen overflow-hidden flex flex-col">
                <header className="flex items-center h-14 border-b px-4 shrink-0 gap-2">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="h-6" />
                    <div className="font-medium text-sm">Workspace</div>
                </header>
                <div className="flex-1 overflow-auto p-4 md:p-6 bg-muted/20">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
}
