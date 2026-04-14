'use client';

import { Clock } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function RecentPeople() {
  const { recentPeople, setFocalPerson, setSelectedPerson } = useAppStore();

  if (recentPeople.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        <Clock className="mx-auto mb-2 h-8 w-8 opacity-30" />
        <p>No recent people</p>
        <p className="mt-1 text-xs">Click on people in the graph to see them here</p>
      </div>
    );
  }

  const handleClick = (personId: string) => {
    setFocalPerson(personId);
    setSelectedPerson(personId);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Recent</h3>
      <div className="space-y-1">
        {recentPeople.map((person) => (
          <button
            key={person.id}
            onClick={() => handleClick(person.id)}
            className="flex w-full items-start gap-2 rounded-md p-2 text-left hover:bg-muted/50"
          >
            <div className="flex-1">
              <div className="text-sm font-medium">
                {person.givenName} {person.familyName}
              </div>
              {person.birthYear && (
                <div className="text-xs text-muted-foreground">b. {person.birthYear}</div>
              )}
            </div>
            <div className="text-[10px] text-muted-foreground/50">#{person.id}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
