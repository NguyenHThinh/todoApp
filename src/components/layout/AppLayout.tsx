"use client"

import * as React from "react"
import { ThemeSelector } from "@/components/theme/ThemeSelector"
import { useThemeStore } from "@/store/useThemeStore"

export function AppLayout({ children }: { children: React.ReactNode }) {
    const { theme } = useThemeStore()

    React.useEffect(() => {
        const root = document.documentElement
        root.classList.remove('theme-ocean', 'theme-sunset', 'theme-forest')
        if (theme !== 'default') {
            root.classList.add(`theme-${theme}`)
        }
    }, [theme])

    return (
        <div className="min-h-screen w-full bg-background transition-colors duration-500">
            <header className="flex items-center justify-between p-4 border-b bg-background/50 backdrop-blur-md sticky top-0 z-10 w-full">
                <div className="flex items-center justify-between mx-auto max-w-5xl w-full">
                    <h1 className="text-xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">Todo Tasks</h1>
                    <div className="ml-auto">
                        <ThemeSelector />
                    </div>
                </div>
            </header>
            <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
                <div className="h-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
