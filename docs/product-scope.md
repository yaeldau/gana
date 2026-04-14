# Product Scope

## Vision

Gana is a modern family heritage platform that makes it easy to build, maintain, and explore your family tree with confidence, even when dealing with complex real-world scenarios like duplicate profiles, conflicting information, and collaborative contributions from multiple family members.

## Target Users

### Primary User Persona: **The Family Historian**
- Age: 35-65
- Role: Usually one person in the family who takes on the responsibility of maintaining the family tree
- Goals:
  - Preserve family history for future generations
  - Connect scattered family information into one coherent tree
  - Collaborate with relatives to gather more information
  - Resolve conflicts when different family members remember things differently

### Secondary User Persona: **The Contributor**
- Age: 25-70
- Role: Family member who occasionally adds information or photos
- Goals:
  - Add their own branch to the family tree
  - Share photos and stories about relatives
  - Correct mistakes they notice
  - Simple, easy contribution without learning complex systems

## Core Value Proposition

**Unlike other genealogy platforms:**
- ✅ **Smart duplicate handling**: Intelligently detects when the same person has been added multiple times and helps you merge carefully
- ✅ **Transparent conflict resolution**: Shows you exactly what will change when merging profiles, field by field
- ✅ **Complete audit trail**: Every change is tracked - you can see who added what and when
- ✅ **Modern, beautiful design**: Clean interface that doesn't feel like legacy software
- ✅ **Designed for collaboration**: Multiple family members can contribute without creating a mess

## MVP Scope (Phase 1)

### ✅ In Scope

#### 1. User Management
- Email/password registration
- Login/logout
- User profile editing
- Password reset (email-based)

#### 2. Person Management
- Create person profiles (for self or others)
- Edit person details:
  - Given name (first name)
  - Family name (last name)
  - Middle name
  - Birth date
  - Death date (if deceased)
  - Gender
  - Biography (free text)
  - Living status
- Delete person (soft delete)
- View person profile page

#### 3. Relationships
- Create relationships between people:
  - Parent → Child (automatically bidirectional)
  - Partners (spouse/marriage)
  - Siblings
- Edit relationship details:
  - Start date (e.g., marriage date)
  - End date (e.g., divorce date)
  - Notes
- Delete relationships
- View all relationships for a person

#### 4. Family Tree Visualization
- Basic hierarchical tree view
  - Parents above, children below
  - Partners side-by-side
  - Multiple generations visible
- Click person to view profile
- Navigate through tree by clicking relatives
- Zoom and pan controls

#### 5. Search & Discovery
- Search people by name
- Filter by:
  - Living status (living/deceased)
  - Gender
  - Has biography
- Sort results by:
  - Name (alphabetical)
  - Birth date (oldest first / youngest first)
  - Recently added

#### 6. Duplicate Detection
- Background job runs nightly
- Detects potential duplicates based on:
  - Name similarity
  - Birth date proximity
  - Shared relationships
- Creates merge proposals
- User-initiated duplicate flagging
- List of pending merge proposals

#### 7. Profile Merging
- Side-by-side comparison of two profiles
- Field-by-field conflict resolution
- Relationship consolidation
- Atomic merge transaction
- Complete audit trail
- Success/error feedback

#### 8. Audit & History
- View all changes to a person
- See who created/edited each person
- Track all merge operations
- Filter audit log by:
  - User
  - Action type (create, update, delete, merge)
  - Date range
  - Entity (person, relationship)

#### 9. Data Quality
- Validation rules:
  - Required fields (name)
  - Date validation (birth before death)
  - Relationship validation (no self-relationships)
- Error messages for invalid input
- Duplicate detection to maintain quality

### ❌ Out of Scope for MVP

#### Photos & Media
- Photo uploads
- Document attachments
- Media galleries
- Photo tagging

**Why deferred**: Core data model more important; media can be added later without schema changes.

#### Advanced Timeline
- Life events timeline
- Historical event integration
- Interactive timeline visualization

**Why deferred**: Requires additional event modeling; MVP focuses on people and relationships.

#### Collaboration Features
- Invitations to join family tree
- Permission levels (view/edit/admin)
- Family workspace/groups
- Activity feed
- Comments/discussions

**Why deferred**: MVP assumes trusted users; collaboration layer can be added once core features solid.

#### AI Features
- Automatic family insights
- Relationship suggestions
- Photo face recognition
- Story generation from data

**Why deferred**: Requires stable data model first; AI is enhancement not foundation.

#### Import/Export
- GEDCOM import
- GEDCOM export
- CSV export
- PDF family tree export

**Why deferred**: Complex format handling; manual entry sufficient for MVP validation.

#### Multi-Language Support
- Internationalization (i18n)
- Translated UI
- Multi-language names

**Why deferred**: English-first for MVP; i18n infrastructure can be added later.

#### Advanced Relationship Types
- Godparents
- Adoptive vs biological parents
- Step-relationships
- Legal guardians

**Why deferred**: Core 4 types (parent, child, partner, sibling) cover 90% of cases.

#### Mobile Apps
- Native iOS app
- Native Android app

**Why deferred**: Responsive web app sufficient; native apps can follow if traction.

#### DNA Integration
- DNA test results
- Ethnicity estimates
- DNA match suggestions

**Why deferred**: Requires partnerships with testing companies; post-MVP.

## MVP User Flows

### Flow 1: New User Creates First Family Tree

1. User lands on homepage
2. Clicks "Get Started"
3. Signs up with email/password
4. Sees empty dashboard with "Add your first family member"
5. Fills out form for themselves
6. Sees their profile page
7. Clicks "Add relationship"
8. Adds their parent (creates new person + relationship in one flow)
9. Adds their sibling
10. Clicks "View family tree"
11. Sees simple tree with 3 people

**Success Criteria**: User has created a basic 3-person tree in < 5 minutes.

### Flow 2: User Merges Duplicate Profiles

1. User's cousin also adds "Grandma Mary"
2. Now there are 2 profiles for same person
3. Background job detects duplicate (name + birth date similar)
4. User sees notification: "1 possible duplicate found"
5. User clicks notification
6. Sees side-by-side comparison
7. Reviews conflicts:
   - User's profile: "Mary Elizabeth Johnson"
   - Cousin's profile: "Mary E. Johnson"
   - Birth dates differ by 1 day (probably typo)
8. Resolves conflicts:
   - Name: chooses "Mary Elizabeth Johnson" (more complete)
   - Birth date: chooses User's date (more specific)
9. Clicks "Merge profiles"
10. Sees success message
11. Sees merged profile with consolidated relationships

**Success Criteria**: User successfully merges duplicates without confusion or data loss.

### Flow 3: User Searches for Relative

1. User has 50+ people in tree
2. Wants to find "Uncle Bob"
3. Enters "Bob" in search box
4. Sees list of all Bobs in tree
5. Filters by "Deceased"
6. Finds correct Bob
7. Clicks to view profile
8. Clicks "View in tree" to see Bob's position in family tree

**Success Criteria**: User finds person in large tree in < 30 seconds.

## Success Metrics

### MVP Success Criteria

**User Engagement**:
- ✅ 80% of users who sign up add at least 3 people
- ✅ 50% of users who add 3 people return within 1 week
- ✅ Average session time > 10 minutes (indicates engagement)

**Data Quality**:
- ✅ < 5% of profiles are duplicates (duplicate detection working)
- ✅ > 90% of merge operations completed successfully
- ✅ < 1% of merges reverted/complained about

**Technical**:
- ✅ Page load time < 2 seconds (performance)
- ✅ API response time p95 < 500ms
- ✅ Zero data loss incidents
- ✅ 99.9% uptime

**User Satisfaction**:
- ✅ "Easy to use" rating > 4/5
- ✅ "Merge feature is helpful" rating > 4/5
- ✅ Would recommend to family: > 70%

## Future Roadmap (Post-MVP)

### Phase 2: Collaboration & Media (Months 3-4)
- Photo uploads and galleries
- Invitations to join family tree
- Permission levels
- Activity feed
- Comments on profiles

### Phase 3: Advanced Features (Months 5-6)
- Life events timeline
- GEDCOM import/export
- Advanced relationship types
- PDF export of family tree
- Email notifications

### Phase 4: Intelligence & Scale (Months 7-9)
- AI-powered relationship suggestions
- Automatic duplicate detection improvements
- Photo face recognition
- Historical event integration
- Family insights dashboard

### Phase 5: Platform & Expansion (Months 10-12)
- Mobile apps (iOS/Android)
- Multi-language support
- DNA integration
- Public family tree sharing
- Premium features

## Non-Functional Requirements

### Performance
- Page load < 2s
- Search results < 500ms
- Tree visualization for 100 people < 3s
- Merge operation < 2s

### Scalability
- Support 10,000 people per tree
- Support 1,000 concurrent users
- Database can grow to 1M+ persons

### Security
- Passwords hashed with bcrypt
- JWT tokens for authentication
- HTTPS only
- SQL injection prevention (Prisma parameterization)
- XSS prevention (React auto-escaping)

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast ratios
- Focus indicators

### Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

### Data Privacy
- Users own their data
- Data export available
- Account deletion removes all user data
- GDPR-ready architecture (for future EU users)

## Open Questions

### For User Research
- [ ] How do users prefer to visualize large trees (100+ people)?
- [ ] What's the acceptable time to complete a merge operation?
- [ ] Do users want automatic merges for high-confidence matches?
- [ ] What privacy controls are essential vs nice-to-have?

### For Technical Research
- [ ] Best library for tree visualization (D3.js vs React Flow vs custom)?
- [ ] When to introduce caching layer (Redis)?
- [ ] Optimal duplicate detection frequency (nightly vs real-time)?

---

Last updated: 2026-04-11
