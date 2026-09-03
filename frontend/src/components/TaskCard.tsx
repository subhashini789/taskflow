'use client';
import { useDraggable } from '@dnd-kit/core';
import { Task } from '@/types/task';
import styles from './Board.module.css';
import { useAuth } from '@/context/AuthContext';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
    data: { task },
  });
  const { user } = useAuth();

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999,
  } : undefined;

  const isAdmin = ['admin', 'superadmin'].includes(user?.role || '');
  const isCreator = user?._id === task.creator?._id;
  const isAssignee = user?._id === task.assignee?._id;
  const isUnassigned = task.assignee === null;
  const canEdit = isAdmin || isCreator || isAssignee || isUnassigned;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass-panel ${styles.card} ${isDragging ? styles.dragging : ''}`}
      {...listeners}
      {...attributes}
    >
      <div className={styles.cardHeader}>
        <h4 className={styles.cardTitle}>{task.title}</h4>
        {canEdit && (
          <button 
            className={styles.editBtn} 
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            Edit
          </button>
        )}
      </div>
      <p className={styles.cardDesc}>{task.description}</p>
      {task.reminderAt && (
        <div style={{ fontSize: '12px', color: '#fcd34d', marginTop: '4px' }}>
          ⏰ Reminder: {new Date(task.reminderAt).toLocaleString()}
        </div>
      )}
      <div className={styles.cardFooter} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
        <div className={styles.assignee}>
          {task.assignee ? `👤 Assigned: ${task.assignee.name}` : '👤 Unassigned'}
        </div>
        {(user?.role === 'admin' || user?._id !== task.creator?._id) && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Created by: {task.creator?.name}
          </div>
        )}
      </div>
    </div>
  );
}
