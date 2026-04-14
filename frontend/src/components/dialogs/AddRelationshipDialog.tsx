'use client';

import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';
import { mockPersons, getPersonById } from '@/lib/mock-data';
import type { RelationshipType } from '@/lib/types';

export function AddRelationshipDialog() {
  const { isAddRelationshipDialogOpen, setAddRelationshipDialogOpen, selectedPersonId } =
    useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [relationshipType, setRelationshipType] = useState<RelationshipType>('biological-parent');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lowerQuery = searchQuery.toLowerCase();
    return mockPersons
      .filter(
        (p) =>
          p.id !== selectedPersonId &&
          (p.givenName.toLowerCase().includes(lowerQuery) ||
            p.familyName.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 8);
  }, [searchQuery, selectedPersonId]);

  if (!isAddRelationshipDialogOpen || !selectedPersonId) return null;

  const sourcePerson = getPersonById(selectedPersonId);
  const targetPerson = selectedTargetId ? getPersonById(selectedTargetId) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetId) {
      alert('Please select a person');
      return;
    }
    // Mock submission - in real app would call API
    console.log('Add relationship:', {
      from: selectedPersonId,
      to: selectedTargetId,
      type: relationshipType,
      startYear,
      endYear,
    });
    alert('Relationship added (mock)');
    setAddRelationshipDialogOpen(false);
    setSearchQuery('');
    setSelectedTargetId(null);
    setRelationshipType('biological-parent');
    setStartYear('');
    setEndYear('');
  };

  const handleClose = () => {
    setAddRelationshipDialogOpen(false);
    setSearchQuery('');
    setSelectedTargetId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg border bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold">Add Relationship</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Source Person */}
          <div>
            <Label>From</Label>
            <div className="mt-1 rounded-md border bg-muted/30 p-3">
              <div className="font-medium">
                {sourcePerson?.givenName} {sourcePerson?.familyName}
              </div>
              <div className="text-xs text-muted-foreground">ID: {selectedPersonId}</div>
            </div>
          </div>

          {/* Target Person Search */}
          <div>
            <Label>To</Label>
            {!selectedTargetId ? (
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for a person..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mt-1"
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
                    {searchResults.map((person) => (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => {
                          setSelectedTargetId(person.id);
                          setSearchQuery('');
                        }}
                        className="flex w-full items-start gap-2 border-b p-3 text-left hover:bg-muted/50 last:border-b-0"
                      >
                        <div className="flex-1">
                          <div className="font-medium">
                            {person.givenName} {person.familyName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {person.birthYear && `b. ${person.birthYear}`}
                          </div>
                        </div>
                        <div className="text-[10px] text-muted-foreground/50">#{person.id}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-1 flex items-center justify-between rounded-md border bg-muted/30 p-3">
                <div>
                  <div className="font-medium">
                    {targetPerson?.givenName} {targetPerson?.familyName}
                  </div>
                  <div className="text-xs text-muted-foreground">ID: {selectedTargetId}</div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTargetId(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Relationship Type */}
          <div>
            <Label htmlFor="relationshipType">Relationship Type *</Label>
            <select
              id="relationshipType"
              value={relationshipType}
              onChange={(e) => setRelationshipType(e.target.value as RelationshipType)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <optgroup label="Parent/Child">
                <option value="biological-parent">Biological Parent</option>
                <option value="biological-child">Biological Child</option>
                <option value="adopted-parent">Adopted Parent</option>
                <option value="adopted-child">Adopted Child</option>
                <option value="foster-parent">Foster Parent</option>
                <option value="foster-child">Foster Child</option>
                <option value="step-parent">Step Parent</option>
                <option value="step-child">Step Child</option>
              </optgroup>
              <optgroup label="Partners">
                <option value="spouse">Spouse</option>
                <option value="partner">Partner</option>
                <option value="ex-spouse">Ex-Spouse</option>
                <option value="ex-partner">Ex-Partner</option>
              </optgroup>
              <optgroup label="Siblings">
                <option value="sibling">Sibling</option>
                <option value="half-sibling">Half-Sibling</option>
                <option value="step-sibling">Step-Sibling</option>
              </optgroup>
              <optgroup label="Other">
                <option value="uncertain">Uncertain Relationship</option>
              </optgroup>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startYear">Start Year</Label>
              <Input
                id="startYear"
                type="number"
                placeholder="YYYY"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endYear">End Year</Label>
              <Input
                id="endYear"
                type="number"
                placeholder="YYYY"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedTargetId}>
              Add Relationship
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
