'use client';

import { Sidebar } from '@/components/sidebar/Sidebar';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { InspectorDrawer } from '@/components/inspector/InspectorDrawer';

export function AppLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Center Canvas */}
      <div className="flex-1">
        <GraphCanvas />
      </div>

      {/* Right Inspector */}
      <InspectorDrawer />
    </div>
  );
}
