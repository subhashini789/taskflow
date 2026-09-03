'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import Board from '@/components/Board';
import CreateTaskModal from '@/components/CreateTaskModal';
import AdminStats from '@/components/AdminStats';
import ProgressRing from '@/components/ProgressRing';
import { Task } from '@/types/task';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [view, setView] = useState<'board' | 'stats'>('board');

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
      if (user.role === 'admin') {
        fetchUsers();
      }
    }
  }, [user]);

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    // Check for reminders every 30 seconds
    const interval = setInterval(() => {
      const now = new Date().getTime();
      tasks.forEach(task => {
        if (task.status !== 'Done' && task.reminderAt) {
          const reminderTime = new Date(task.reminderAt).getTime();
          // If the reminder time has passed and is within the last 5 minutes (to avoid old spam)
          // We also use localStorage to track if we already reminded the user for this task
          if (now >= reminderTime && now - reminderTime < 5 * 60 * 1000) {
            const notifiedKey = `notified_${task._id}`;
            if (!localStorage.getItem(notifiedKey)) {
              alert(`⏰ Reminder: Task "${task.title}" is due!`);
              localStorage.setItem(notifiedKey, 'true');
            }
          }
        }
      });
    }, 30000); // 30s

    return () => clearInterval(interval);
  }, [tasks]);

  if (loading || !user) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {user.role === 'admin' ? 'Admin Dashboard' : 'Project Board'}
          </h1>
          <p className={styles.subtitle}>
            {user.role === 'admin'
              ? 'Overview and manage all tasks across the entire system.'
              : 'Manage your tasks and keep track of progress.'}
          </p>
          <div style={{ marginTop: '8px', fontSize: '14px', color: 'var(--primary)', fontWeight: '500' }}>
            📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {user.role === 'admin' && (
            <button
              className={styles.toggleBtn}
              onClick={() => setView(view === 'board' ? 'stats' : 'board')}
            >
              {view === 'board' ? '📊 View Stats' : '📋 View Board'}
            </button>
          )}
          <button
            className="btn-primary"
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
          >
            + New Task
          </button>
        </div>
      </header>

      {/* Motivational Progress Ring */}
      <ProgressRing
        completed={tasks.filter(t => t.status === 'Done').length}
        total={tasks.length}
      />

      {user.role === 'admin' && view === 'stats' ? (
        <AdminStats tasks={tasks} users={users} />
      ) : (
        <Board
          initialTasks={tasks}
          onTaskUpdated={fetchTasks}
          onEditTask={(task) => {
            setEditingTask(task);
            setIsModalOpen(true);
          }}
        />
      )}

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchTasks}
        taskToEdit={editingTask}
        currentUser={user}
      />
    </div>
  );
}
