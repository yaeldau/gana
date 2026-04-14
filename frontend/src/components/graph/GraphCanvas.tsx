'use client';

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { PersonNode } from './PersonNode';
import { useAppStore } from '@/lib/store';
import { getFamilyCluster, getPersonById } from '@/lib/mock-data';
import { buildGraphFromCluster } from '@/lib/graph-utils';

const nodeTypes: NodeTypes = {
  personNode: PersonNode as any,
};

export function GraphCanvas() {
  const { focalPersonId, selectedPersonId, setFocalPerson, setSelectedPerson, addToRecent } =
    useAppStore();

  // Build graph from cluster
  const cluster = useMemo(() => {
    return focalPersonId ? getFamilyCluster(focalPersonId) : null;
  }, [focalPersonId]);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    return buildGraphFromCluster(cluster, selectedPersonId);
  }, [cluster, selectedPersonId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when selection changes
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Single click to select
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      setSelectedPerson(node.id);
      const person = getPersonById(node.id);
      if (person) {
        addToRecent(person);
      }
    },
    [setSelectedPerson, addToRecent]
  );

  // Double click to refocus
  const onNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      setFocalPerson(node.id);
      const person = getPersonById(node.id);
      if (person) {
        addToRecent(person);
      }
    },
    [setFocalPerson, addToRecent]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const role = node.data?.role;
            switch (role) {
              case 'focal':
                return '#3b82f6';
              case 'parent':
                return '#a855f7';
              case 'sibling':
                return '#60a5fa';
              case 'partner':
                return '#ec4899';
              case 'child':
                return '#10b981';
              default:
                return '#9ca3af';
            }
          }}
          maskColor="rgb(240, 240, 240, 0.6)"
        />
      </ReactFlow>
    </div>
  );
}
