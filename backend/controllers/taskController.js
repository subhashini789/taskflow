const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    let tasks;
    if (['admin', 'superadmin'].includes(req.user.role)) {
      tasks = await Task.find({}).populate('creator assignee', 'name email');
    } else {
      // Normal user can see tasks assigned to them or tasks created by them
      tasks = await Task.find({
        $or: [
          { assignee: req.user.id },
          { creator: req.user.id }
        ]
      }).populate('creator assignee', 'name email');
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createTask = async (req, res) => {
  const { title, description, status, assignee, reminderAt } = req.body;

  try {
    let finalAssignee = assignee;

    // Normal users can only assign unassigned tasks to themselves during creation
    // But since this is creation, it's either assigned to themselves or unassigned.
    if (!['admin', 'superadmin'].includes(req.user.role)) {
      if (assignee && assignee !== req.user.id) {
        return res.status(403).json({ message: 'You can only assign tasks to yourself' });
      }
    }

    const task = new Task({
      title,
      description,
      status: status || 'To Do',
      creator: req.user.id,
      assignee: finalAssignee || null,
      reminderAt: reminderAt || null,
    });

    const createdTask = await task.save();
    const populatedTask = await Task.findById(createdTask._id).populate('creator assignee', 'name email');
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  const { title, description, status, assignee, reminderAt } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (['admin', 'superadmin'].includes(req.user.role)) {
      // Admin can update anything
      task.title = title !== undefined ? title : task.title;
      task.description = description !== undefined ? description : task.description;
      task.status = status !== undefined ? status : task.status;
      task.assignee = assignee !== undefined ? assignee : task.assignee;
      task.reminderAt = reminderAt !== undefined ? reminderAt : task.reminderAt;
    } else {
      // Normal user
      // They can manage their own tasks (created by them or assigned to them)
      if (task.creator.toString() !== req.user.id && (task.assignee && task.assignee.toString() !== req.user.id)) {
        // Exception: they can assign an unassigned task to themselves
        if (task.assignee === null && assignee === req.user.id) {
           task.assignee = req.user.id;
        } else {
           return res.status(403).json({ message: 'Not authorized to update this task' });
        }
      }

      // If authorized, they can update status, title, description
      task.title = title !== undefined ? title : task.title;
      task.description = description !== undefined ? description : task.description;
      task.status = status !== undefined ? status : task.status;
      task.reminderAt = reminderAt !== undefined ? reminderAt : task.reminderAt;
      
      // They can assign an unassigned task to themselves, but cannot reassign to others
      if (assignee !== undefined) {
         if (task.assignee === null && assignee === req.user.id) {
             task.assignee = assignee;
         } else if (assignee !== task.assignee?.toString() && assignee !== null) {
             return res.status(403).json({ message: 'Not authorized to reassign tasks' });
         } else if (assignee === null) {
             task.assignee = null; // Can unassign themselves maybe? Requirements say "assign unassigned tasks only to themselves". Let's allow unassigning themselves.
         }
      }
    }

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id).populate('creator assignee', 'name email');
    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (['admin', 'superadmin'].includes(req.user.role) || task.creator.toString() === req.user.id) {
      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(403).json({ message: 'Not authorized to delete this task' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
