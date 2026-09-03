'use client';
import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { User } from '@/context/AuthContext';
import api from '@/utils/api';
import styles from './Modal.module.css';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  taskToEdit?: Task | null;
  currentUser: User | null;
}

export default function CreateTaskModal({ isOpen, onClose, onSaved, taskToEdit, currentUser }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('To Do');
  const [assignee, setAssignee] = useState<string>(''); // empty string means unassigned
  const [reminderAt, setReminderAt] = useState<string>('');
  
  const [users, setUsers] = useState<User[]>([]);
  const isAdmin = ['admin', 'superadmin'].includes(currentUser?.role || '');

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description);
        setStatus(taskToEdit.status);
        setAssignee(taskToEdit.assignee?._id || '');
        setReminderAt(taskToEdit.reminderAt ? new Date(taskToEdit.reminderAt).toISOString().slice(0, 16) : '');
      } else {
        setTitle('');
        setDescription('');
        setStatus('To Do');
        setAssignee('');
        setReminderAt('');
      }

      if (isAdmin) {
        fetchUsers();
      }
    }
  }, [isOpen, taskToEdit, isAdmin]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { title, description, status };
      if (assignee) {
        payload.assignee = assignee;
      } else {
        payload.assignee = null;
      }
      
      if (reminderAt) {
        payload.reminderAt = new Date(reminderAt).toISOString();
      } else {
        payload.reminderAt = null;
      }

      if (taskToEdit) {
        await api.put(`/tasks/${taskToEdit._id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error('Failed to save task', err);
      alert('Failed to save task. Check console for details.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={`glass-panel ${styles.modal}`}>
        <h2>{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`input-field ${styles.textarea}`}
              rows={4}
            />
          </div>
          
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="input-field">
                <option value="To Do">To Do</option>
                <option value="Doing">Doing</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Assignee</label>
              {isAdmin ? (
                <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="input-field">
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              ) : (
                <select 
                  value={assignee} 
                  onChange={(e) => setAssignee(e.target.value)} 
                  className="input-field"
                  disabled={!!(taskToEdit && taskToEdit.assignee !== null && taskToEdit.assignee._id !== currentUser?._id)}
                >
                  <option value="">Unassigned</option>
                  <option value={currentUser?._id}>Assign to Me</option>
                  {taskToEdit && taskToEdit.assignee && taskToEdit.assignee._id !== currentUser?._id && (
                     <option value={taskToEdit.assignee._id}>{taskToEdit.assignee.name}</option>
                  )}
                </select>
              )}
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label>Reminder (Optional)</label>
            <input
              type="datetime-local"
              value={reminderAt}
              onChange={(e) => setReminderAt(e.target.value)}
              className="input-field"
            />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" className="btn-primary">{taskToEdit ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
