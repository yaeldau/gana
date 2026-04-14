# Gana Data Model

## Overview

The Gana data model is designed to handle the complexity of real-world genealogy:
- Multiple people with the same name
- Duplicate profiles for the same real person
- Complex relationships beyond simple parent-child
- Merge operations with conflict resolution
- Complete audit trail for all changes

## Core Principles

1. **Stable Identity**: Every person has a UUID that never changes, never gets reused
2. **Name is NOT Identity**: Names can change, be similar, or identical across different people
3. **Audit Everything**: All changes are logged for accountability
4. **Merge-First Design**: Profile merging is a first-class operation, not an afterthought
5. **Relationship Integrity**: Bidirectional relationships are automatically consistent

## Entity-Relationship Diagram

```
┌─────────────┐
│    User     │
│             │
│ - id (PK)   │
│ - email     │◄───────┐
│ - password  │        │
│ - name      │        │ createdBy
└─────────────┘        │
                       │
                       │
                 ┌─────────────┐
                 │   Person    │
                 │             │
                 │ - id (PK)   │◄─────────────┐
                 │ - givenName │              │
                 │ - familyName│              │
                 │ - birthDate │              │ mergedInto
                 │ - deathDate │              │
                 │ - gender    │              │
                 │ - isLiving  │              │
                 │ - isMerged  │──────────────┘
                 │ - mergedInto│
                 └─────────────┘
                   │         │
         ┌─────────┘         └─────────┐
         │ personFrom              personTo│
         │                                 │
  ┌──────────────┐                  ┌──────────────┐
  │ Relationship │                  │ MergeHistory │
  │              │                  │              │
  │ - id (PK)    │                  │ - id (PK)    │
  │ - personFromId│                 │ - mergedPersonId│
  │ - personToId │                  │ - sourcePersonAId│
  │ - type       │                  │ - sourcePersonBId│
  │ - startDate  │                  │ - resolutions│
  │ - endDate    │                  │ - mergedBy   │
  └──────────────┘                  └──────────────┘

┌────────────────┐                  ┌──────────────┐
│ MergeProposal  │                  │  AuditLog    │
│                │                  │              │
│ - id (PK)      │                  │ - id (PK)    │
│ - personAId    │                  │ - userId     │
│ - personBId    │                  │ - action     │
│ - confidence   │                  │ - entityType │
│ - status       │                  │ - entityId   │
└────────────────┘                  │ - changes    │
                                    └──────────────┘
```

## Table Definitions

### User

Represents an authenticated user who can manage the family tree.

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  createdPersons Person[] @relation("CreatedBy")
  auditLogs      AuditLog[]
  mergeHistory   MergeHistory[]
}
```

**Key Design Decisions**:
- Email is unique (one account per email)
- Passwords are bcrypt hashed (never stored plain text)
- User can create many persons (not just their own profile)

**Future Extensions**:
- OAuth providers (Google, Facebook)
- Email verification status
- Profile photo
- Timezone, language preferences

---

### Person

Represents an individual person in the family tree. This is the central entity.

```prisma
model Person {
  id               String    @id @default(uuid())
  givenName        String    // First name(s)
  familyName       String    // Last name / surname
  middleName       String?   // Optional middle name
  birthDate        DateTime?
  deathDate        DateTime?
  gender           Gender?
  bio              String?   @db.Text
  isLiving         Boolean   @default(true)
  
  // Metadata
  createdBy        String
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  
  // Merge tracking
  isMerged         Boolean   @default(false)
  mergedInto       String?   // Points to canonical person UUID if merged
  mergedAt         DateTime?
  
  // Relations
  creator           User         @relation("CreatedBy", fields: [createdBy], references: [id])
  relationshipsFrom Relationship[] @relation("PersonFrom")
  relationshipsTo   Relationship[] @relation("PersonTo")
  
  // Indexes
  @@index([familyName, givenName])
  @@index([birthDate])
  @@index([isMerged])
  @@index([mergedInto])
}

enum Gender {
  MALE
  FEMALE
  OTHER
  UNKNOWN
}
```

**Key Design Decisions**:

1. **UUID as Primary Key**: Stable identifier that never changes
2. **Name Fields Separate**: `givenName` and `familyName` allow proper sorting and cultural variations
3. **Nullable Dates**: Birth/death dates may be unknown or approximate
4. **Soft Delete via Merge**: When merged, `isMerged = true` and `mergedInto` points to canonical person
5. **isLiving Flag**: Important for privacy (hide living people from public views in future)

**Why Not Delete Merged Persons?**
- Audit trail: preserve original data
- Reversal: enable un-merge operation
- Attribution: maintain who created each original profile

**Future Extensions**:
- `alternateNames` table for nicknames, maiden names
- `approximateBirthYear` for when exact date unknown
- `birthPlace`, `deathPlace` (location entities)
- `attributes` JSONB for flexible custom fields
- `profilePhoto` reference

---

### Relationship

Represents a connection between two people.

```prisma
model Relationship {
  id           String           @id @default(uuid())
  personFromId String
  personToId   String
  type         RelationshipType
  startDate    DateTime?        // e.g., marriage date
  endDate      DateTime?        // e.g., divorce date, death
  notes        String?          @db.Text
  
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt
  
  // Relations
  personFrom   Person           @relation("PersonFrom", fields: [personFromId], references: [id], onDelete: Cascade)
  personTo     Person           @relation("PersonTo", fields: [personToId], references: [id], onDelete: Cascade)
  
  // Constraints
  @@unique([personFromId, personToId, type])
  @@index([personFromId])
  @@index([personToId])
  @@index([type])
}

enum RelationshipType {
  PARENT      // personFrom is parent of personTo
  CHILD       // personFrom is child of personTo
  PARTNER     // personFrom is partner of personTo (spouse, marriage)
  SIBLING     // personFrom is sibling of personTo
}
```

**Key Design Decisions**:

1. **Directional Relationships**: Some relationships are directional (PARENT → CHILD), some symmetric (SIBLING, PARTNER)
2. **Bidirectional Consistency**: When creating PARENT relationship, automatically create inverse CHILD relationship (handled in application logic)
3. **Time-Bound**: `startDate` and `endDate` support relationships that change over time (e.g., marriages)
4. **Unique Constraint**: Same type of relationship can't exist twice between same two people
5. **Cascade Delete**: If person deleted, relationships are deleted (preserve referential integrity)

**Application Logic Rules**:

```typescript
// When creating PARENT relationship:
createRelationship({ from: parentId, to: childId, type: PARENT })
  → Also creates: { from: childId, to: parentId, type: CHILD }

// When creating PARTNER relationship:
createRelationship({ from: personA, to: personB, type: PARTNER })
  → Also creates: { from: personB, to: personA, type: PARTNER }

// When creating SIBLING relationship:
createRelationship({ from: personA, to: personB, type: SIBLING })
  → Also creates: { from: personB, to: personA, type: SIBLING }
```

**Validation Rules**:
- Person cannot be their own parent, child, sibling, or partner
- Prevent logical impossibilities (person born after parent died, etc.)
- Future: prevent incest in partner relationships

**Future Extensions**:
- `GUARDIAN` - legal guardian (not biological parent)
- `ADOPTED_PARENT` / `BIOLOGICAL_PARENT` - distinguish adoption
- `GODPARENT`, `STEPPARENT`, `STEPSIBLING`
- `relationshipQuality` enum: `BIOLOGICAL`, `ADOPTED`, `STEP`, `FOSTER`

---

### MergeProposal

Represents a detected potential duplicate that should be reviewed for merging.

```prisma
model MergeProposal {
  id          String   @id @default(uuid())
  personAId   String
  personBId   String
  confidence  Float    // 0.0 to 1.0 score
  status      MergeProposalStatus @default(PENDING)
  reason      String?  @db.Text  // Why these were matched
  
  createdAt   DateTime @default(now())
  reviewedAt  DateTime?
  reviewedBy  String?  // User ID who accepted/rejected
  
  // Relations
  personA     Person   @relation("PersonA", fields: [personAId], references: [id], onDelete: Cascade)
  personB     Person   @relation("PersonB", fields: [personBId], references: [id], onDelete: Cascade)
  
  @@unique([personAId, personBId])
  @@index([status])
  @@index([confidence])
}

enum MergeProposalStatus {
  PENDING      // Awaiting review
  ACCEPTED     // User confirmed - ready to merge
  REJECTED     // User confirmed - not a match
  MERGED       // Merge completed
  SUPERSEDED   // One person was merged elsewhere
}
```

**Key Design Decisions**:

1. **Confidence Score**: Algorithm generates 0-1 score based on matching criteria
2. **Status Tracking**: Clear workflow from detection → review → merge
3. **Unique Constraint**: Can't propose same pair twice
4. **Reason Field**: Store why match was suggested (for transparency)

**Matching Algorithm** (Background Job):

```typescript
Criteria for high-confidence match:
  - Name similarity (Levenshtein distance ≤ 3) → +0.4
  - Birth date within ±2 years → +0.3
  - Same parents → +0.2
  - Same children → +0.1
  - Same gender → +0.05
  
  Threshold: ≥ 0.6 → Create proposal
```

---

### MergeHistory

Complete record of every merge operation for auditability and potential reversal.

```prisma
model MergeHistory {
  id                String   @id @default(uuid())
  mergedPersonId    String   // The new canonical person (result)
  sourcePersonAId   String   // Original person A UUID
  sourcePersonBId   String   // Original person B UUID
  
  resolutions       Json     // Field-by-field conflict decisions
  
  mergedBy          String   // User ID who performed merge
  mergedAt          DateTime @default(now())
  
  // Relations
  mergedPerson      Person   @relation("MergedResult", fields: [mergedPersonId], references: [id])
  merger            User     @relation(fields: [mergedBy], references: [id])
  
  @@index([mergedPersonId])
  @@index([sourcePersonAId])
  @@index([sourcePersonBId])
}
```

**Resolutions JSON Structure**:

```json
{
  "givenName": {
    "source": "A",
    "valueA": "John",
    "valueB": "Jon",
    "chosen": "John"
  },
  "birthDate": {
    "source": "A",
    "valueA": "1950-05-15",
    "valueB": "1950-05-16",
    "chosen": "1950-05-15"
  },
  "bio": {
    "source": "MERGED",
    "valueA": "Engineer at Boeing",
    "valueB": "Retired engineer",
    "chosen": "Engineer at Boeing. Retired."
  }
}
```

**Key Design Decisions**:

1. **Preserve Everything**: Full original data for both persons
2. **Explicit Choices**: Every conflict resolution recorded
3. **Enable Reversal**: Contains all info needed to un-merge
4. **Audit Trail**: Who did the merge and when

---

### AuditLog

Complete audit trail of all data changes.

```prisma
model AuditLog {
  id         String   @id @default(uuid())
  userId     String   // Who made the change
  action     AuditAction
  entityType String   // "Person", "Relationship", etc.
  entityId   String   // UUID of the changed entity
  changes    Json     // Before/after values
  timestamp  DateTime @default(now())
  
  // Relations
  user       User     @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([entityType, entityId])
  @@index([timestamp])
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  MERGE
}
```

**Changes JSON Structure**:

```json
{
  "before": {
    "givenName": "John",
    "birthDate": "1950-05-15"
  },
  "after": {
    "givenName": "Jonathan",
    "birthDate": "1950-05-15"
  }
}
```

**Key Design Decisions**:

1. **Every Change Logged**: Comprehensive audit trail
2. **Generic Structure**: Works for all entity types
3. **Queryable**: Indexes for "show me all changes to person X" or "show me all of user Y's changes"

---

## Data Integrity Constraints

### Database-Level

```sql
-- Relationships must point to valid persons
FOREIGN KEY constraints on personFromId, personToId

-- Email must be unique
UNIQUE constraint on User.email

-- Merged person must point to valid person
FOREIGN KEY on Person.mergedInto

-- Same relationship can't exist twice
UNIQUE constraint on (personFromId, personToId, type)
```

### Application-Level

```typescript
// Bidirectional relationship consistency
When creating PARENT relationship, automatically create CHILD inverse

// Prevent self-relationships
personFrom !== personTo

// Prevent merging already-merged persons
if (person.isMerged) throw new Error("Already merged")

// Prevent circular merges
if (personB.mergedInto === personA.id) throw new Error("Circular merge")

// Atomic merge transaction
BEGIN;
  UPDATE persons SET isMerged=true, mergedInto=... WHERE id=...;
  UPDATE relationships SET personFromId=... WHERE personFromId=...;
  INSERT INTO merge_history ...;
  INSERT INTO audit_log ...;
COMMIT;
```

## Query Patterns

### Find All Ancestors

Using PostgreSQL recursive CTE:

```sql
WITH RECURSIVE ancestors AS (
  -- Base case: immediate parents
  SELECT p.id, p.givenName, p.familyName, 1 as generation
  FROM persons p
  JOIN relationships r ON r.personToId = p.id
  WHERE r.personFromId = $personId AND r.type = 'PARENT'
  
  UNION ALL
  
  -- Recursive case: parents of parents
  SELECT p.id, p.givenName, p.familyName, a.generation + 1
  FROM persons p
  JOIN relationships r ON r.personToId = p.id
  JOIN ancestors a ON a.id = r.personFromId
  WHERE r.type = 'PARENT' AND a.generation < 10  -- Limit depth
)
SELECT * FROM ancestors ORDER BY generation;
```

### Find All Descendants

```sql
WITH RECURSIVE descendants AS (
  -- Base case: immediate children
  SELECT p.id, p.givenName, p.familyName, 1 as generation
  FROM persons p
  JOIN relationships r ON r.personToId = p.id
  WHERE r.personFromId = $personId AND r.type = 'CHILD'
  
  UNION ALL
  
  -- Recursive case: children of children
  SELECT p.id, p.givenName, p.familyName, d.generation + 1
  FROM persons p
  JOIN relationships r ON r.personToId = p.id
  JOIN descendants d ON d.id = r.personFromId
  WHERE r.type = 'CHILD' AND d.generation < 10
)
SELECT * FROM descendants ORDER BY generation;
```

### Search People

```sql
SELECT id, givenName, familyName, birthDate, isLiving
FROM persons
WHERE 
  isMerged = false
  AND (
    givenName ILIKE '%' || $query || '%'
    OR familyName ILIKE '%' || $query || '%'
  )
ORDER BY familyName, givenName
LIMIT 50;
```

## Indexes for Performance

```prisma
// Person indexes
@@index([familyName, givenName])  // For name search/sort
@@index([birthDate])               // For date range queries
@@index([isMerged])                // Filter out merged persons
@@index([createdBy])               // Find all persons created by user

// Relationship indexes
@@index([personFromId])            // For relationship traversal
@@index([personToId])              // For reverse relationships
@@index([type])                    // Filter by relationship type

// Audit log indexes
@@index([userId])                  // Find all actions by user
@@index([entityType, entityId])    // Find all changes to entity
@@index([timestamp])               // Time-based queries

// Merge proposal indexes
@@index([status])                  // Find pending proposals
@@index([confidence])              // High-confidence matches first
```

## Future Schema Extensions

### PersonName (Separate Table)
Support multiple names per person over time:

```prisma
model PersonName {
  id        String    @id @default(uuid())
  personId  String
  type      NameType  // PRIMARY, MAIDEN, NICKNAME, ALTERNATE
  givenName String
  familyName String
  startDate DateTime?
  endDate   DateTime?
  
  person    Person    @relation(fields: [personId], references: [id])
}
```

### Location
Support birth place, death place, residences:

```prisma
model Location {
  id        String @id @default(uuid())
  city      String?
  state     String?
  country   String
  latitude  Float?
  longitude Float?
}

model PersonLocation {
  id         String       @id @default(uuid())
  personId   String
  locationId String
  type       LocationType // BIRTH, DEATH, RESIDENCE
  startDate  DateTime?
  endDate    DateTime?
}
```

### Media
Support photos, documents:

```prisma
model Media {
  id          String    @id @default(uuid())
  type        MediaType // PHOTO, DOCUMENT, VIDEO
  url         String
  caption     String?
  uploadedBy  String
  uploadedAt  DateTime  @default(now())
  
  people      PersonMedia[]
}

model PersonMedia {
  personId  String
  mediaId   String
  person    Person @relation(fields: [personId], references: [id])
  media     Media  @relation(fields: [mediaId], references: [id])
  
  @@id([personId, mediaId])
}
```

---

Last updated: 2026-04-11
