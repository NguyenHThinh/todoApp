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

// Helper function to save data to JSON file
const saveToFile = async (state: { todos: Todo[]; groups: Group[]; selectedGroupId: string | null }) => {
    try {
        const dataToSave = {
            todos: state.todos,
            groups: state.groups,
            selectedGroupId: state.selectedGroupId,
            lastResetDate: initialData.lastResetDate || new Date().toISOString().split('T')[0]
        };
        
        await fetch('/api/save-tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSave),
        });
    } catch (error) {
        console.error('Error saving to file:', error);
    }
};

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
        set((state) => {
            const newState = { ...state, todos: [...state.todos, newTodo] };
            initialData.todos.push(newTodo);
            saveToFile(newState);
            return newState;
        });
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

        set((state) => {
            const newState = {
                ...state,
                groups: [...state.groups, newGroup],
                todos: [...state.todos, newTodo],
                selectedGroupId: newGroupId
            };
            initialData.todos.push(newTodo);
            initialData.groups.push(newGroup);
            initialData.selectedGroupId = newGroupId;
            saveToFile(newState);
            return newState;
        });
    },

    toggleTodo: (id) =>
        set((state) => {
            const newTodos = state.todos.map((t) =>
                t.id === id ? { ...t, completed: !t.completed } : t
            );
            const newState = { ...state, todos: newTodos };
            
            // Update initialData
            const todoIndex = initialData.todos.findIndex((t) => t.id === id);
            if (todoIndex !== -1) {
                initialData.todos[todoIndex].completed = !initialData.todos[todoIndex].completed;
            }
            
            saveToFile(newState);
            return newState;
        }),

    deleteTodo: (id) => {
        set((state) => {
            const newTodos = state.todos.filter((t) => t.id !== id);
            const newState = { ...state, todos: newTodos };
            
            // Update initialData
            initialData.todos = initialData.todos.filter((t) => t.id !== id);
            
            saveToFile(newState);
            return newState;
        });
    },

    addGroup: (name, color) => {
        const id = crypto.randomUUID();
        const finalColor = color || `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
        const newGroup: Group = { id, name, color: finalColor };
        
        set((state) => {
            const newState = {
                ...state,
                groups: [...state.groups, newGroup]
            };
            initialData.groups.push(newGroup);
            saveToFile(newState);
            return newState;
        });
        return id;
    },

    deleteGroup: (id) =>
        set((state) => {
            const newGroups = state.groups.filter((g) => g.id !== id);
            const newTodos = state.todos.filter((t) => t.groupId !== id);
            const newSelectedId = state.selectedGroupId === id ? 'default' : state.selectedGroupId;

            const newState = {
                ...state,
                groups: newGroups,
                todos: newTodos,
                selectedGroupId: newSelectedId
            };
            
            // Update initialData
            initialData.groups = initialData.groups.filter((g) => g.id !== id);
            initialData.todos = initialData.todos.filter((t) => t.groupId !== id);
            initialData.selectedGroupId = newSelectedId || 'default';
            
            saveToFile(newState);
            return newState;
        }),

    selectGroup: (id) => 
        set((state) => {
            const newState = { ...state, selectedGroupId: id };
            initialData.selectedGroupId = id || 'default';
            saveToFile(newState);
            return newState;
        }),
}));
