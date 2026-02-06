import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/data/tasks.json');

// Interface for type safety
interface Data {
    todos: any[];
    groups: any[];
    selectedGroupId: string;
    lastResetDate?: string;
}

// Ensure the file exists
if (!fs.existsSync(dataFilePath)) {
    const initialData: Data = {
        todos: [],
        groups: [
            {
                id: "default",
                name: "Daily",
                color: "hsl(var(--primary))"
            }
        ],
        selectedGroupId: "default",
        lastResetDate: new Date().toISOString().split('T')[0]
    };
    fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2));
}

export async function GET() {
    try {
        const fileContents = fs.readFileSync(dataFilePath, 'utf8');
        let data: Data = JSON.parse(fileContents);

        // Check for daily reset
        const today = new Date().toISOString().split('T')[0];
        if (data.lastResetDate !== today) {
            // It's a new day! Reset all tasks.
            data.todos = data.todos.map(todo => ({
                ...todo,
                completed: false
            }));
            data.lastResetDate = today;

            // Save the reset state immediately
            fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Simple validation (can be improved)
        if (!body.todos || !body.groups) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        // Preserve the lastResetDate if strict, or let it update if passed. 
        // Usually, we just want to save the state provided by the client, 
        // but the client might not know about 'lastResetDate' if we didn't add it to the store type yet.
        // Let's read the current file to get the lastResetDate to be safe, or assume client sends it back if we updated the store type.
        // For safety: Check if body has lastResetDate, if not, read from file.

        let lastResetDate = body.lastResetDate;

        if (!lastResetDate) {
            // Try to keep existing date if client dropped it
            try {
                const currentFile = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
                lastResetDate = currentFile.lastResetDate;
            } catch (e) {
                lastResetDate = new Date().toISOString().split('T')[0];
            }
        }

        const newData = {
            ...body,
            lastResetDate: lastResetDate || new Date().toISOString().split('T')[0]
        };

        fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
