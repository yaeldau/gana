# Gana Family Tree - Frontend Prototype

A frontend-only prototype for a family tree application using a focal-point canvas UI model with React Flow graph visualization.

## Features

- **Focal-Point Canvas**: Click to select a person, double-click to refocus the graph on them
- **Three-Column Layout**: Search sidebar | Interactive graph canvas | Inspector drawer
- **Complex Family Support**: Handles divorces, remarriages, blended families, adoptions, foster relationships, step-siblings
- **Duplicate Detection**: Visual indicators for suspected duplicate entries
- **Smart Search**: Name-based search with disambiguation hints
- **Recent People**: Quick access to recently viewed family members
- **Interactive Graph**: Zoom, pan, minimap with color-coded relationship roles

## Mock Data

The prototype includes a rich mock dataset with:
- 11 people across 3 generations
- Divorced and remarried relationships (James & Linda divorced 1985, James & Sarah married 1987)
- Blended family with biological, adopted, and step-children
- Duplicate person scenario (two Robert Smith entries)
- 20 relationships covering all relationship types

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **React Flow** (@xyflow/react) for graph visualization
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Radix UI** for accessible components

## Getting Started

### Prerequisites

- Node.js 18+ (currently running on v23.9.0)
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000/tree](http://localhost:3000/tree) in your browser.

## Usage

### Navigation

1. **Search**: Use the search box in the left sidebar to find people by name
2. **Click**: Click on a node to view details in the right inspector drawer
3. **Double-click**: Double-click on a node to refocus the graph on that person
4. **Recent**: Access recently viewed people from the sidebar

### Graph Interactions

- **Pan**: Click and drag on the canvas background
- **Zoom**: Use mouse wheel or the controls in the bottom-left
- **Minimap**: Use the minimap in the bottom-right for quick navigation

### Relationship Colors

- **Purple**: Parents
- **Blue**: Siblings
- **Pink**: Partners/Spouses
- **Green**: Children

### Edge Styles

- **Solid gray**: Biological relationships
- **Purple dashed**: Adopted relationships
- **Green dashed**: Foster relationships
- **Blue dashed**: Step relationships
- **Solid pink**: Current spouse/partner
- **Red dashed**: Ex-spouse/ex-partner
- **Animated orange**: Uncertain relationships

### Forms (Mock)

The prototype includes UI for:
- **Add Person**: Create new family members
- **Edit Person**: Update person details
- **Add Relationship**: Connect people with typed relationships

These forms are frontend-only and use mock persistence (console logging). They demonstrate the UX but don't modify the actual mock data.

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   └── tree/
│   │       └── page.tsx          # Main tree page
│   ├── components/
│   │   ├── dialogs/
│   │   │   ├── AddPersonDialog.tsx
│   │   │   ├── EditPersonDialog.tsx
│   │   │   └── AddRelationshipDialog.tsx
│   │   ├── graph/
│   │   │   ├── GraphCanvas.tsx   # React Flow wrapper
│   │   │   └── PersonNode.tsx    # Custom node component
│   │   ├── inspector/
│   │   │   └── InspectorDrawer.tsx
│   │   ├── layout/
│   │   │   └── AppLayout.tsx     # Main 3-column layout
│   │   ├── sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SearchBox.tsx
│   │   │   └── RecentPeople.tsx
│   │   └── ui/                   # Shared UI components
│   └── lib/
│       ├── types.ts              # TypeScript types
│       ├── mock-data.ts          # Mock family dataset
│       ├── store.ts              # Zustand state management
│       └── graph-utils.ts        # Graph layout engine
```

## Key Components

### Person Node

Each person is rendered as a custom React Flow node with:
- Avatar with initials
- Full name
- Birth/death years
- Status badges (deceased, uncertain, duplicate)
- Role-based border colors
- Four handles for different relationship types

### Layout Engine

The `graph-utils.ts` file contains the layout algorithm that positions nodes:
- Focal person in center
- Parents above (Y - 270px)
- Children below (Y + 270px)
- Partners to the right
- Siblings to the left

### State Management

Zustand store tracks:
- `focalPersonId`: Current person at center of graph
- `selectedPersonId`: Person shown in inspector drawer
- `recentPeople`: Up to 10 recently viewed people
- Dialog state for add/edit operations

## Future Backend Integration

This prototype is designed for easy backend integration:

1. Replace `mock-data.ts` with API calls
2. Update dialog submit handlers to POST/PUT to API
3. Add optimistic updates to Zustand store
4. Implement real-time updates via WebSocket
5. Add data persistence layer

## Known Limitations

- Mock data only (no persistence)
- Forms are UI-only (console logging)
- No authentication
- No multi-user support
- No undo/redo
- No merge functionality (UI placeholder exists)
- No sources/timeline (UI placeholders exist)

## Development Notes

- Built with Next.js App Router (server components where possible)
- Uses `'use client'` for interactive components
- Tailwind configured with custom colors for family roles
- React Flow configured with custom node types
- All IDs are stable UUIDs (prepared for database integration)

## License

Private project - All rights reserved
