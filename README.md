# Velozity — Multi-View Project Tracker

A fully-featured project management UI built with **React 18 + TypeScript**, featuring a custom drag-and-drop system, virtual scrolling, live collaboration indicators, and full URL-state filter persistence.

---
## 🖼 UI Preview

> 📌 Add your screenshots inside an `/assets` folder

### 🧩 Kanban View
<img src="<img width="1600" height="759" alt="image" src="https://github.com/user-attachments/assets/304788dc-876f-4a2d-9e14-eeab9c4e9835" />
" width="800"/>

### 📋 List View
<img src="<img width="1600" height="758" alt="image" src="https://github.com/user-attachments/assets/94efed30-c90f-4330-8409-764108351f67" />
" width="800"/>

### 📊 Timeline View
<img src="<img width="1600" height="757" alt="image" src="https://github.com/user-attachments/assets/df52c702-1d85-4d0f-a940-9b9559668f92" />
" width="800"/>

---

## 🚀 Quick Start

```bash
npm install
npm start
```

App opens at `http://localhost:3000`.

To generate a production build:

```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Shared UI: Avatar, PriorityBadge, MultiSelect, TopBar, PresenceBar
│   ├── filters/         # FilterBar with multi-select, date range, URL sync
│   ├── kanban/          # KanbanView, KanbanColumn, TaskCard, DragGhost
│   ├── list/            # ListView (virtual scroll), ListRow
│   └── timeline/        # TimelineView (Gantt)
├── data/
│   ├── constants.ts     # USERS, STATUSES, PRIORITIES, shared config
│   └── generator.ts     # 500-task seed generator with edge cases
├── hooks/
│   ├── useDragDrop.ts   # Custom mouse + touch drag-and-drop (no libraries)
│   ├── useFilters.ts    # Filter state + URL sync + task filtering
│   ├── usePresence.ts   # Simulated real-time collaboration
│   └── useVirtualScroll.ts  # Virtual scrolling from scratch
├── store/
│   └── useTaskStore.ts  # Zustand global task store
├── types/
│   └── index.ts         # All TypeScript interfaces and types
└── utils/
    └── index.ts         # Helpers: formatDue, getPriorityColor, URL helpers
```

---

## 🧠 Architecture Decisions

### State Management: Zustand

**Choice:** Zustand over React Context + useReducer.

**Rationale:**
- Task state (500 items) is mutated from multiple locations: Kanban drag-drop, List inline status dropdowns, and potentially the Timeline. Zustand's selector-based subscriptions ensure only components that care about the changed slice re-render — critical for performance at 500 tasks.
- Context + useReducer would require wrapping the entire tree in a Provider, causing all consumers to re-render on every dispatch (even unrelated ones), unless memoised aggressively with `useMemo` + `useCallback` — which adds boilerplate that Zustand eliminates.
- Zustand has no Provider boilerplate. Any component can read/write the store with a single hook.
- Zustand's devtools middleware integrates with Redux DevTools for easy debugging.

**Filter state** stays in `useFilters` (local hook + URL) rather than Zustand, because filters are view-local UI state — not shared business data.

### Custom Drag-and-Drop (no libraries)

Implemented in `src/hooks/useDragDrop.ts` using native HTML5 `DragEvent` API + `TouchEvent`:

- `onDragStart` suppresses the browser ghost image (transparent 1×1 GIF), captures card dimensions, sets dragging state.
- A global `dragover` listener on `document` updates ghost position every frame.
- `onDragEnd` checks if `dragOverStatus` differs from source status → calls `moveTask`, otherwise triggers the snap-back animation (CSS transition on opacity + transform).
- Touch: `touchstart` mirrors drag start; a non-passive `touchmove` listener moves the ghost and performs `document.elementFromPoint` hit-testing against `[data-col]` elements to detect the active drop zone.

### Virtual Scrolling (no libraries)

Implemented in `src/hooks/useVirtualScroll.ts`:

- A `ResizeObserver` tracks the container's visible height.
- A passive `scroll` event listener on the container updates `scrollTop`.
- `startIndex = floor(scrollTop / ROW_HEIGHT) - BUFFER` and `endIndex = ceil((scrollTop + viewHeight) / ROW_HEIGHT) + BUFFER`.
- Only rows in `[startIndex, endIndex]` are rendered as absolutely-positioned divs at `top = index * ROW_HEIGHT`.
- The outer container's height is set to `totalItems * ROW_HEIGHT` to maintain correct scrollbar size and position.
- Buffer of 5 rows above and below prevents flicker on fast scroll.

### Live Collaboration Indicators

Implemented in `src/hooks/usePresence.ts`:

- A `setInterval` running every 3,500 ms re-assigns the 4 simulated users to random tasks from the first 120 visible tasks.
- Each assignment is written to a `PresenceMap` (`{ [taskId]: SimUser[] }`).
- Task cards read from this map and render stacked presence avatars with CSS transitions.
- The `PresenceBar` in the topbar derives the unique active sim-users from the map.

### URL State Persistence

Filters are serialised to/from URL query parameters in `src/utils/index.ts`:

- `filtersToURL(filters)` calls `window.history.replaceState` (non-destructive, no page reload).
- `parseFiltersFromURL()` reads `window.location.search` on mount.
- A `popstate` listener restores filter state when the user presses browser back/forward.
- This makes every filtered view bookmarkable and shareable.

---

## ✅ Feature Checklist

| Feature | Status |
|---|---|
| Kanban view — 4 columns, task counts, independent scroll | ✅ |
| Kanban — cards with title, assignee initials, priority badge, due date | ✅ |
| Kanban — overdue highlighting in red | ✅ |
| List view — flat sortable table | ✅ |
| List — sortable by title, priority, due date (toggle asc/desc) | ✅ |
| List — active sort column visually indicated | ✅ |
| List — inline status change via dropdown (no modal) | ✅ |
| Timeline — horizontal Gantt for current month | ✅ |
| Timeline — bars colour-coded by priority | ✅ |
| Timeline — today vertical marker | ✅ |
| Timeline — tasks with no start date shown as single-day marker | ✅ |
| Timeline — horizontally scrollable | ✅ |
| Drag-and-drop — no libraries, native events | ✅ |
| Drag — placeholder at original position | ✅ |
| Drag — ghost card follows cursor | ✅ |
| Drag — drop zones highlighted on hover | ✅ |
| Drag — snap-back animation on invalid drop | ✅ |
| Drag — touch device support | ✅ |
| Virtual scroll — no libraries | ✅ |
| Virtual scroll — 500 task dataset | ✅ |
| Virtual scroll — buffer rows, smooth scroll | ✅ |
| Presence — 4 simulated users | ✅ |
| Presence — coloured avatars on task cards | ✅ |
| Presence — animated transitions between tasks | ✅ |
| Presence — topbar "N viewing" count | ✅ |
| Presence — stacked avatars with +N overflow | ✅ |
| Filters — status, priority, assignee, date range | ✅ |
| Filters — instant (no submit) | ✅ |
| Filters — URL query parameter sync | ✅ |
| Filters — back/forward restores state | ✅ |
| Filters — "Clear all" only when active | ✅ |
| Empty state — styled empty Kanban columns | ✅ |
| Empty state — List with "Clear filters" CTA | ✅ |
| Edge case — "Due Today" label | ✅ |
| Edge case — ">7 days overdue" shows day count | ✅ |
| TypeScript — strict mode, no plain JS | ✅ |
| Zustand — global task store with justification | ✅ |
| No UI libraries — all components custom built | ✅ |
| Responsive — 1280px desktop + 768px tablet | ✅ |

---

## 🎨 Design System

- **Font:** Outfit (display/UI) + DM Mono (code/dates)
- **Theme:** Deep dark — `#0b0d11` base with indigo accent
- **Priority colours:** Critical = rose, High = orange, Medium = amber, Low = teal
- **Status colours:** Todo = muted, In Progress = sky blue, In Review = amber, Done = teal

---

## 📊 Performance

The app is built to target a Lighthouse desktop score of 85+:

- Virtual scrolling ensures the DOM never holds more than ~15 rows at once, regardless of dataset size.
- Zustand selector subscriptions prevent unnecessary re-renders.
- `useMemo` on filtered/sorted task arrays prevents recomputation on unrelated state changes.
- Presence interval runs only every 3.5 seconds — minimal timer pressure.
- No heavy third-party UI libraries shipped to the client.
- Google Fonts loaded with `display=swap` to avoid layout shift.

---

## 🗃 Seed Data

`src/data/generator.ts` generates 500 tasks with:

- Random titles from verb + noun pools
- All 6 assignees (randomly distributed)
- All 4 priorities (randomly distributed)
- All 4 statuses (randomly distributed)
- Due dates spread from −14 days (overdue) to +60 days future
- 85% of tasks have a start date; 15% have `startDate: null`
- Guaranteed edge cases: 5 tasks due today, 5 tasks overdue >7 days, 5 tasks with no start date
