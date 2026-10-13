import { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Calendar,
  Sparkles,
  RotateCcw,
  PlusCircle,
  Inbox,
  FilterX,
} from 'lucide-react';
import { Task, FilterStatus, SortOption } from './types.ts';
import { loadTasks, saveTasks, INITIAL_TASKS } from './utils/storage.ts';
import TaskInput from './components/TaskInput.tsx';
import TaskItem from './components/TaskItem.tsx';
import TaskStats from './components/TaskStats.tsx';
import TaskFilters from './components/TaskFilters.tsx';
import UndoToast from './components/UndoToast.tsx';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Undo deletion state
  const [deletedTask, setDeletedTask] = useState<{ task: Task; index: number } | null>(null);
  const [toastTimeout, setToastTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Add Task
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Toggle Task Completion
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Delete Task with Undo Option
  const handleDeleteTask = (id: string) => {
    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) return;

    const taskToRemove = tasks[taskIndex];

    // Clear any existing toast timeout
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    setDeletedTask({ task: taskToRemove, index: taskIndex });
    setTasks((prev) => prev.filter((t) => t.id !== id));

    const timeout = setTimeout(() => {
      setDeletedTask(null);
    }, 5000);
    setToastTimeout(timeout);
  };

  // Undo delete
  const handleUndoDelete = () => {
    if (!deletedTask) return;
    setTasks((prev) => {
      const copy = [...prev];
      copy.splice(deletedTask.index, 0, deletedTask.task);
      return copy;
    });
    if (toastTimeout) clearTimeout(toastTimeout);
    setDeletedTask(null);
  };

  // Edit Task Text
  const handleEditTask = (id: string, newText: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  // Clear completed tasks
  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  // Reset to initial sample tasks
  const handleResetSampleTasks = () => {
    setTasks(INITIAL_TASKS);
  };

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (filterStatus === 'active' && task.completed) return false;
        if (filterStatus === 'completed' && !task.completed) return false;

        // Category filter
        if (selectedCategory !== 'All' && task.category !== selectedCategory) {
          return false;
        }

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchText = task.text.toLowerCase().includes(q);
          const matchCategory = task.category.toLowerCase().includes(q);
          return matchText || matchCategory;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'oldest':
            return a.createdAt - b.createdAt;
          case 'priority': {
            const priorityWeight = { high: 3, medium: 2, low: 1 };
            return priorityWeight[b.priority] - priorityWeight[a.priority];
          }
          case 'dueDate': {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate.localeCompare(b.dueDate);
          }
          case 'alphabetical':
            return a.text.localeCompare(b.text);
          case 'newest':
          default:
            return b.createdAt - a.createdAt;
        }
      });
  }, [tasks, filterStatus, selectedCategory, searchQuery, sortOption]);

  const counts = useMemo(
    () => ({
      all: tasks.length,
      active: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    }),
    [tasks]
  );

  // Formatted current date
  const todayDateString = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }).format(new Date());
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 transition-all">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                TaskFlow
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Simple & clean to-do planner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 text-xs text-slate-600 font-medium px-2.5 py-1 bg-slate-100 rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{todayDateString}</span>
            </div>

            {tasks.length === 0 && (
              <button
                onClick={handleResetSampleTasks}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
                title="Load sample tasks"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sample Tasks</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Welcome / Stats Banner */}
        <TaskStats tasks={tasks} onClearCompleted={handleClearCompleted} />

        {/* Task Creation Input */}
        <section aria-labelledby="add-task-heading">
          <h2 id="add-task-heading" className="sr-only">Add New Task</h2>
          <TaskInput onAddTask={handleAddTask} />
        </section>

        {/* Filters, Search & Categories */}
        {tasks.length > 0 && (
          <section aria-labelledby="filter-tasks-heading">
            <h2 id="filter-tasks-heading" className="sr-only">Filter Tasks</h2>
            <TaskFilters
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortOption={sortOption}
              onSortChange={setSortOption}
              counts={counts}
            />
          </section>
        )}

        {/* Task List Section */}
        <section aria-labelledby="task-list-heading" className="space-y-2.5">
          <h2 id="task-list-heading" className="sr-only">Task List</h2>

          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center my-4">
              {searchQuery || selectedCategory !== 'All' || filterStatus !== 'all' ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <FilterX className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-800">
                    No matching tasks found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your search terms or clearing the current filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setFilterStatus('all');
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-800">
                    Your task list is empty
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Add your first task in the box above, or load sample tasks to explore!
                  </p>
                  <button
                    onClick={handleResetSampleTasks}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Load Sample Tasks
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Helpful keyboard shortcut hints for beginners */}
        <footer className="pt-6 pb-2 text-center text-xs text-slate-400 border-t border-slate-200/60">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span>💡 <strong>Tip:</strong> Double click any task text to edit</span>
            <span>•</span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600 font-mono">Enter</kbd> to save</span>
            <span>•</span>
            <span>All tasks are automatically saved</span>
          </p>
        </footer>
      </main>

      {/* Undo Toast */}
      {deletedTask && (
        <UndoToast
          message={`"${deletedTask.task.text.slice(0, 28)}${deletedTask.task.text.length > 28 ? '...' : ''}" removed`}
          onUndo={handleUndoDelete}
          onDismiss={() => {
            if (toastTimeout) clearTimeout(toastTimeout);
            setDeletedTask(null);
          }}
        />
      )}
    </div>
  );
}
