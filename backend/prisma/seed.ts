import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'test@gana.app' },
    update: {},
    create: {
      email: 'test@gana.app',
      password: hashedPassword,
      name: 'Test User',
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create sample family tree
  const grandparent = await prisma.person.create({
    data: {
      givenName: 'John',
      familyName: 'Smith',
      birthDate: new Date('1930-05-15'),
      deathDate: new Date('2010-12-20'),
      gender: 'MALE',
      bio: 'Family patriarch. Served in WWII. Loved woodworking.',
      isLiving: false,
      createdBy: user.id,
    },
  });

  const grandmother = await prisma.person.create({
    data: {
      givenName: 'Mary',
      familyName: 'Smith',
      birthDate: new Date('1932-08-22'),
      deathDate: new Date('2015-03-10'),
      gender: 'FEMALE',
      bio: 'Teacher for 40 years. Passionate about education.',
      isLiving: false,
      createdBy: user.id,
    },
  });

  const parent1 = await prisma.person.create({
    data: {
      givenName: 'Robert',
      familyName: 'Smith',
      middleName: 'James',
      birthDate: new Date('1955-03-12'),
      gender: 'MALE',
      bio: 'Engineer at Boeing. Marathon runner.',
      isLiving: true,
      createdBy: user.id,
    },
  });

  const parent2 = await prisma.person.create({
    data: {
      givenName: 'Sarah',
      familyName: 'Smith',
      birthDate: new Date('1957-11-08'),
      gender: 'FEMALE',
      bio: 'Architect. Designed schools and libraries.',
      isLiving: true,
      createdBy: user.id,
    },
  });

  const child1 = await prisma.person.create({
    data: {
      givenName: 'Emily',
      familyName: 'Smith',
      birthDate: new Date('1985-06-20'),
      gender: 'FEMALE',
      bio: 'Software engineer. Loves hiking.',
      isLiving: true,
      createdBy: user.id,
    },
  });

  const child2 = await prisma.person.create({
    data: {
      givenName: 'Michael',
      familyName: 'Smith',
      birthDate: new Date('1988-09-14'),
      gender: 'MALE',
      bio: 'Doctor. Plays guitar in a band.',
      isLiving: true,
      createdBy: user.id,
    },
  });

  console.log('✅ Created 6 family members');

  // Create relationships

  // Grandparents are partners
  await prisma.relationship.createMany({
    data: [
      {
        personFromId: grandparent.id,
        personToId: grandmother.id,
        type: 'PARTNER',
        startDate: new Date('1952-06-15'),
      },
      {
        personFromId: grandmother.id,
        personToId: grandparent.id,
        type: 'PARTNER',
        startDate: new Date('1952-06-15'),
      },
    ],
  });

  // Grandparents -> Parent relationships
  await prisma.relationship.createMany({
    data: [
      { personFromId: grandparent.id, personToId: parent1.id, type: 'PARENT' },
      { personFromId: parent1.id, personToId: grandparent.id, type: 'CHILD' },
      { personFromId: grandmother.id, personToId: parent1.id, type: 'PARENT' },
      { personFromId: parent1.id, personToId: grandmother.id, type: 'CHILD' },
    ],
  });

  // Parents are partners
  await prisma.relationship.createMany({
    data: [
      {
        personFromId: parent1.id,
        personToId: parent2.id,
        type: 'PARTNER',
        startDate: new Date('1982-08-20'),
      },
      {
        personFromId: parent2.id,
        personToId: parent1.id,
        type: 'PARTNER',
        startDate: new Date('1982-08-20'),
      },
    ],
  });

  // Parents -> Children relationships
  await prisma.relationship.createMany({
    data: [
      { personFromId: parent1.id, personToId: child1.id, type: 'PARENT' },
      { personFromId: child1.id, personToId: parent1.id, type: 'CHILD' },
      { personFromId: parent2.id, personToId: child1.id, type: 'PARENT' },
      { personFromId: child1.id, personToId: parent2.id, type: 'CHILD' },

      { personFromId: parent1.id, personToId: child2.id, type: 'PARENT' },
      { personFromId: child2.id, personToId: parent1.id, type: 'CHILD' },
      { personFromId: parent2.id, personToId: child2.id, type: 'PARENT' },
      { personFromId: child2.id, personToId: parent2.id, type: 'CHILD' },
    ],
  });

  // Siblings
  await prisma.relationship.createMany({
    data: [
      { personFromId: child1.id, personToId: child2.id, type: 'SIBLING' },
      { personFromId: child2.id, personToId: child1.id, type: 'SIBLING' },
    ],
  });

  console.log('✅ Created all family relationships');

  // Create a sample merge proposal (potential duplicate)
  const duplicate = await prisma.person.create({
    data: {
      givenName: 'John',
      familyName: 'Smith',
      birthDate: new Date('1930-05-16'), // 1 day difference
      deathDate: new Date('2010-12-20'),
      gender: 'MALE',
      bio: 'WWII veteran.',
      isLiving: false,
      createdBy: user.id,
    },
  });

  await prisma.mergeProposal.create({
    data: {
      personAId: grandparent.id,
      personBId: duplicate.id,
      confidence: 0.85,
      reason: 'Name exact match, birth date within 1 day, death date exact match',
      status: 'PENDING',
    },
  });

  console.log('✅ Created sample merge proposal');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
