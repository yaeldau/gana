import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { PersonNodeData } from '@/lib/types';
import { cn } from '@/lib/utils';

function PersonNodeComponent({ data, selected }: NodeProps<PersonNodeData>) {
  const { person, role } = data;

  const getYearDisplay = () => {
    if (person.birthYear && person.deathYear) {
      return `${person.birthYear}–${person.deathYear}`;
    }
    if (person.birthYear) {
      return `b. ${person.birthYear}`;
    }
    if (person.deathYear) {
      return `d. ${person.deathYear}`;
    }
    return null;
  };

  const roleStyles = {
    focal: 'border-primary border-2 bg-primary/5',
    parent: 'border-purple-300 bg-purple-50',
    sibling: 'border-blue-300 bg-blue-50',
    partner: 'border-pink-300 bg-pink-50',
    child: 'border-green-300 bg-green-50',
  };

  return (
    <div
      className={cn(
        'rounded-lg border-2 bg-white px-4 py-3 shadow-md transition-all hover:shadow-lg',
        'min-w-[200px] max-w-[250px]',
        roleStyles[role],
        selected && 'ring-2 ring-primary ring-offset-2',
        person.isDeceased && 'opacity-75',
        person.isUncertain && 'border-dashed',
        person.isDuplicateSuspected && 'border-amber-400'
      )}
    >
      {/* Top handle for parents */}
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />

      {/* Content */}
      <div className="space-y-1">
        {/* Name */}
        <div className="font-semibold">
          {person.givenName}{' '}
          {person.middleName && <span className="text-muted-foreground">{person.middleName[0]}.</span>}{' '}
          {person.familyName}
        </div>

        {/* Years */}
        {getYearDisplay() && (
          <div className="text-xs text-muted-foreground">{getYearDisplay()}</div>
        )}

        {/* ID (subtle) */}
        <div className="text-[10px] text-muted-foreground/50">#{person.id}</div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-1 pt-1">
          {person.isDeceased && (
            <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-700">
              Deceased
            </span>
          )}
          {person.isUncertain && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700">
              Uncertain
            </span>
          )}
          {person.isDuplicateSuspected && (
            <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] text-orange-700">
              Duplicate?
            </span>
          )}
        </div>
      </div>

      {/* Bottom handle for children */}
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />

      {/* Left handle for partners/siblings */}
      <Handle type="source" position={Position.Left} className="!bg-gray-400" id="left" />

      {/* Right handle for partners/siblings */}
      <Handle type="source" position={Position.Right} className="!bg-gray-400" id="right" />
    </div>
  );
}

export const PersonNode = memo(PersonNodeComponent);
