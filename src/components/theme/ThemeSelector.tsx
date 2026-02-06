"use client"

import * as React from "react"
import { Moon, Sun, Palette, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { useThemeStore, Theme } from "@/store/useThemeStore"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function ThemeSelector() {
    const { setTheme: setMode, theme: mode } = useTheme()
    const { theme: colorTheme, setTheme: setColorTheme } = useThemeStore()

    const themes: { value: Theme; label: string; color: string }[] = [
        { value: 'default', label: 'Default', color: 'bg-zinc-900 dark:bg-zinc-100' },
        { value: 'ocean', label: 'Ocean', color: 'bg-blue-600' },
        { value: 'sunset', label: 'Sunset', color: 'bg-orange-600' },
        { value: 'forest', label: 'Forest', color: 'bg-green-600' }
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Palette className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setMode("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                    {mode === 'light' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMode("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                    {mode === 'dark' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMode("system")}>
                    <span className="mr-6">💻</span>
                    <span>System</span>
                    {mode === 'system' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
                {themes.map((t) => (
                    <DropdownMenuItem key={t.value} onClick={() => setColorTheme(t.value)} className="gap-2 cursor-pointer">
                        <div className={cn("h-4 w-4 rounded-full border", t.color)} />
                        <span>{t.label}</span>
                        {colorTheme === t.value && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
