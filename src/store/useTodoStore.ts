import { create } from 'zustand';
import { Todo, Group } from '@/types/todo';
import initialData from '@/data/tasks.json';

interface TodoState {
    todos: Todo[];
    groups: Group[];
    selectedGroupId: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    addTodo: (text: string, groupId: string) => void;
    addTodoWithNewGroup: (text: string, groupName: string) => void;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;

    addGroup: (name: string, color?: string) => string;
    deleteGroup: (id: string) => void;
    selectGroup: (id: string | null) => void;

    // Removed fetchData as we load directly
}

export const useTodoStore = create<TodoState>((set) => ({
    // Initialize directly from the JSON file
    todos: initialData.todos as Todo[],
    groups: initialData.groups as Group[],
    selectedGroupId: initialData.selectedGroupId, // or default to 'default'
    isLoading: false,
    error: null,

    addTodo: (text, groupId) => {
        const newTodo: Todo = {
            id: crypto.randomUUID(),
            text,
            completed: false,
            groupId,
        };
        set((state) => ({ todos: [...state.todos, newTodo] }));
    },

    addTodoWithNewGroup: (text, groupName) => {
        const newGroupId = crypto.randomUUID();
        const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
        const newGroup: Group = {
            id: newGroupId,
            name: groupName,
            color: randomColor,
        };
        const newTodo: Todo = {
            id: crypto.randomUUID(),
            text,
            completed: false,
            groupId: newGroupId,
        };

        set((state) => ({
            groups: [...state.groups, newGroup],
            todos: [...state.todos, newTodo],
            selectedGroupId: newGroupId
        }));
    },

    toggleTodo: (id) =>
        set((state) => ({
            todos: state.todos.map((t) =>
                t.id === id ? { ...t, completed: !t.completed } : t
            )
        })),

    deleteTodo: (id) =>
        set((state) => ({
            todos: state.todos.filter((t) => t.id !== id)
        })),

    addGroup: (name, color) => {
        const id = crypto.randomUUID();
        const finalColor = color || `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
        set((state) => ({
            groups: [...state.groups, { id, name, color: finalColor }]
        }));
        return id;
    },

    deleteGroup: (id) =>
        set((state) => {
            const newGroups = state.groups.filter((g) => g.id !== id);
            const newTodos = state.todos.filter((t) => t.groupId !== id);
            const newSelectedId = state.selectedGroupId === id ? 'default' : state.selectedGroupId;

            return {
                groups: newGroups,
                todos: newTodos,
                selectedGroupId: newSelectedId
            };
        }),

    selectGroup: (id) => set({ selectedGroupId: id }),
}));
