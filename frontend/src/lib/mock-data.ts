// Mock family data with complex scenarios

import type { Person, Relationship } from './types';

export const mockPersons: Person[] = [
  // Generation 1: Grandparents
  {
    id: 'p1',
    givenName: 'Robert',
    familyName: 'Smith',
    birthYear: 1930,
    deathYear: 2010,
    isLiving: false,
    isDeceased: true,
    isUncertain: false,
    isDuplicateSuspected: false,
    gender: 'male',
    bio: 'WWII veteran, carpenter',
  },
  {
    id: 'p2',
    givenName: 'Mary',
    familyName: 'Smith',
    middleName: 'Elizabeth',
    birthYear: 1932,
    deathYear: 2015,
    isLiving: false,
    isDeceased: true,
    isUncertain: false,
    isDuplicateSuspected: false,
    gender: 'female',
    bio: 'Teacher for 40 years',
  },

  // Generation 2: Parents (with remarriage scenario)
  {
    id: 'p3',
    givenName: 'James',
    familyName: 'Smith',
    birthYear: 1955,
    isLiving: true,
    isDeceased: false,
    isUncertain: false,
    isDuplicateSuspected: false,
    gender: 'male',
    bio: 'Engineer, remarried after divorce',
  },
  {
    id: 'p4',
    givenName: 'Linda',
    familyName: 'Johnson',
    birthYear: 1957,
    isLiving: true,
    isDeceased: false,
    isUncertain: false,
    isDuplicateSuspected: false,
    gender: 'female',
    bio: 'First wife of James, divorced 1985',
  },
  {
    id: 'p5',
    givenName: 'Sarah',
    familyName: 'Smith',
    birthYear: 1960,
    isLiving: true,
    isDeceased: false,
    isUncertain: false,
    isDuplicateSuspected: false,
    gender: 'female',
    bio: 'Second wife of James, married 1987',
  },

  // Generation 3: Children (blended family)
  {
    id: 'p6',
    givenName: 'Michael',
    familyName: 'Smith',
    birthYear: 1980,
    isLiving: true,
    isDeceased: false,
    isUncertain: false,
    isDuplicateSuspected: false,
    gender: 'male',
    bio: 'From first marriage, software engineer',
  },
  {
    id: 'p7',
    givenName: 'Emily',
    familyName: 'Smith',
    birthYear: 1982,
    isLiving: true,
    isDeceased: false,
    isUncertain: false,
    isDuplicateSuspected: false,
    gender: 'female',
    bio: 'From first marriage, doctor',
  },
  {
    id: 'p8',
    givenName: 'David',
    familyName: 'Smith',
    birthYear: 1990,
    isLiving: true,
    isDeceased: false,
    isUncertain: false,
    isDuplicateSuspected: false,
    gender: 'male',
    bio: 'From second marriage, teacher',
  },
  {
    id: 'p9',
    givenName: 'Sophie',
    familyName: 'Smith',
    birthYear: 1993,
    isLiving: true,
    isDeceased: false,
    isUncertain: false,
    isDuplicateSuspected: false,
    gender: 'female',
    bio: 'Adopted daughter from second marriage',
  },

  // Duplicate name scenario
  {
    id: 'p10',
    givenName: 'Robert',
    familyName: 'Smith',
    birthYear: 1930,
    isLiving: false,
    isDeceased: true,
    isUncertain: true,
    isDuplicateSuspected: true,
    gender: 'male',
    bio: 'Possible duplicate - uncertain if same as p1',
  },

  // Additional family member
  {
    id: 'p11',
    givenName: 'Jennifer',
    familyName: 'Davis',
    birthYear: 1985,
    isLiving: true,
    isDeceased: false,
    isUncertain: false,
    isDuplicateSuspected: false,
    gender: 'female',
    bio: "Michael's wife",
  },
];

export const mockRelationships: Relationship[] = [
  // Grandparents
  { id: 'r1', fromPersonId: 'p1', toPersonId: 'p2', type: 'spouse', startYear: 1952 },

  // Parents from grandparents
  { id: 'r2', fromPersonId: 'p1', toPersonId: 'p3', type: 'biological-parent' },
  { id: 'r3', fromPersonId: 'p2', toPersonId: 'p3', type: 'biological-parent' },

  // First marriage
  {
    id: 'r4',
    fromPersonId: 'p3',
    toPersonId: 'p4',
    type: 'ex-spouse',
    startYear: 1978,
    endYear: 1985,
    notes: 'Divorced',
  },

  // Second marriage
  { id: 'r5', fromPersonId: 'p3', toPersonId: 'p5', type: 'spouse', startYear: 1987 },

  // Children from first marriage
  { id: 'r6', fromPersonId: 'p3', toPersonId: 'p6', type: 'biological-parent' },
  { id: 'r7', fromPersonId: 'p4', toPersonId: 'p6', type: 'biological-parent' },
  { id: 'r8', fromPersonId: 'p3', toPersonId: 'p7', type: 'biological-parent' },
  { id: 'r9', fromPersonId: 'p4', toPersonId: 'p7', type: 'biological-parent' },

  // Children from second marriage
  { id: 'r10', fromPersonId: 'p3', toPersonId: 'p8', type: 'biological-parent' },
  { id: 'r11', fromPersonId: 'p5', toPersonId: 'p8', type: 'biological-parent' },

  // Adopted child
  { id: 'r12', fromPersonId: 'p3', toPersonId: 'p9', type: 'adopted-parent' },
  { id: 'r13', fromPersonId: 'p5', toPersonId: 'p9', type: 'adopted-parent' },

  // Siblings
  { id: 'r14', fromPersonId: 'p6', toPersonId: 'p7', type: 'sibling' },
  { id: 'r15', fromPersonId: 'p6', toPersonId: 'p8', type: 'half-sibling' },
  { id: 'r16', fromPersonId: 'p6', toPersonId: 'p9', type: 'step-sibling' },
  { id: 'r17', fromPersonId: 'p7', toPersonId: 'p8', type: 'half-sibling' },
  { id: 'r18', fromPersonId: 'p7', toPersonId: 'p9', type: 'step-sibling' },
  { id: 'r19', fromPersonId: 'p8', toPersonId: 'p9', type: 'sibling' },

  // Michael's marriage
  { id: 'r20', fromPersonId: 'p6', toPersonId: 'p11', type: 'spouse', startYear: 2005 },
];

// Helper to get person by ID
export function getPersonById(id: string): Person | undefined {
  return mockPersons.find((p) => p.id === id);
}

// Helper to get relationships for a person
export function getRelationshipsForPerson(personId: string): Relationship[] {
  return mockRelationships.filter(
    (r) => r.fromPersonId === personId || r.toPersonId === personId
  );
}

// Helper to build family cluster
export function getFamilyCluster(focalPersonId: string) {
  const focal = getPersonById(focalPersonId);
  if (!focal) return null;

  const rels = getRelationshipsForPerson(focalPersonId);

  const parents: Person[] = [];
  const siblings: Person[] = [];
  const partners: Person[] = [];
  const children: Person[] = [];

  rels.forEach((rel) => {
    const otherId = rel.fromPersonId === focalPersonId ? rel.toPersonId : rel.fromPersonId;
    const other = getPersonById(otherId);
    if (!other) return;

    if (
      rel.type === 'biological-parent' ||
      rel.type === 'adopted-parent' ||
      rel.type === 'foster-parent' ||
      rel.type === 'step-parent'
    ) {
      if (rel.toPersonId === focalPersonId) {
        parents.push(other);
      } else {
        children.push(other);
      }
    } else if (
      rel.type === 'biological-child' ||
      rel.type === 'adopted-child' ||
      rel.type === 'foster-child' ||
      rel.type === 'step-child'
    ) {
      if (rel.fromPersonId === focalPersonId) {
        children.push(other);
      } else {
        parents.push(other);
      }
    } else if (rel.type === 'spouse' || rel.type === 'partner' || rel.type === 'ex-spouse' || rel.type === 'ex-partner') {
      partners.push(other);
    } else if (rel.type === 'sibling' || rel.type === 'half-sibling' || rel.type === 'step-sibling') {
      siblings.push(other);
    }
  });

  // Remove duplicates
  const uniqueParents = Array.from(new Set(parents.map((p) => p.id))).map((id) => parents.find((p) => p.id === id)!);
  const uniqueSiblings = Array.from(new Set(siblings.map((p) => p.id))).map((id) => siblings.find((p) => p.id === id)!);
  const uniquePartners = Array.from(new Set(partners.map((p) => p.id))).map((id) => partners.find((p) => p.id === id)!);
  const uniqueChildren = Array.from(new Set(children.map((p) => p.id))).map((id) => children.find((p) => p.id === id)!);

  return {
    focalPersonId,
    parents: uniqueParents,
    siblings: uniqueSiblings,
    partners: uniquePartners,
    children: uniqueChildren,
    relationships: rels,
  };
}
