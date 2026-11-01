# EventHub

A React + TypeScript event management dashboard built as part of a frontend technical assessment.

**[Live Demo – View EventHub](https://event-hub-ruby.vercel.app/)**

The application provides two ways to manage events: a feature-rich data grid and a keyboard-accessible timeline. It focuses on reusable components, accessibility, and client-side performance when handling large datasets.

## Features

- **DataGrid:** Client-side sorting, filtering, pagination, and configurable column visibility.
- **Timeline:** Events grouped by day, keyboard navigation, accessibility support, and progressive data loading.
- **Event Form:** Create and edit events with controlled inputs and validation.
- **Multiple Views:** Switch between Table View and Timeline View while sharing the same event data.
- **Large Dataset:** Generates 100,000 deterministic mock events.
- **Performance:** Uses a Web Worker to generate mock data outside the main browser thread.
- **Responsive UI:** Adapts the dashboard layout to different screen sizes.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Table
- TanStack Virtual
- React Hook Form
- Web Workers

## Getting Started

```bash
git clone https://github.com/edjuarez/event-hub.git
cd event-hub
npm install
npm run dev
```

To create and preview a production build:

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
├── components/
│   ├── DataGrid/
│   │   ├── DataGrid.tsx
│   │   ├── GridToolbar.tsx
│   │   └── Pagination.tsx
│   ├── Timeline/
│   │   ├── Timeline.tsx
│   │   └── ...
│   ├── EventForm/
│   │   └── ...
│   └── ui/
│       ├── Button.tsx
│       └── ViewSelector.tsx
├── config/
│   └── gridColumns.tsx
├── data/
│   └── generateEvents.ts
├── hooks/
│   └── useEvents.ts
├── pages/
│   └── EventsPage.tsx
├── services/
│   └── eventService.ts
├── types/
│   └── event.ts
├── workers/
│   └── events.worker.ts
├── utils/
├── App.tsx
└── main.tsx
```

## Architecture & Technical Decisions

### Web Worker for Data Generation

The application generates 100,000 mock events using a Web Worker.

Generating a large dataset on the main browser thread can block JavaScript execution and affect interface responsiveness. Moving this operation to a separate worker thread allows the browser to keep the UI responsive while the data is being generated.

The implementation uses the following flow:

1. `useEvents` requests the initial dataset through `eventService`.
2. `eventService` creates a Web Worker and sends the requested event count and random seed.
3. `events.worker.ts` generates the dataset using `generateEvents.ts`.
4. The worker sends the generated events back to the main thread.
5. The service resolves its cached promise with the generated data.
6. `useEvents` stores the result in React state.

The service reuses the same promise to avoid starting multiple generation processes for repeated requests.

### Deterministic Mock Data

Mock events are generated with a seeded pseudo-random number generator.

This ensures that the application receives consistent data across runs, making development, testing, and performance comparisons more predictable.

### DataGrid

TanStack Table provides the table's data-processing logic while keeping the UI implementation independent of the library.

The grid supports:

- Sorting by column.
- Filtering by event title, category, and status.
- Client-side pagination.
- Configurable column visibility.
- A configurable page size.

Pagination limits the number of rows rendered in the DOM, while filtering and sorting are performed client-side.

### Timeline

TanStack Virtual is used to virtualize the timeline, rendering only the elements needed for the visible viewport instead of mounting every event at once.

Events are grouped by day, with keyboard navigation and accessibility support.

The timeline also loads events progressively in batches of 10,000 to avoid displaying the entire dataset at once.

### Shared Event State

The `useEvents` custom hook centralizes event loading and state management.

It exposes the event collection, loading and error states, and operations to create and update events.

React state is sufficient for this application, so no additional global state management library is required.

### Form Management

React Hook Form handles form state, validation, and submission for creating and editing events.

This keeps form logic separate from the dashboard and helps manage validation errors and focus behavior.

### Service Layer

The service layer separates data generation and loading from React components.

This keeps the UI independent of the current mock data implementation and provides a clear integration point for a future API.

## Performance Considerations

The application uses several techniques to handle a large client-side dataset:

- Web Worker for background data generation.
- Promise caching to avoid duplicate generation requests.
- Timeline virtualization to reduce DOM elements.
- Progressive timeline loading.
- Pagination to limit rendered table rows.
- Memoization for derived data and event columns.
- Debounced title filtering to reduce repeated filtering while typing.

## Accessibility

Accessibility is considered throughout the interface:

- Semantic HTML elements and form labels.
- Keyboard navigation in the timeline.
- Visible focus states for interactive controls.
- Accessible validation feedback.
- Screen-reader announcements for relevant interface updates.
- Accessible table headers and controls.

## Author

Eduardo Juárez
