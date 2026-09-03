'use client';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import { Task } from '@/types/task';
import styles from './Board.module.css';

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export default function Column({ id, title, tasks, onEditTask }: ColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const columnClass = id.replace(' ', '').toLowerCase(); // todo, doing, done

  return (
    <div 
      ref={setNodeRef} 
      className={`${styles.column} ${isOver ? styles.columnOver : ''}`}
      style={{ borderColor: `var(--${columnClass}-border)`, backgroundColor: `var(--col-${columnClass})` }}
    >
      <div className={styles.columnHeader}>
        <h3>{title}</h3>
        <span className={styles.taskCount}>{tasks.length}</span>
      </div>
      <div className={styles.taskList}>
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onEdit={onEditTask} />
        ))}
      </div>
    </div>
  );
}
