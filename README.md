# EventHub

A React + TypeScript event management dashboard focused on reusable components, accessibility, and client-side performance.

Built as part of a frontend technical assessment.

## Overview

EventHub is a small event management application that allows users to browse, organize, create, and edit events.

The project focuses on building reusable UI components and handling large datasets while keeping the interface accessible and responsive.

## Features

- **DataGrid**
  - Client-side pagination, sorting, and column filtering.
  - Configurable columns.
  - Loading, empty, and error states.
  - Column visibility controls.

- **Timeline**
  - Events grouped by day.
  - Keyboard navigation.
  - Accessible focus management and screen-reader announcements.

- **Event Form**
  - Create and edit events.
  - Controlled inputs and validation.
  - Automatic focus on the first invalid field.
  - Accessible success feedback.

- **Application**
  - Shared event state.
  - Table and Timeline views.
  - Mock dataset with 100,000+ records.
  - Client-side updates.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Table
- Vitest
- React Testing Library

## Getting Started

### Requirements

- Node.js
- npm

### Installation

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Project Structure

```text
src/
├── components/
│   ├── DataGrid/
│   ├── Timeline/
│   └── EventForm/
├── hooks/
├── pages/
├── services/
├── types/
├── App.tsx
└── main.tsx

public/
└── data/

scripts/
```

## Technical Decisions

- **Mock data:** A deterministic script generates the dataset so development and demonstrations use consistent data.
- **Data loading:** Events are loaded asynchronously through a service layer, simulating an external data source without requiring a backend.
- **Shared state:** The main application owns the event collection and passes the necessary data and callbacks to its components.
- **Performance:** The DataGrid renders only the current page. Additional optimizations will be evaluated for large Timeline datasets.
- **Accessibility:** Keyboard navigation, semantic HTML, visible focus indicators, and screen-reader announcements are considered part of the component design.

## Development

Run the linter:

```bash
npm run lint
```

Run the production build:

```bash
npm run build
```

## License

This project was created for educational and technical assessment purposes.

## License

Eduardo Juárez
