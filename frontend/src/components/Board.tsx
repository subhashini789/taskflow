'use client';
import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import confetti from 'canvas-confetti';
import Column from './Column';
import { Task } from '@/types/task';
import api from '@/utils/api';
import styles from './Board.module.css';

interface BoardProps {
  initialTasks: Task[];
  onTaskUpdated: () => void;
  onEditTask: (task: Task) => void;
}

export default function Board({ initialTasks, onTaskUpdated, onEditTask }: BoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Task['status'];

    const activeTask = tasks.find((t) => t._id === taskId);
    if (!activeTask || activeTask.status === newStatus) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId ? { ...t, status: newStatus } : t
      )
    );

    if (newStatus === 'Done') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      onTaskUpdated();
    } catch (error) {
      console.error('Failed to update task status:', error);
      // Revert optimistic update
      setTasks(initialTasks);
    }
  };

  const columns = ['To Do', 'Doing', 'Done'] as const;

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className={styles.boardContainer}>
        {columns.map((status) => (
          <Column
            key={status}
            id={status}
            title={status}
            tasks={tasks.filter((t) => t.status === status)}
            onEditTask={onEditTask}
          />
        ))}
      </div>
    </DndContext>
  );
}
