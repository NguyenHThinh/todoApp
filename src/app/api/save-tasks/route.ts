import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const filePath = join(process.cwd(), 'src', 'data', 'tasks.json');
        
        await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving tasks:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to save tasks' },
            { status: 500 }
        );
    }
}

