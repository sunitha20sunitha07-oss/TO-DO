import { Search, X, ArrowUpDown, Filter } from 'lucide-react';
import { Category, FilterStatus, SortOption } from '../types.ts';

interface TaskFiltersProps {
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

const CATEGORIES: ('All' | Category)[] = ['All', 'General', 'Personal', 'Work', 'Study', 'Health', 'Shopping'];

export default function TaskFilters({
  filterStatus,
  onFilterChange,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
  counts,
}: TaskFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Search Bar & Sort */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-xl placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                aria-label="Sort tasks"
                className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer text-xs pr-1"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="priority">Highest priority</option>
                <option value="dueDate">Due date</option>
                <option value="alphabetical">A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs & Categories */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
        {/* Status Tabs */}
        <div className="flex items-center p-1 bg-slate-200/60 rounded-xl text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All <span className="ml-1 text-[11px] opacity-75">({counts.all})</span>
          </button>
          <button
            onClick={() => onFilterChange('active')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterStatus === 'active'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active <span className="ml-1 text-[11px] opacity-75">({counts.active})</span>
          </button>
          <button
            onClick={() => onFilterChange('completed')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterStatus === 'completed'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed <span className="ml-1 text-[11px] opacity-75">({counts.completed})</span>
          </button>
        </div>

        {/* Category Pill Dropdown */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:inline" />
          <div className="flex items-center gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
