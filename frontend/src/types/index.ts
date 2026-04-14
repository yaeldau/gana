export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Person {
  id: string;
  givenName: string;
  familyName: string;
  middleName?: string | null;
  birthDate?: string | null;
  deathDate?: string | null;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN' | null;
  bio?: string | null;
  isLiving: boolean;
  isMerged: boolean;
  mergedInto?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Relationship {
  id: string;
  personFromId: string;
  personToId: string;
  type: 'PARENT' | 'CHILD' | 'PARTNER' | 'SIBLING';
  startDate?: string | null;
  endDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonInput {
  givenName: string;
  familyName: string;
  middleName?: string;
  birthDate?: string;
  deathDate?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN';
  bio?: string;
  isLiving?: boolean;
}

export interface UpdatePersonInput {
  givenName?: string;
  familyName?: string;
  middleName?: string;
  birthDate?: string;
  deathDate?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN';
  bio?: string;
  isLiving?: boolean;
}
