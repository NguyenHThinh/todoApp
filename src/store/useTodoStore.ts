import { create } from 'zustand';
import { Todo, Group } from '@/types/todo';
import { v4 as uuidv4 } from 'uuid';

interface TodoState {
    todos: Todo[];
    groups: Group[];
    selectedGroupId: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchData: () => Promise<void>;
    addTodo: (text: string, groupId: string) => void;
    addTodoWithNewGroup: (text: string, groupName: string) => void;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;

    addGroup: (name: string, color?: string) => string;
    deleteGroup: (id: string) => void;
    selectGroup: (id: string | null) => void;
}

// Helper to debounce or throttle saves could be added here, 
// but for simplicity we'll save on every change for now.
const saveStateToApi = async (todos: Todo[], groups: Group[], selectedGroupId: string | null) => {
    try {
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ todos, groups, selectedGroupId }),
        });
    } catch (error) {
        console.error('Failed to save state:', error);
    }
};

export const useTodoStore = create<TodoState>((set, get) => ({
    todos: [],
    groups: [
        { id: 'default', name: 'Daily', color: 'hsl(var(--primary))' },
    ],
    selectedGroupId: 'default',
    isLoading: false,
    error: null,

    fetchData: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch('/api/tasks');
            if (!res.ok) throw new Error('Failed to fetch data');
            const data = await res.json();
            set({
                todos: data.todos || [],
                groups: data.groups || [],
                selectedGroupId: data.selectedGroupId || 'default',
                isLoading: false
            });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    addTodo: (text, groupId) => {
        const newTodo: Todo = {
            id: uuidv4(),
            text,
            completed: false,
            groupId,
            createdAt: Date.now(),
        };
        set((state) => {
            const newState = { todos: [...state.todos, newTodo] };
            saveStateToApi(newState.todos, state.groups, state.selectedGroupId);
            return newState;
        });
    },

    addTodoWithNewGroup: (text, groupName) => {
        const newGroupId = uuidv4();
        const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
        const newGroup: Group = {
            id: newGroupId,
            name: groupName,
            color: randomColor,
        };
        const newTodo: Todo = {
            id: uuidv4(),
            text,
            completed: false,
            groupId: newGroupId,
            createdAt: Date.now(),
        };

        set((state) => {
            const newState = {
                groups: [...state.groups, newGroup],
                todos: [...state.todos, newTodo],
                selectedGroupId: newGroupId
            };
            saveStateToApi(newState.todos, newState.groups, newState.selectedGroupId);
            return newState;
        });
    },

    toggleTodo: (id) =>
        set((state) => {
            const newTodos = state.todos.map((t) =>
                t.id === id ? { ...t, completed: !t.completed } : t
            );
            saveStateToApi(newTodos, state.groups, state.selectedGroupId);
            return { todos: newTodos };
        }),

    deleteTodo: (id) =>
        set((state) => {
            const newTodos = state.todos.filter((t) => t.id !== id);
            saveStateToApi(newTodos, state.groups, state.selectedGroupId);
            return { todos: newTodos };
        }),

    addGroup: (name, color) => {
        const id = uuidv4();
        const finalColor = color || `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
        set((state) => {
            const newGroups = [...state.groups, { id, name, color: finalColor }];
            saveStateToApi(state.todos, newGroups, state.selectedGroupId);
            return { groups: newGroups };
        });
        return id;
    },

    deleteGroup: (id) =>
        set((state) => {
            const newGroups = state.groups.filter((g) => g.id !== id);
            const newTodos = state.todos.filter((t) => t.groupId !== id);
            const newSelectedId = state.selectedGroupId === id ? 'default' : state.selectedGroupId;

            saveStateToApi(newTodos, newGroups, newSelectedId);

            return {
                groups: newGroups,
                todos: newTodos,
                selectedGroupId: newSelectedId
            };
        }),

    selectGroup: (id) => set((state) => {
        saveStateToApi(state.todos, state.groups, id);
        return { selectedGroupId: id };
    }),
}));
