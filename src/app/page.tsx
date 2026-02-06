"use client"
import { AppLayout } from '@/components/layout/AppLayout';
import { TaskList } from '@/components/todo/TaskList';
import { AddTask } from '@/components/todo/AddTask';

export default function Home() {
  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto py-0 md:py-6">
        <div className="space-y-1 mb-4 md:mb-8">
          <h1 className="md:block hidden text-4xl font-extrabold tracking-tight lg:text-5xl">Tasks</h1>
          <p className="md:block hidden text-lg text-muted-foreground">Stay organized and focused on your goals.</p>
        </div>

        <section className="space-y-4">
          <AddTask />
        </section>

        <section className="pt-4">
          <h2 className="md:block hidden text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Your List</h2>
          <TaskList />
        </section>
      </div>
    </AppLayout>
  );
}
