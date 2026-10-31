# EventHub

A React + TypeScript event management dashboard built as part of a frontend technical assessment.

The project focuses on reusable components, accessibility, and client-side performance when handling large datasets.

## Features

- **DataGrid:** Client-side pagination, sorting, filtering, configurable columns, and column visibility.
- **Timeline:** Events grouped by day with keyboard navigation and accessibility support.
- **Event Form:** Create and edit events with controlled inputs and validation.
- **Application:** Table and Timeline views with shared event state.
- **Mock Data:** Deterministic generation of 100,000+ events.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Table

## Getting Started

```bash
git clone https://github.com/edjuarez/event-hub.git
cd event-hub
npm install
npm run dev
```

## Project Structure

```text
src/
├── components/
│   ├── DataGrid/
│   ├── Timeline/
│   ├── EventForm/
│   └── ui/
├── config/
├── data/
├── hooks/
├── pages/
├── services/
├── types/
├── App.tsx
└── main.tsx

```

## Technical Decisions

- **TanStack Table:** Provides table functionality without imposing UI or styling, allowing a reusable and customizable DataGrid.
- **Deterministic mock data:** Generates consistent datasets for testing large volumes without requiring an API or database.
- **Service layer:** Separates data loading from UI components, making future integration with an API easier.
- **React state:** Keeps shared event data centralized without introducing unnecessary state management dependencies.
- **Client-side processing:** Uses pagination to limit rendered rows while keeping filtering and sorting on the client.

## Author

Eduardo Juárez.
