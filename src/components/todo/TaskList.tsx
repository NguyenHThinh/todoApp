"use client"

import * as React from "react"
import { useTodoStore } from "@/store/useTodoStore"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function TaskList() {
    const { todos, toggleTodo, deleteTodo, groups, deleteGroup } = useTodoStore()

    // Group tasks by groupId
    const groupedTasks = React.useMemo(() => {
        const map = new Map<string, typeof todos>();

        // Initialize groups
        groups.forEach(g => map.set(g.id, []));

        // Assign todos
        todos.forEach(t => {
            const list = map.get(t.groupId);
            if (list) list.push(t);
        });

        return map;
    }, [todos, groups]);

    if (todos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground animate-in fade-in zoom-in duration-500">
                <div className="text-4xl mb-4">📝</div>
                <p className="font-medium">All caught up!</p>
                <p className="text-sm">Create a task to get started.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-20">
            {groups.map((group) => {
                const groupTodos = groupedTasks.get(group.id) || [];
                if (groupTodos.length === 0) return null;

                return (
                    <div key={group.id} className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-2 group/header">
                            <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: group.color || 'gray' }} />
                            <h3 className="font-bold text-lg tracking-tight">{group.name}</h3>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {groupTodos.length}
                            </span>
                            {group.id !== 'default' && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover/header:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                    onClick={() => {
                                        if (confirm(`Delete group "${group.name}" and all its tasks?`)) {
                                            deleteGroup(group.id)
                                        }
                                    }}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            )}
                        </div>

                        <div className="grid gap-3">
                            {groupTodos.map((todo) => (
                                <div
                                    key={todo.id}
                                    className={cn(
                                        "group flex items-start gap-3 p-4 rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/20",
                                        todo.completed && "opacity-60 bg-muted/30"
                                    )}
                                >
                                    <Checkbox
                                        id={todo.id}
                                        checked={todo.completed}
                                        onCheckedChange={() => toggleTodo(todo.id)}
                                        className="mt-1 rounded-full w-5 h-5 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-2 shrink-0 aspect-square"
                                    />
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <label
                                            htmlFor={todo.id}
                                            className={cn(
                                                "block text-sm sm:text-base leading-relaxed break-words font-medium cursor-pointer select-none",
                                                todo.completed && "line-through text-muted-foreground decoration-2 decoration-border"
                                            )}
                                        >
                                            {todo.text}
                                        </label>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                                        onClick={() => deleteTodo(todo.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
