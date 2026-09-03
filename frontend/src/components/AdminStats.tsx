'use client';
import { Task } from '@/types/task';
import { User } from '@/context/AuthContext';
import styles from './AdminStats.module.css';
import api from '@/utils/api';

interface AdminStatsProps {
  tasks: Task[];
  users: User[];
  onUserUpdated: () => void;
  currentUser: User;
}

export default function AdminStats({ tasks, users, onUserUpdated, currentUser }: AdminStatsProps) {
  const handlePromote = async (userId: string) => {
    try {
      await api.put(`/auth/users/${userId}/promote`);
      onUserUpdated();
    } catch (err) {
      console.error('Failed to promote user', err);
      alert('Failed to promote user. Check console for details.');
    }
  };

  const handleDemote = async (userId: string) => {
    try {
      await api.put(`/auth/users/${userId}/demote`);
      onUserUpdated();
    } catch (err) {
      console.error('Failed to demote user', err);
      alert('Failed to demote user. Check console for details.');
    }
  };
  // Aggregate stats per user
  const stats = users.map(user => {
    const userTasks = tasks.filter(t => t.assignee?._id === user._id);
    return {
      user,
      todo: userTasks.filter(t => t.status === 'To Do').length,
      doing: userTasks.filter(t => t.status === 'Doing').length,
      done: userTasks.filter(t => t.status === 'Done').length,
      total: userTasks.length
    };
  });

  // Calculate unassigned tasks
  const unassignedTasks = tasks.filter(t => t.assignee === null);
  const unassignedStats = {
    todo: unassignedTasks.filter(t => t.status === 'To Do').length,
    doing: unassignedTasks.filter(t => t.status === 'Doing').length,
    done: unassignedTasks.filter(t => t.status === 'Done').length,
    total: unassignedTasks.length
  };

  return (
    <div className={`glass-panel ${styles.container}`}>
      <h2 className={styles.title}>System Overview</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>To Do</th>
              <th>Doing</th>
              <th>Done</th>
              <th>Total Tasks</th>
              {currentUser.role === 'superadmin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {stats.map(stat => (
              <tr key={stat.user._id}>
                <td>
                  <div className={styles.userInfo}>
                    <span className={styles.name}>{stat.user.name}</span>
                    <span className={styles.email}>{stat.user.email}</span>
                  </div>
                </td>
                <td><span className={styles.badge}>{stat.user.role}</span></td>
                <td>{stat.todo}</td>
                <td>{stat.doing}</td>
                <td className={styles.success}>{stat.done}</td>
                <td className={styles.bold}>{stat.total}</td>
                {currentUser.role === 'superadmin' && (
                  <td>
                    {stat.user.role === 'user' && (
                      <button 
                        className={styles.promoteBtn}
                        onClick={() => handlePromote(stat.user._id)}
                      >
                        Promote to Admin
                      </button>
                    )}
                    {stat.user.role === 'admin' && (
                      <button 
                        className={styles.demoteBtn}
                        onClick={() => handleDemote(stat.user._id)}
                      >
                        Remove Admin
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {/* Unassigned row */}
            <tr className={styles.unassignedRow}>
              <td>
                <div className={styles.userInfo}>
                  <span className={styles.name}>Unassigned</span>
                  <span className={styles.email}>Tasks with no owner</span>
                </div>
              </td>
              <td>-</td>
              <td>{unassignedStats.todo}</td>
              <td>{unassignedStats.doing}</td>
              <td className={styles.success}>{unassignedStats.done}</td>
              <td className={styles.bold}>{unassignedStats.total}</td>
              {currentUser.role === 'superadmin' && <td></td>}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
