"use client"

import * as React from "react"
import { Plus, Check, X } from "lucide-react"
import { useTodoStore } from "@/store/useTodoStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export function AddTask() {
    const { groups, selectedGroupId, addTodo, addTodoWithNewGroup } = useTodoStore()

    const [text, setText] = React.useState("")
    const [targetGroupId, setTargetGroupId] = React.useState<string>(selectedGroupId || 'default')
    const [isCreatingGroup, setIsCreatingGroup] = React.useState(false)
    const [newGroupName, setNewGroupName] = React.useState("")

    // Update target group when selected group changes externally (e.g. sidebar click)
    React.useEffect(() => {
        if (selectedGroupId) {
            setTargetGroupId(selectedGroupId)
            setIsCreatingGroup(false)
        }
    }, [selectedGroupId])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!text.trim()) return

        if (isCreatingGroup) {
            if (!newGroupName.trim()) return; // Must have name
            addTodoWithNewGroup(text.trim(), newGroupName.trim())
            setText("")
            setNewGroupName("")
            setIsCreatingGroup(false)
            // Store logic switches selection to new group automatically
        } else {
            addTodo(text.trim(), targetGroupId)
            setText("")
        }
    }

    const handleGroupChange = (val: string) => {
        if (val === 'CREATE_NEW') {
            setIsCreatingGroup(true)
            setTargetGroupId("") // Clear selection visually
        } else {
            setIsCreatingGroup(false)
            setTargetGroupId(val)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 bg-muted/30 rounded-2xl border border-dashed border-border/60 hover:border-sidebar-primary/50 transition-colors">
            <div className="flex gap-2">
                <Input
                    className="flex-1 bg-background border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary font-medium text-lg placeholder:text-muted-foreground/50"
                    placeholder="Add a task..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    autoFocus
                />
            </div>

            <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2 flex-1">
                    {/* Group Selector */}
                    {isCreatingGroup ? (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                            <Input
                                className="h-8 w-40 text-sm bg-background"
                                placeholder="New Group Name"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => { setIsCreatingGroup(false); setTargetGroupId(selectedGroupId || 'default'); }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <Select value={targetGroupId} onValueChange={handleGroupChange}>
                            <SelectTrigger className="w-[140px] h-8 text-xs bg-background/50 border-transparent hover:bg-background transition-colors">
                                <SelectValue placeholder="Select Group" />
                            </SelectTrigger>
                            <SelectContent>
                                {groups.map((g) => (
                                    <SelectItem key={g.id || 'default'} value={g.id || 'default'}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color || 'currentColor' }} />
                                            {g.name}
                                        </div>
                                    </SelectItem>
                                ))}
                                <SelectItem value="CREATE_NEW" className="font-semibold text-primary focus:text-primary">
                                    <div className="flex items-center gap-2">
                                        <Plus className="w-3 h-3" /> Create Group
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                </div>

                <Button type="submit" size="sm" disabled={!text.trim()} className={cn("transition-all", text.trim() ? "opacity-100" : "opacity-50")}>
                    Add Task <Plus className="ml-1 h-3 w-3" />
                </Button>
            </div>
        </form>
    )
}
