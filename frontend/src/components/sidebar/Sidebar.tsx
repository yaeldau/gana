'use client';

import { SearchBox } from './SearchBox';
import { RecentPeople } from './RecentPeople';

export function Sidebar() {
  return (
    <div className="flex h-full w-80 flex-col border-r bg-muted/20">
      {/* Header */}
      <div className="border-b p-4">
        <h2 className="font-serif text-lg font-semibold">Family Tree</h2>
        <p className="text-xs text-muted-foreground">
          Search and navigate your family
        </p>
      </div>

      {/* Search */}
      <div className="border-b p-4">
        <SearchBox />
      </div>

      {/* Recent People */}
      <div className="flex-1 overflow-y-auto p-4">
        <RecentPeople />
      </div>

      {/* Future: Filters, Bookmarks */}
      <div className="border-t p-4">
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-300" />
            <span>Parents</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-300" />
            <span>Siblings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-pink-300" />
            <span>Partners</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-300" />
            <span>Children</span>
          </div>
        </div>
      </div>
    </div>
  );
}
