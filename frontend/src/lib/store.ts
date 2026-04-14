// Zustand store for app state

import { create } from 'zustand';
import type { Person } from './types';

interface AppStore {
  // Focal person
  focalPersonId: string | null;
  setFocalPerson: (id: string) => void;

  // Selected person (for inspector)
  selectedPersonId: string | null;
  setSelectedPerson: (id: string | null) => void;

  // Recent people
  recentPeople: Person[];
  addToRecent: (person: Person) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Dialogs
  isAddPersonDialogOpen: boolean;
  setAddPersonDialogOpen: (open: boolean) => void;

  isEditPersonDialogOpen: boolean;
  setEditPersonDialogOpen: (open: boolean) => void;

  isAddRelationshipDialogOpen: boolean;
  setAddRelationshipDialogOpen: (open: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  focalPersonId: 'p3', // Default to James Smith
  setFocalPerson: (id) =>
    set({
      focalPersonId: id,
      selectedPersonId: id,
    }),

  selectedPersonId: 'p3',
  setSelectedPerson: (id) => set({ selectedPersonId: id }),

  recentPeople: [],
  addToRecent: (person) =>
    set((state) => {
      const filtered = state.recentPeople.filter((p) => p.id !== person.id);
      return {
        recentPeople: [person, ...filtered].slice(0, 10),
      };
    }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  isAddPersonDialogOpen: false,
  setAddPersonDialogOpen: (open) => set({ isAddPersonDialogOpen: open }),

  isEditPersonDialogOpen: false,
  setEditPersonDialogOpen: (open) => set({ isEditPersonDialogOpen: open }),

  isAddRelationshipDialogOpen: false,
  setAddRelationshipDialogOpen: (open) => set({ isAddRelationshipDialogOpen: open }),
}));
