-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('PARENT', 'CHILD', 'PARTNER', 'SIBLING');

-- CreateEnum
CREATE TYPE "MergeProposalStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'MERGED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'MERGE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persons" (
    "id" TEXT NOT NULL,
    "givenName" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "middleName" TEXT,
    "birthDate" DATE,
    "deathDate" DATE,
    "gender" "Gender",
    "bio" TEXT,
    "isLiving" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isMerged" BOOLEAN NOT NULL DEFAULT false,
    "mergedInto" TEXT,
    "mergedAt" TIMESTAMP(3),

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relationships" (
    "id" TEXT NOT NULL,
    "personFromId" TEXT NOT NULL,
    "personToId" TEXT NOT NULL,
    "type" "RelationshipType" NOT NULL,
    "startDate" DATE,
    "endDate" DATE,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merge_proposals" (
    "id" TEXT NOT NULL,
    "personAId" TEXT NOT NULL,
    "personBId" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "status" "MergeProposalStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,

    CONSTRAINT "merge_proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merge_history" (
    "id" TEXT NOT NULL,
    "mergedPersonId" TEXT NOT NULL,
    "sourcePersonAId" TEXT NOT NULL,
    "sourcePersonBId" TEXT NOT NULL,
    "resolutions" JSONB NOT NULL,
    "mergedBy" TEXT NOT NULL,
    "mergedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "merge_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "persons_familyName_givenName_idx" ON "persons"("familyName", "givenName");

-- CreateIndex
CREATE INDEX "persons_birthDate_idx" ON "persons"("birthDate");

-- CreateIndex
CREATE INDEX "persons_isMerged_idx" ON "persons"("isMerged");

-- CreateIndex
CREATE INDEX "persons_mergedInto_idx" ON "persons"("mergedInto");

-- CreateIndex
CREATE INDEX "persons_createdBy_idx" ON "persons"("createdBy");

-- CreateIndex
CREATE INDEX "relationships_personFromId_idx" ON "relationships"("personFromId");

-- CreateIndex
CREATE INDEX "relationships_personToId_idx" ON "relationships"("personToId");

-- CreateIndex
CREATE INDEX "relationships_type_idx" ON "relationships"("type");

-- CreateIndex
CREATE UNIQUE INDEX "relationships_personFromId_personToId_type_key" ON "relationships"("personFromId", "personToId", "type");

-- CreateIndex
CREATE INDEX "merge_proposals_status_idx" ON "merge_proposals"("status");

-- CreateIndex
CREATE INDEX "merge_proposals_confidence_idx" ON "merge_proposals"("confidence");

-- CreateIndex
CREATE UNIQUE INDEX "merge_proposals_personAId_personBId_key" ON "merge_proposals"("personAId", "personBId");

-- CreateIndex
CREATE INDEX "merge_history_mergedPersonId_idx" ON "merge_history"("mergedPersonId");

-- CreateIndex
CREATE INDEX "merge_history_sourcePersonAId_idx" ON "merge_history"("sourcePersonAId");

-- CreateIndex
CREATE INDEX "merge_history_sourcePersonBId_idx" ON "merge_history"("sourcePersonBId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs"("timestamp");

-- AddForeignKey
ALTER TABLE "persons" ADD CONSTRAINT "persons_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_personFromId_fkey" FOREIGN KEY ("personFromId") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_personToId_fkey" FOREIGN KEY ("personToId") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merge_proposals" ADD CONSTRAINT "merge_proposals_personAId_fkey" FOREIGN KEY ("personAId") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merge_proposals" ADD CONSTRAINT "merge_proposals_personBId_fkey" FOREIGN KEY ("personBId") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merge_history" ADD CONSTRAINT "merge_history_mergedPersonId_fkey" FOREIGN KEY ("mergedPersonId") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merge_history" ADD CONSTRAINT "merge_history_mergedBy_fkey" FOREIGN KEY ("mergedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
