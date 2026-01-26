import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { ExtensionSidePanel } from './ExtensionSidePanel.tsx';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <ExtensionSidePanel />
                <Toaster />
                <Sonner />
            </TooltipProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
