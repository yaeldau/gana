// Core type definitions for family tree frontend

export interface Person {
  id: string; // Stable UUID
  givenName: string;
  familyName: string;
  middleName?: string;
  birthYear?: number;
  deathYear?: number;
  isLiving: boolean;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  bio?: string;

  // Status flags
  isDeceased: boolean;
  isUncertain: boolean; // Uncertain identity
  isDuplicateSuspected: boolean;

  // Display
  avatarUrl?: string;
}

export type RelationshipType =
  | 'biological-parent'
  | 'biological-child'
  | 'adopted-parent'
  | 'adopted-child'
  | 'foster-parent'
  | 'foster-child'
  | 'step-parent'
  | 'step-child'
  | 'spouse'
  | 'partner'
  | 'ex-spouse'
  | 'ex-partner'
  | 'sibling'
  | 'half-sibling'
  | 'step-sibling'
  | 'uncertain';

export interface Relationship {
  id: string;
  fromPersonId: string;
  toPersonId: string;
  type: RelationshipType;
  startYear?: number;
  endYear?: number;
  notes?: string;
}

export interface FamilyCluster {
  focalPersonId: string;
  parents: Person[];
  siblings: Person[];
  partners: Person[];
  children: Person[];
  relationships: Relationship[];
}

export interface SearchResult {
  person: Person;
  matchScore: number;
  disambiguationHint: string; // e.g., "father of Jane (b. 1980)"
}

// Graph layout types
export interface PersonNodeData {
  person: Person;
  role: 'focal' | 'parent' | 'sibling' | 'partner' | 'child';
  isSelected: boolean;
}

export interface RelationshipEdgeData {
  relationship: Relationship;
  label?: string;
}
