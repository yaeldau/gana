'use client';

import { X, Edit, Link as LinkIcon, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { getPersonById, getRelationshipsForPerson, mockPersons } from '@/lib/mock-data';
import type { Relationship } from '@/lib/types';

export function InspectorDrawer() {
  const {
    selectedPersonId,
    setSelectedPerson,
    setEditPersonDialogOpen,
    setAddRelationshipDialogOpen,
  } = useAppStore();

  if (!selectedPersonId) {
    return (
      <div className="flex h-full w-96 items-center justify-center border-l bg-muted/20 p-8 text-center">
        <div>
          <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            Select a person to view details
          </p>
        </div>
      </div>
    );
  }

  const person = getPersonById(selectedPersonId);
  if (!person) return null;

  const relationships = getRelationshipsForPerson(selectedPersonId);

  const getRelationshipLabel = (rel: Relationship): string => {
    const labels: Record<Relationship['type'], string> = {
      'biological-parent': 'Biological Parent',
      'biological-child': 'Biological Child',
      'adopted-parent': 'Adopted Parent',
      'adopted-child': 'Adopted Child',
      'foster-parent': 'Foster Parent',
      'foster-child': 'Foster Child',
      'step-parent': 'Step Parent',
      'step-child': 'Step Child',
      spouse: 'Spouse',
      partner: 'Partner',
      'ex-spouse': 'Ex-Spouse',
      'ex-partner': 'Ex-Partner',
      sibling: 'Sibling',
      'half-sibling': 'Half-Sibling',
      'step-sibling': 'Step-Sibling',
      uncertain: 'Uncertain Relationship',
    };
    return labels[rel.type] || rel.type;
  };

  return (
    <div className="flex h-full w-96 flex-col border-l bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="font-semibold">Person Details</h2>
        <Button variant="ghost" size="sm" onClick={() => setSelectedPerson(null)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="border-b p-6">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
            {person.givenName[0]}
            {person.familyName[0]}
          </div>
          <h3 className="font-serif text-2xl font-semibold">
            {person.givenName} {person.middleName} {person.familyName}
          </h3>
          {person.birthYear && (
            <p className="mt-1 text-sm text-muted-foreground">
              {person.birthYear}
              {person.deathYear && ` – ${person.deathYear}`}
              {!person.deathYear && person.isLiving && ' – present'}
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">ID: {person.id}</p>

          {/* Status Badges */}
          <div className="mt-3 flex flex-wrap gap-2">
            {person.isDeceased && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                Deceased
              </span>
            )}
            {person.isUncertain && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">
                Uncertain Identity
              </span>
            )}
            {person.isDuplicateSuspected && (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-700">
                Duplicate Suspected
              </span>
            )}
          </div>
        </div>

        {/* Bio */}
        {person.bio && (
          <div className="border-b p-6">
            <h4 className="mb-2 text-sm font-medium">Biography</h4>
            <p className="text-sm text-muted-foreground">{person.bio}</p>
          </div>
        )}

        {/* Relationships */}
        <div className="border-b p-6">
          <h4 className="mb-3 text-sm font-medium">Relationships</h4>
          {relationships.length === 0 ? (
            <p className="text-sm text-muted-foreground">No relationships recorded</p>
          ) : (
            <div className="space-y-2">
              {relationships.map((rel) => {
                const otherId =
                  rel.fromPersonId === selectedPersonId ? rel.toPersonId : rel.fromPersonId;
                const other = mockPersons.find((p) => p.id === otherId);
                if (!other) return null;

                return (
                  <div
                    key={rel.id}
                    className="flex items-start gap-3 rounded-md border p-3"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {other.givenName} {other.familyName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getRelationshipLabel(rel)}
                      </div>
                      {rel.startYear && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {rel.startYear}
                          {rel.endYear && ` – ${rel.endYear}`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Timeline placeholder */}
        <div className="border-b p-6">
          <h4 className="mb-2 text-sm font-medium">Timeline</h4>
          <p className="text-sm text-muted-foreground">Timeline view coming soon</p>
        </div>

        {/* Sources placeholder */}
        <div className="p-6">
          <h4 className="mb-2 text-sm font-medium">Sources</h4>
          <p className="text-sm text-muted-foreground">No sources added yet</p>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t p-4">
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setEditPersonDialogOpen(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Person
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setAddRelationshipDialogOpen(true)}
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            Add Relationship
          </Button>
          {person.isDuplicateSuspected && (
            <Button variant="outline" className="w-full justify-start text-orange-600">
              <Users className="mr-2 h-4 w-4" />
              Review Merge
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
