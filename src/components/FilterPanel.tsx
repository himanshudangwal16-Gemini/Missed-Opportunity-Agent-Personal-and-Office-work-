import React from 'react';
import { Filter, X } from 'lucide-react';
import { useOpportunityStore } from '../store/opportunityStore';
import { FilterOptions } from '../types';

export const FilterPanel: React.FC = () => {
  const { filters, setFilters, applyFilters } = useOpportunityStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const activeFilterCount = Object.values(filters).filter(
    v => v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : v !== '')
  ).length;

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Filters</span>
        {activeFilterCount > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-40 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Filter Options</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Type Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Type</label>
              <div className="space-y-2">
                {['office', 'personal', 'all'].map(type => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={filters.type === (type === 'all' ? undefined : type)}
                      onChange={e =>
                        handleFilterChange({ type: e.target.value === 'all' ? undefined : (e.target.value as any) })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-600 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Priority</label>
              <div className="space-y-2">
                {['high', 'medium', 'low'].map(priority => (
                  <label key={priority} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.priority?.includes(priority as any) ?? false}
                      onChange={e => {
                        const current = filters.priority ?? [];
                        const newPriorities = e.target.checked
                          ? [...current, priority]
                          : current.filter(p => p !== priority);
                        handleFilterChange({ priority: newPriorities as any });
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-600 capitalize">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Decay Risk Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Decay Risk</label>
              <div className="space-y-2">
                {['high', 'med', 'low'].map(risk => (
                  <label key={risk} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.decayRisk?.includes(risk as any) ?? false}
                      onChange={e => {
                        const current = filters.decayRisk ?? [];
                        const newRisks = e.target.checked
                          ? [...current, risk]
                          : current.filter(r => r !== risk);
                        handleFilterChange({ decayRisk: newRisks as any });
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-600 capitalize">{risk}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Completed Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Status</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={filters.completed === undefined}
                    onChange={() => handleFilterChange({ completed: undefined })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-600">All</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={filters.completed === false}
                    onChange={() => handleFilterChange({ completed: false })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-600">Active</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={filters.completed === true}
                    onChange={() => handleFilterChange({ completed: true })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-600">Completed</span>
                </label>
              </div>
            </div>

            {/* Search */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Search</label>
              <input
                type="text"
                placeholder="Search opportunities..."
                value={filters.searchTerm ?? ''}
                onChange={e => handleFilterChange({ searchTerm: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <button
                onClick={clearFilters}
                className="flex-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  applyFilters();
                  setIsOpen(false);
                }}
                className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
