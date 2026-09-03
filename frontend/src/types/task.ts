export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'To Do' | 'Doing' | 'Done';
  creator: {
    _id: string;
    name: string;
    email: string;
  };
  assignee: {
    _id: string;
    name: string;
    email: string;
  } | null;
  reminderAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
