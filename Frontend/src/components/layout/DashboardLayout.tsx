import React from 'react';

interface DashboardLayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sidebar }) => {
    return (
        <div className="flex h-screen w-screen bg-background overflow-hidden text-foreground">
            {/* Sidebar Area */}
            {sidebar && (
                <aside className="w-64 flex-shrink-0 border-r border-border bg-sidebar/50 backdrop-blur-md">
                    <div className="h-full flex flex-col p-4">
                        <h1 className="text-xl font-bold tracking-tighter text-primary mb-6 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                            RACE CONTROL
                        </h1>
                        <div className="flex-1 overflow-y-auto">
                            {sidebar}
                        </div>
                    </div>
                </aside>
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* CRT/Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20 mix-blend-overlay" />

                <div className="flex-1 overflow-auto p-6 relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
