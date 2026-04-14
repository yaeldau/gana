# Merge Strategy

## Overview

Profile merging is one of the most critical and complex features in Gana. When multiple users contribute to a family tree, the same real person often gets represented multiple times. A robust merge system is essential for data quality and user trust.

## Design Philosophy

1. **Safety First**: Merges must be atomic, reversible (or at minimum fully auditable)
2. **User Control**: No automatic merges without explicit user confirmation
3. **Transparency**: Users must understand exactly what will change
4. **Conflict Awareness**: Surface all conflicts, provide intelligent resolution UI
5. **Audit Trail**: Every merge fully logged for accountability

## Merge Workflow

### Phase 1: Duplicate Detection

**Automatic Detection (Background Job)**

Runs nightly (or on-demand) to find potential duplicates.

**Matching Algorithm**:

```typescript
function calculateDuplicateConfidence(
  personA: Person,
  personB: Person
): number {
  let score = 0;
  
  // Name similarity (0-0.4 points)
  const nameDistance = levenshtein(
    `${personA.givenName} ${personA.familyName}`,
    `${personB.givenName} ${personB.familyName}`
  );
  if (nameDistance === 0) score += 0.4;
  else if (nameDistance <= 2) score += 0.3;
  else if (nameDistance <= 4) score += 0.2;
  
  // Birth date proximity (0-0.3 points)
  if (personA.birthDate && personB.birthDate) {
    const daysDiff = Math.abs(
      daysBetween(personA.birthDate, personB.birthDate)
    );
    if (daysDiff === 0) score += 0.3;
    else if (daysDiff <= 365) score += 0.2;  // Within 1 year
    else if (daysDiff <= 730) score += 0.1;  // Within 2 years
  }
  
  // Shared parents (0-0.2 points)
  const sharedParents = getSharedParents(personA, personB);
  if (sharedParents.length >= 2) score += 0.2;
  else if (sharedParents.length === 1) score += 0.1;
  
  // Shared children (0-0.1 points)
  const sharedChildren = getSharedChildren(personA, personB);
  if (sharedChildren.length >= 2) score += 0.1;
  else if (sharedChildren.length === 1) score += 0.05;
  
  // Same gender (0-0.05 points)
  if (personA.gender && personB.gender && personA.gender === personB.gender) {
    score += 0.05;
  }
  
  return score;
}
```

**Thresholds**:
- **≥ 0.8**: High confidence - show prominently
- **0.6 - 0.79**: Medium confidence - show in list
- **< 0.6**: Low confidence - don't propose (or show in "possible" section)

**Example Scenarios**:

| Scenario | Name | Birth | Parents | Children | Gender | Score |
|----------|------|-------|---------|----------|--------|-------|
| Exact match | 0.4 | 0.3 | 0.2 | 0.1 | 0.05 | **1.05** |
| Very likely | 0.4 | 0.3 | 0.2 | 0 | 0.05 | **0.95** |
| Probable | 0.3 | 0.2 | 0.1 | 0 | 0.05 | **0.65** |
| Possible | 0.2 | 0.1 | 0 | 0 | 0.05 | **0.35** |

**Output**: Creates `MergeProposal` records for matches above threshold.

---

**Manual Flagging**

Users can manually flag two profiles as duplicates:

```typescript
// API endpoint
POST /api/merge/propose
{
  "personAId": "uuid-1",
  "personBId": "uuid-2",
  "reason": "User flagged as duplicate"
}
```

---

### Phase 2: Review & Conflict Detection

When user clicks "Review merge" on a proposal:

**Step 1: Fetch both profiles**

```typescript
const personA = await getPerson(proposalPersonAId);
const personB = await getPerson(proposalPersonBId);
```

**Step 2: Compare all fields**

```typescript
interface ConflictDetection {
  field: string;
  valueA: any;
  valueB: any;
  hasConflict: boolean;
  resolution?: 'A' | 'B' | 'MERGED' | 'MANUAL';
}

function detectConflicts(
  personA: Person,
  personB: Person
): ConflictDetection[] {
  const conflicts: ConflictDetection[] = [];
  
  // Given name
  conflicts.push({
    field: 'givenName',
    valueA: personA.givenName,
    valueB: personB.givenName,
    hasConflict: personA.givenName !== personB.givenName,
  });
  
  // Family name
  conflicts.push({
    field: 'familyName',
    valueA: personA.familyName,
    valueB: personB.familyName,
    hasConflict: personA.familyName !== personB.familyName,
  });
  
  // Birth date
  conflicts.push({
    field: 'birthDate',
    valueA: personA.birthDate,
    valueB: personB.birthDate,
    hasConflict: !datesEqual(personA.birthDate, personB.birthDate),
  });
  
  // Death date
  conflicts.push({
    field: 'deathDate',
    valueA: personA.deathDate,
    valueB: personB.deathDate,
    hasConflict: !datesEqual(personA.deathDate, personB.deathDate),
  });
  
  // Gender
  conflicts.push({
    field: 'gender',
    valueA: personA.gender,
    valueB: personB.gender,
    hasConflict: personA.gender !== personB.gender,
  });
  
  // Bio (text fields always considered conflicts if both exist)
  conflicts.push({
    field: 'bio',
    valueA: personA.bio,
    valueB: personB.bio,
    hasConflict: !!(personA.bio && personB.bio),
  });
  
  return conflicts;
}
```

**Step 3: Detect relationship conflicts**

```typescript
interface RelationshipConflict {
  type: 'DUPLICATE' | 'CONFLICTING';
  relationshipA?: Relationship;
  relationshipB?: Relationship;
  description: string;
}

function detectRelationshipConflicts(
  personA: Person,
  personB: Person
): RelationshipConflict[] {
  const conflicts: RelationshipConflict[] = [];
  
  // Get all relationships for both
  const relsA = await getRelationships(personA.id);
  const relsB = await getRelationships(personB.id);
  
  // Find duplicates (same person, same type)
  // Example: Both have "John Smith" as father
  const duplicates = findDuplicateRelationships(relsA, relsB);
  
  // Find conflicts (incompatible relationships)
  // Example: Person A has different father than Person B
  const incompatible = findConflictingRelationships(relsA, relsB);
  
  return [...duplicates, ...incompatible];
}
```

**Step 4: Return merge preview**

```typescript
{
  "personA": { /* full person A data */ },
  "personB": { /* full person B data */ },
  "conflicts": [
    {
      "field": "givenName",
      "valueA": "John",
      "valueB": "Jon",
      "hasConflict": true
    },
    {
      "field": "birthDate",
      "valueA": "1950-05-15",
      "valueB": "1950-05-16",
      "hasConflict": true
    }
  ],
  "relationshipConflicts": [
    {
      "type": "DUPLICATE",
      "description": "Both profiles list 'Mary Smith' as mother"
    }
  ],
  "stats": {
    "totalConflicts": 2,
    "relationshipsToMerge": 5
  }
}
```

---

### Phase 3: Conflict Resolution UI

**UI Design Principles**:
- Side-by-side comparison
- Clear highlighting of differences
- One-click resolution for simple cases
- Manual input option for complex cases

**Example UI (Text Description)**:

```
┌─────────────────────────────────────────────────────────────┐
│  Merge: John Smith (Profile A) + Jon Smith (Profile B)     │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────┬──────────────────┐
│ Field            │ Profile A        │ Profile B        │
├──────────────────┼──────────────────┼──────────────────┤
│ Given Name ⚠️    │ ○ John           │ ○ Jon            │
│                  │                  │ ○ Manual: [____] │
├──────────────────┼──────────────────┼──────────────────┤
│ Family Name ✓    │ Smith            │ Smith            │
│                  │ (No conflict)                       │
├──────────────────┼──────────────────┼──────────────────┤
│ Birth Date ⚠️    │ ○ May 15, 1950   │ ○ May 16, 1950   │
│                  │                  │ ○ Manual: [____] │
├──────────────────┼──────────────────┼──────────────────┤
│ Gender ✓         │ Male             │ Male             │
│                  │ (No conflict)                       │
├──────────────────┼──────────────────┼──────────────────┤
│ Bio ⚠️           │ ○ Engineer at    │ ○ Retired        │
│                  │   Boeing. Lived  │   engineer from  │
│                  │   in Seattle.    │   Seattle.       │
│                  │                  │ ○ Merge both     │
│                  │                  │ ○ Manual: [____] │
└──────────────────┴──────────────────┴──────────────────┘

Relationships:
  ✓ 3 shared relationships will be consolidated
  ⚠️ 1 potential conflict: Different fathers listed
  
  [Review Relationships →]

┌──────────────────────────────────────────────────────────┐
│  [Cancel]                    [Complete Merge] (disabled) │
└──────────────────────────────────────────────────────────┘
```

**Resolution Options**:

1. **Use Profile A**: Take value from Profile A
2. **Use Profile B**: Take value from Profile B
3. **Merge Both**: Concatenate text fields (bios, notes)
4. **Manual Entry**: User types custom value
5. **Leave Blank**: Neither value (for optional fields)

**Validation**:
- All conflicts must be resolved before merge can proceed
- "Complete Merge" button enabled only when all conflicts resolved

---

### Phase 4: Merge Execution

When user clicks "Complete Merge":

**Backend Transaction** (All-or-nothing):

```typescript
async function executeMerge(
  personAId: string,
  personBId: string,
  resolutions: ConflictResolution[],
  userId: string
): Promise<MergedPerson> {
  return await db.$transaction(async (tx) => {
    // 1. Create new merged person
    const mergedPerson = await tx.person.create({
      data: {
        id: uuidv4(),  // New UUID
        givenName: getResolvedValue('givenName', resolutions),
        familyName: getResolvedValue('familyName', resolutions),
        birthDate: getResolvedValue('birthDate', resolutions),
        deathDate: getResolvedValue('deathDate', resolutions),
        gender: getResolvedValue('gender', resolutions),
        bio: getResolvedValue('bio', resolutions),
        isLiving: getResolvedValue('isLiving', resolutions),
        createdBy: userId,
      },
    });
    
    // 2. Redirect all relationships from A to merged person
    await tx.relationship.updateMany({
      where: { personFromId: personAId },
      data: { personFromId: mergedPerson.id },
    });
    await tx.relationship.updateMany({
      where: { personToId: personAId },
      data: { personToId: mergedPerson.id },
    });
    
    // 3. Redirect all relationships from B to merged person
    await tx.relationship.updateMany({
      where: { personFromId: personBId },
      data: { personFromId: mergedPerson.id },
    });
    await tx.relationship.updateMany({
      where: { personToId: personBId },
      data: { personToId: mergedPerson.id },
    });
    
    // 4. Remove duplicate relationships (same type between same people)
    await tx.relationship.deleteMany({
      where: {
        /* Find and delete duplicates */
      },
    });
    
    // 5. Mark original persons as merged
    await tx.person.update({
      where: { id: personAId },
      data: {
        isMerged: true,
        mergedInto: mergedPerson.id,
        mergedAt: new Date(),
      },
    });
    await tx.person.update({
      where: { id: personBId },
      data: {
        isMerged: true,
        mergedInto: mergedPerson.id,
        mergedAt: new Date(),
      },
    });
    
    // 6. Create merge history record
    await tx.mergeHistory.create({
      data: {
        mergedPersonId: mergedPerson.id,
        sourcePersonAId: personAId,
        sourcePersonBId: personBId,
        resolutions: JSON.stringify(resolutions),
        mergedBy: userId,
      },
    });
    
    // 7. Create audit log entries
    await tx.auditLog.createMany({
      data: [
        {
          userId,
          action: 'MERGE',
          entityType: 'Person',
          entityId: mergedPerson.id,
          changes: JSON.stringify({ merged: [personAId, personBId] }),
        },
        {
          userId,
          action: 'UPDATE',
          entityType: 'Person',
          entityId: personAId,
          changes: JSON.stringify({ isMerged: true, mergedInto: mergedPerson.id }),
        },
        {
          userId,
          action: 'UPDATE',
          entityType: 'Person',
          entityId: personBId,
          changes: JSON.stringify({ isMerged: true, mergedInto: mergedPerson.id }),
        },
      ],
    });
    
    // 8. Update or remove merge proposal
    await tx.mergeProposal.updateMany({
      where: {
        OR: [
          { personAId, personBId },
          { personAId: personBId, personBId: personAId },
        ],
      },
      data: { status: 'MERGED' },
    });
    
    return mergedPerson;
  });
}
```

**Transaction guarantees**:
- ✅ Atomic: All steps succeed or all fail
- ✅ Consistent: All relationships point to valid persons
- ✅ Isolated: Other operations blocked during merge
- ✅ Durable: Changes persisted to disk before return

---

### Phase 5: Post-Merge

**Success Response**:

```typescript
{
  "success": true,
  "mergedPerson": {
    "id": "merged-uuid",
    "givenName": "John",
    "familyName": "Smith",
    // ... full merged person data
  },
  "stats": {
    "relationshipsMerged": 8,
    "duplicatesRemoved": 3
  }
}
```

**Frontend Actions**:
1. Show success message
2. Redirect to merged person's profile
3. Remove merge proposal from pending list
4. Invalidate cached person data

---

## Edge Cases & Handling

### Case 1: One Person Already Merged

**Scenario**: User tries to merge Person A with Person B, but Person B was already merged into Person C.

**Handling**:
```typescript
if (personB.isMerged) {
  // Offer to merge A with C instead
  return {
    error: 'ALREADY_MERGED',
    message: 'Person B has been merged into another profile',
    suggestedMerge: {
      personAId: personA.id,
      personBId: personB.mergedInto,  // Point to canonical person
    },
  };
}
```

### Case 2: Circular Merge Prevention

**Scenario**: Person A merged into B, then try to merge B into A.

**Handling**:
```typescript
if (personB.mergedInto === personA.id || personA.mergedInto === personB.id) {
  throw new Error('CIRCULAR_MERGE');
}
```

### Case 3: Conflicting Relationships

**Scenario**: Person A has father "John Smith (ID: 123)", Person B has father "Jonathan Smith (ID: 456)". Are these the same person?

**Handling**:
1. Surface in relationship conflict section
2. User chooses:
   - Keep both (maybe they're different people)
   - Remove one
   - Flag "John Smith" and "Jonathan Smith" as potential duplicates for future merge

### Case 4: Mass Relationships

**Scenario**: Person has 100+ children (data error or historical figure).

**Handling**:
- Show warning: "This merge will redirect 100+ relationships. Are you sure?"
- Require explicit confirmation

### Case 5: Merge Reversal

**Current**: Not implemented in MVP

**Future Design**:
```typescript
async function unmerge(mergeHistoryId: string) {
  // 1. Fetch merge history
  const history = await getMergeHistory(mergeHistoryId);
  
  // 2. Recreate both original persons
  // 3. Restore original relationships (using history data)
  // 4. Mark merged person as unmerged or delete
  // 5. Create audit log
}
```

**Complexity**: What if relationships were edited after merge? → Keep changes, but split persons.

---

## Testing Strategy

### Unit Tests

```typescript
describe('Duplicate Detection', () => {
  it('should score exact name + birth date match as 0.7+', () => {
    const score = calculateDuplicateConfidence(
      { givenName: 'John', familyName: 'Smith', birthDate: '1950-05-15' },
      { givenName: 'John', familyName: 'Smith', birthDate: '1950-05-15' }
    );
    expect(score).toBeGreaterThanOrEqual(0.7);
  });
  
  it('should score similar names with close dates as 0.5+', () => {
    const score = calculateDuplicateConfidence(
      { givenName: 'John', familyName: 'Smith', birthDate: '1950-05-15' },
      { givenName: 'Jon', familyName: 'Smith', birthDate: '1950-06-10' }
    );
    expect(score).toBeGreaterThanOrEqual(0.5);
  });
});

describe('Merge Execution', () => {
  it('should redirect all relationships atomically', async () => {
    // Test that all relationships point to merged person after merge
  });
  
  it('should rollback on failure', async () => {
    // Test transaction rollback if any step fails
  });
  
  it('should prevent merging already-merged persons', async () => {
    // Test edge case handling
  });
});
```

### Integration Tests

```typescript
describe('Full Merge Flow', () => {
  it('should detect duplicate, review, resolve, and merge', async () => {
    // 1. Create two similar persons
    // 2. Run duplicate detection
    // 3. Verify proposal created
    // 4. Get merge preview
    // 5. Submit resolutions
    // 6. Execute merge
    // 7. Verify merged person exists
    // 8. Verify original persons marked as merged
    // 9. Verify relationships redirected
    // 10. Verify audit log created
  });
});
```

---

## Performance Considerations

### Duplicate Detection Job

**Challenge**: Comparing all persons pairwise is O(n²).

**Optimizations**:
1. **Only compare within birth year range**: Birth year ±10 years
2. **Use indexes**: Index on `familyName`, `birthDate`
3. **Batch processing**: Process 1000 persons at a time
4. **Skip already-merged**: Filter `WHERE isMerged = false`
5. **Incremental**: Only check persons created/updated since last run

**Estimated Performance**:
- 10,000 persons: ~5 minutes
- 100,000 persons: ~1 hour (acceptable for nightly job)

### Merge Transaction

**Challenge**: Large merge (100s of relationships) could be slow.

**Optimizations**:
1. **Batch updates**: Use `updateMany` instead of individual updates
2. **Index on foreign keys**: Ensure `personFromId`, `personToId` indexed
3. **Connection pooling**: Use PgBouncer for connection efficiency

**Estimated Performance**:
- Simple merge (5 relationships): ~100ms
- Complex merge (100 relationships): ~1-2 seconds (acceptable)

---

## User Experience Considerations

### Clear Communication

**Before Merge**:
- "You are about to merge 2 profiles into 1. This cannot be undone."
- Show exactly what will change
- Require explicit confirmation

**During Merge**:
- Loading indicator: "Merging profiles..."
- Estimated time (if long): "This may take a few seconds"

**After Merge**:
- Success message: "Profiles merged successfully!"
- Link to merged profile
- Option to undo (future feature)

### Error Messages

**User-Friendly**:
- ❌ "CIRCULAR_MERGE_DETECTED"
- ✅ "These profiles cannot be merged because one was already merged into the other"

**Actionable**:
- ❌ "Merge failed"
- ✅ "Merge failed because Person B was already merged. Would you like to merge with the current profile instead?"

---

Last updated: 2026-04-11
