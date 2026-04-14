'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import { mockPersons, getRelationshipsForPerson, getPersonById } from '@/lib/mock-data';

export function SearchBox() {
  const [query, setQuery] = useState('');
  const { setFocalPerson, setSelectedPerson, addToRecent } = useAppStore();

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return mockPersons
      .filter(
        (p) =>
          p.givenName.toLowerCase().includes(lowerQuery) ||
          p.familyName.toLowerCase().includes(lowerQuery) ||
          (p.middleName && p.middleName.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 10)
      .map((person) => {
        // Generate disambiguation hint
        const rels = getRelationshipsForPerson(person.id);
        const child = rels
          .filter((r) => r.type === 'biological-child' || r.type === 'adopted-child')
          .map((r) => getPersonById(r.toPersonId))
          .find((p) => p);

        const hint = child
          ? `parent of ${child.givenName}`
          : person.birthYear
            ? `b. ${person.birthYear}`
            : person.id;

        return {
          person,
          hint,
        };
      });
  }, [query]);

  const handleSelect = (personId: string) => {
    const person = getPersonById(personId);
    if (person) {
      setFocalPerson(personId);
      setSelectedPerson(personId);
      addToRecent(person);
      setQuery('');
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search people..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="absolute top-full z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
          {searchResults.map(({ person, hint }) => (
            <button
              key={person.id}
              onClick={() => handleSelect(person.id)}
              className="flex w-full items-start gap-2 border-b p-3 text-left hover:bg-muted/50 last:border-b-0"
            >
              <div className="flex-1">
                <div className="font-medium">
                  {person.givenName} {person.familyName}
                </div>
                <div className="text-xs text-muted-foreground">{hint}</div>
                {person.isDuplicateSuspected && (
                  <div className="mt-1 text-xs text-orange-600">⚠ Possible duplicate</div>
                )}
              </div>
              <div className="text-[10px] text-muted-foreground/50">#{person.id}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
