import React, { useState } from 'react';
import { ViewType } from './types';
import { useTaskStore } from './store/useTaskStore';
import { useFilters } from './hooks/useFilters';
import { usePresence } from './hooks/usePresence';
import { TopBar } from './components/common/TopBar';
import { FilterBar } from './components/filters/FilterBar';
import { KanbanView } from './components/kanban/KanbanView';
import { ListView } from './components/list/ListView';
import { TimelineView } from './components/timeline/TimelineView';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('kanban');
  const tasks = useTaskStore((s) => s.tasks);
  const { filters, setFilters, filteredTasks, clearFilters, isActive } = useFilters(tasks);
  const presenceMap = usePresence(filteredTasks);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      <TopBar view={view} setView={setView} presenceMap={presenceMap} />
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        isActive={isActive}
        onClear={clearFilters}
      />

      {view === 'kanban' && (
        <KanbanView tasks={filteredTasks} presenceMap={presenceMap} />
      )}
      {view === 'list' && (
        <ListView
          tasks={filteredTasks}
          clearFilters={clearFilters}
          isFilterActive={isActive}
        />
      )}
      {view === 'timeline' && (
        <TimelineView tasks={filteredTasks} />
      )}
    </div>
  );
};

export default App;