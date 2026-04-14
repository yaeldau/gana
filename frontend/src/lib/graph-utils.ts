// Graph layout utilities

import type { Node, Edge } from '@xyflow/react';
import type { Person, Relationship, FamilyCluster, PersonNodeData, RelationshipEdgeData } from './types';

const NODE_WIDTH = 250;
const NODE_HEIGHT = 120;
const HORIZONTAL_SPACING = 100;
const VERTICAL_SPACING = 150;

export function buildGraphFromCluster(cluster: FamilyCluster | null, selectedPersonId: string | null): {
  nodes: Node<PersonNodeData>[];
  edges: Edge<RelationshipEdgeData>[];
} {
  if (!cluster) {
    return { nodes: [], edges: [] };
  }

  const nodes: Node<PersonNodeData>[] = [];
  const edges: Edge<RelationshipEdgeData>[] = [];

  // Layout positions
  const focalX = 0;
  const focalY = 0;

  // 1. Focal person (center)
  const focalPerson = [cluster.parents, cluster.siblings, cluster.partners, cluster.children]
    .flat()
    .find((p) => p.id === cluster.focalPersonId);

  if (focalPerson) {
    nodes.push(createPersonNode(focalPerson, 'focal', focalX, focalY, selectedPersonId));
  }

  // 2. Parents (top)
  cluster.parents.forEach((parent, i) => {
    const x = focalX + (i - cluster.parents.length / 2 + 0.5) * (NODE_WIDTH + HORIZONTAL_SPACING);
    const y = focalY - VERTICAL_SPACING - NODE_HEIGHT;
    nodes.push(createPersonNode(parent, 'parent', x, y, selectedPersonId));
  });

  // 3. Partners (left/right of focal)
  cluster.partners.forEach((partner, i) => {
    const offset = i + 1;
    const x = focalX + offset * (NODE_WIDTH + HORIZONTAL_SPACING);
    const y = focalY;
    nodes.push(createPersonNode(partner, 'partner', x, y, selectedPersonId));
  });

  // 4. Siblings (left of focal, same level)
  cluster.siblings.forEach((sibling, i) => {
    const x = focalX - (i + 1) * (NODE_WIDTH + HORIZONTAL_SPACING);
    const y = focalY;
    nodes.push(createPersonNode(sibling, 'sibling', x, y, selectedPersonId));
  });

  // 5. Children (bottom)
  cluster.children.forEach((child, i) => {
    const x = focalX + (i - cluster.children.length / 2 + 0.5) * (NODE_WIDTH + HORIZONTAL_SPACING);
    const y = focalY + VERTICAL_SPACING + NODE_HEIGHT;
    nodes.push(createPersonNode(child, 'child', x, y, selectedPersonId));
  });

  // Create edges from relationships
  cluster.relationships.forEach((rel) => {
    edges.push(createRelationshipEdge(rel));
  });

  return { nodes, edges };
}

function createPersonNode(
  person: Person,
  role: PersonNodeData['role'],
  x: number,
  y: number,
  selectedPersonId: string | null
): Node<PersonNodeData> {
  return {
    id: person.id,
    type: 'personNode',
    position: { x, y },
    data: {
      person,
      role,
      isSelected: person.id === selectedPersonId,
    },
  };
}

function createRelationshipEdge(relationship: Relationship): Edge<RelationshipEdgeData> {
  const edgeStyles = getEdgeStyleForRelationship(relationship.type);

  return {
    id: relationship.id,
    source: relationship.fromPersonId,
    target: relationship.toPersonId,
    type: edgeStyles.type,
    animated: edgeStyles.animated,
    style: edgeStyles.style,
    label: edgeStyles.label,
    data: {
      relationship,
    },
  };
}

function getEdgeStyleForRelationship(type: Relationship['type']) {
  switch (type) {
    case 'biological-parent':
    case 'biological-child':
      return {
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#6b7280', strokeWidth: 2 },
        label: '',
      };
    case 'adopted-parent':
    case 'adopted-child':
      return {
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '5 5' },
        label: 'Adopted',
      };
    case 'foster-parent':
    case 'foster-child':
      return {
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' },
        label: 'Foster',
      };
    case 'step-parent':
    case 'step-child':
      return {
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '3 3' },
        label: 'Step',
      };
    case 'spouse':
    case 'partner':
      return {
        type: 'straight',
        animated: false,
        style: { stroke: '#ec4899', strokeWidth: 3 },
        label: '',
      };
    case 'ex-spouse':
    case 'ex-partner':
      return {
        type: 'straight',
        animated: false,
        style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '8 4' },
        label: 'Divorced',
      };
    case 'sibling':
      return {
        type: 'straight',
        animated: false,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        label: '',
      };
    case 'half-sibling':
      return {
        type: 'straight',
        animated: false,
        style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' },
        label: 'Half',
      };
    case 'step-sibling':
      return {
        type: 'straight',
        animated: false,
        style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '3 3' },
        label: 'Step',
      };
    case 'uncertain':
      return {
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5 5' },
        label: '?',
      };
    default:
      return {
        type: 'default',
        animated: false,
        style: { stroke: '#9ca3af', strokeWidth: 1 },
        label: '',
      };
  }
}
