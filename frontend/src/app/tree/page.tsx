'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { AddPersonDialog } from '@/components/dialogs/AddPersonDialog';
import { EditPersonDialog } from '@/components/dialogs/EditPersonDialog';
import { AddRelationshipDialog } from '@/components/dialogs/AddRelationshipDialog';

export default function TreePage() {
  return (
    <>
      <AppLayout />
      <AddPersonDialog />
      <EditPersonDialog />
      <AddRelationshipDialog />
    </>
  );
}
