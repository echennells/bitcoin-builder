# Schema Development Guide

A comprehensive guide to creating, updating, and managing schemas in the Bitcoin Builder Vancouver codebase.

## Table of Contents

1. [Overview](#overview)
2. [Adding a New Schema](#adding-a-new-schema)
3. [Updating Existing Schemas](#updating-existing-schemas)
4. [Creating Relationships](#creating-relationships)
5. [Helper Functions](#helper-functions)
6. [Testing & Validation](#testing--validation)
7. [Best Practices](#best-practices)
8. [Complete Examples](#complete-examples)

---

## Overview

Our content management system uses a type-safe, schema-validated architecture:

```
JSON Content → Zod Schema → TypeScript Types → React Components
```

**Key Files:**

- `lib/schemas.ts` - Define Zod validation schemas
- `lib/types.ts` - TypeScript type definitions (auto-inferred)
- `lib/content.ts` - Content loader functions
- `lib/content/registry.ts` - Central content registry
- `content/*.json` - JSON content files

---

## Adding a New Schema

Follow these steps to add a completely new content type.

### Step 1: Define Schema in `lib/schemas.ts`

Add your schema definition at the end of the file:

```typescript
// lib/schemas.ts

// Individual item schema
export const PresenterSchema = z.object({
  id: z.string(), // Required: Unique identifier
  name: z.string(), // Required: Full name
  slug: z.string(), // Required: URL-safe identifier
  bio: z.string(), // Required: Biography
  title: z.string().optional(), // Optional: Job title
  company: z.string().optional(), // Optional: Company name
  avatar: z.string().optional(), // Optional: Avatar URL
  links: z
    .object({
      // Optional: Social links
      twitter: z.string().optional(),
      github: z.string().optional(),
      website: z.string().optional(),
    })
    .optional(),
});

// Collection schema (for multiple items)
export const PresentersCollectionSchema = z.object({
  presenters: z.array(PresenterSchema),
});
```

**Schema Naming Convention:**

- Single item: `[Name]Schema` (e.g., `PresenterSchema`)
- Collection: `[Name]sCollectionSchema` (e.g., `PresentersCollectionSchema`)

### Step 2: Export Types in `lib/types.ts`

Add type exports using Zod's type inference:

```typescript
// lib/types.ts
import { PresenterSchema, PresentersCollectionSchema } from "./schemas";

// Single item type
export type Presenter = z.infer<typeof PresenterSchema>;

// Collection type
export type PresentersCollection = z.infer<typeof PresentersCollectionSchema>;
```

### Step 3: Create Loaders in `lib/content.ts`

Add loader functions to access your content:

```typescript
// lib/content.ts
import { PresentersCollectionSchema } from "./schemas";
import type { Presenter, PresentersCollection } from "./types";

/**
 * Loads all presenters
 * @returns Collection of presenter profiles
 * @throws {Error} If presenters.json is invalid or missing
 */
export function loadPresenters(): PresentersCollection {
  return loadContent("presenters.json", PresentersCollectionSchema);
}

/**
 * Loads a single presenter by ID
 * @param id - Unique presenter identifier
 * @returns Presenter object if found, undefined otherwise
 * @throws {Error} If presenters.json cannot be loaded
 */
export function loadPresenter(id: string): Presenter | undefined {
  const presenters = loadPresenters();
  return presenters.presenters.find((presenter) => presenter.id === id);
}

/**
 * Loads a single presenter by slug
 * @param slug - URL-safe presenter identifier
 * @returns Presenter object if found, undefined otherwise
 */
export function loadPresenterBySlug(slug: string): Presenter | undefined {
  const presenters = loadPresenters();
  return presenters.presenters.find((presenter) => presenter.slug === slug);
}

// Async version for Server Components
export const loadPresentersAsync = () =>
  loadContentAsync("presenters.json", PresentersCollectionSchema);
```

**Loader Naming Convention:**

- Collection: `load[Name]s()` (e.g., `loadPresenters()`)
- By ID: `load[Name](id: string)` (e.g., `loadPresenter(id)`)
- By slug: `load[Name]BySlug(slug: string)`
- Async: `load[Name]sAsync()`

### Step 4: Register in `lib/content/registry.ts`

Add your content type to the central registry:

```typescript
// lib/content/registry.ts
import { PresentersCollectionSchema } from "../schemas";
import type { PresentersCollection } from "../types";

export const CONTENT_REGISTRY = {
  // ... existing entries ...

  presenters: {
    filename: "presenters.json",
    schema: PresentersCollectionSchema,
    description: "Speaker and presenter profiles",
    category: "collections",
  } as ContentEntry<PresentersCollection>,
} as const;
```

**Category Options:**

- `"pages"` - Single page content (home, onboarding)
- `"collections"` - Multiple items (events, recaps)
- `"education"` - Educational content (bitcoin101, lightning101)
- `"foundation"` - Organization content (mission, vision)

### Step 5: Create JSON Content File

Create the content file in `content/` directory:

```json
// content/presenters.json
{
  "presenters": [
    {
      "id": "alice-johnson",
      "name": "Alice Johnson",
      "slug": "alice-johnson",
      "bio": "Lightning Network developer and educator with 5 years experience.",
      "title": "Lightning Core Developer",
      "company": "Lightning Labs",
      "avatar": "/images/presenters/alice.jpg",
      "links": {
        "twitter": "https://twitter.com/alice",
        "github": "https://github.com/alice",
        "website": "https://alice.dev"
      }
    }
  ]
}
```

### Step 6: Validate

Run validation to ensure everything is correct:

```bash
npm run validate:content
npm run tsc
npm run build
```

---

## Updating Existing Schemas

### Adding a New Field

To add a field to an existing schema:

```typescript
// lib/schemas.ts

export const EventSchema = z.object({
  title: z.string(),
  slug: z.string(),
  date: z.string(),
  time: z.string(),
  location: z.string(),
  description: z.string(),
  sections: z.array(SectionSchema),
  meta: MetaSchema,

  // NEW FIELDS - Add at the end
  capacity: z.number().optional(), // Optional field
  registrationUrl: z.string().url().optional(), // With validation
  tags: z.array(z.string()).default([]), // With default value
});
```

**Important:** When adding new fields:

- Add them at the end of the schema
- Make them optional (`.optional()`) to maintain backward compatibility
- Or provide a default value (`.default(value)`)
- Update existing content files if the field is required

### Making a Field Optional

```typescript
// Before
location: z.string(),

// After
location: z.string().optional(),
```

### Adding Validation Rules

```typescript
// Email validation
email: z.string().email(),

// URL validation
website: z.string().url(),

// Enum (limited options)
status: z.enum(["draft", "published", "archived"]),

// Date format
date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

// Min/Max for numbers
capacity: z.number().min(1).max(500),

// Min/Max for strings
bio: z.string().min(50).max(500),

// Custom validation
slug: z.string().refine(
  (val) => /^[a-z0-9-]+$/.test(val),
  { message: "Slug must be lowercase, alphanumeric with hyphens" }
),
```

### Removing a Field (Breaking Change)

1. Mark field as optional first:

```typescript
// Step 1: Make optional
oldField: z.string().optional(),
```

2. Update all content files to remove the field

3. Remove from schema after content is updated:

```typescript
// Step 2: Remove entirely
// oldField removed
```

---

## Creating Relationships

There are several patterns for connecting schemas.

### Pattern 1: Foreign Key (ID Reference) ⭐ Recommended

**Best for:** Most relationships, especially one-to-many

```typescript
// Presentation references Presenter by ID
export const PresentationSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  presenterId: z.string(), // Foreign key
  // ... other fields
});
```

**Usage:**

```typescript
const presentation = loadPresentation("intro-to-lightning");
const presenter = loadPresenter(presentation.presenterId);
```

**Pros:**

- Flexible and maintainable
- No data duplication
- Easy to update presenter info in one place

**Cons:**

- Requires an extra lookup
- Need helper functions for convenience

### Pattern 2: Array of IDs (One-to-Many)

**Best for:** Multiple related items

```typescript
// Event has multiple presentations
export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  presentationIds: z.array(z.string()).optional(), // Array of foreign keys
  // ... other fields
});
```

**Usage:**

```typescript
const event = loadEvent("lightning-workshop");
const presentations = event.presentationIds
  ?.map((id) => loadPresentation(id))
  .filter(Boolean); // Remove undefined values
```

### Pattern 3: Bidirectional References

**Best for:** When you need to navigate both ways

```typescript
// Presentation → Event
export const PresentationSchema = z.object({
  // ...
  eventId: z.string().optional(),
});

// Event → Presentations
export const EventSchema = z.object({
  // ...
  presentationIds: z.array(z.string()).optional(),
});
```

### Pattern 4: Embedded Data (Denormalized)

**Best for:** When you always need basic info together

```typescript
// Include minimal presenter data directly
export const PresentationSchema = z.object({
  id: z.string(),
  title: z.string(),
  presenter: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string().optional(),
  }),
  // ... other fields
});
```

**Pros:**

- No extra lookup needed
- Fast access to common data

**Cons:**

- Data duplication
- Updates must be synchronized
- Larger file sizes

### Pattern 5: Slug-based References

**Best for:** When URLs are important

```typescript
export const RecapSchema = z.object({
  // ...
  eventSlug: z.string(), // Reference by slug instead of ID
});
```

**Usage:**

```typescript
const recap = loadRecap("october-2025-recap");
const event = loadEventBySlug(recap.eventSlug);
```

---

## Helper Functions

Create utility functions to simplify working with relationships.

### Location

Add helper functions to `lib/content.ts` or create `lib/utils/content-helpers.ts` for complex relationships.

### Example: Get Presentation with Presenter

```typescript
// lib/content.ts or lib/utils/content-helpers.ts

/**
 * Get presentation with full presenter details
 * @param slug - Presentation slug
 * @returns Presentation with embedded presenter data
 */
export function getPresentationWithPresenter(slug: string) {
  const presentation = loadPresentation(slug);
  if (!presentation) return undefined;

  const presenter = loadPresenter(presentation.presenterId);

  return {
    ...presentation,
    presenter, // Embedded presenter object
  };
}
```

### Example: Get Event with All Presentations

```typescript
/**
 * Get event with all presentations and their presenters
 * @param slug - Event slug
 * @returns Event with embedded presentations array
 */
export function getEventWithPresentations(slug: string) {
  const event = loadEvent(slug);
  if (!event || !event.presentationIds) return undefined;

  const presentations = event.presentationIds
    .map((id) => {
      const presentation = loadPresentations().presentations.find(
        (p) => p.id === id
      );
      if (!presentation) return null;

      const presenter = loadPresenter(presentation.presenterId);
      return { ...presentation, presenter };
    })
    .filter(Boolean); // Remove nulls

  return {
    ...event,
    presentations,
  };
}
```

### Example: Get All Presentations by Presenter

```typescript
/**
 * Get all presentations by a specific presenter
 * @param presenterId - Presenter ID
 * @returns Array of presentations
 */
export function getPresentationsByPresenter(presenterId: string) {
  const allPresentations = loadPresentations();
  return allPresentations.presentations.filter(
    (p) => p.presenterId === presenterId
  );
}
```

### Example: Get Presentations by Event

```typescript
/**
 * Get all presentations for an event
 * @param eventId - Event ID
 * @returns Array of presentations with presenter details
 */
export function getPresentationsByEvent(eventId: string) {
  const allPresentations = loadPresentations();

  return allPresentations.presentations
    .filter((p) => p.eventId === eventId)
    .map((presentation) => {
      const presenter = loadPresenter(presentation.presenterId);
      return { ...presentation, presenter };
    });
}
```

---

## Testing & Validation

### Validating New Schemas

After creating or updating schemas, always validate:

```bash
# Validate all content
npm run validate:content

# Type check
npm run tsc

# Test build
npm run build
```

### Testing in Development

```bash
# Start dev server (includes validation)
npm run dev
```

### Manual Testing Checklist

- [ ] Schema validates successfully
- [ ] Types are correctly inferred
- [ ] Loader functions return expected data
- [ ] Content file validates against schema
- [ ] Related data loads correctly
- [ ] Page renders without errors
- [ ] Build completes successfully

---

## Best Practices

### Schema Design

1. **Start Simple**: Begin with basic fields, add complexity later
2. **Use IDs for Relationships**: Prefer ID-based references over embedding
3. **Make Fields Optional**: Unless truly required, make fields optional
4. **Add Validation**: Use Zod's built-in validators (email, url, regex)
5. **Document with JSDoc**: Add comments to explain complex schemas

### Naming Conventions

```typescript
// Schema names: PascalCase + "Schema"
EventSchema;
PresentationSchema;
PresentersCollectionSchema;

// Type names: PascalCase (same as schema without "Schema")
Event;
Presentation;
PresentersCollection;

// Loader functions: camelCase
loadEvents();
loadPresentation(slug);
getPresentationWithPresenter(slug);

// File names: kebab-case.json
events.json;
presenters.json;
what - to - expect.json;
```

### Content Files

1. **Use Consistent IDs**: UUIDs or readable slugs
2. **Keep Files Focused**: One content type per file
3. **Validate Before Committing**: Run `npm run validate:content`
4. **Format JSON**: Use Prettier for consistent formatting

### Relationship Guidelines

1. **Prefer IDs over Slugs**: IDs are more stable
2. **Document Relationships**: Add comments explaining connections
3. **Create Helper Functions**: Abstract complex relationship logic
4. **Avoid Circular References**: Keep data flow unidirectional
5. **Consider Query Patterns**: Design for how you'll use the data

---

## Complete Examples

### Example 1: Events, Presentations, and Presenters

This example shows a complete implementation of three related content types.

#### Schema Definition

```typescript
// lib/schemas.ts

export const PresenterSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  bio: z.string(),
  title: z.string().optional(),
  avatar: z.string().optional(),
});

export const PresentersCollectionSchema = z.object({
  presenters: z.array(PresenterSchema),
});

export const PresentationSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  presenterId: z.string(),
  eventId: z.string().optional(),
  duration: z.string(),
  sections: z.array(SectionSchema),
  meta: MetaSchema,
});

export const PresentationsCollectionSchema = z.object({
  presentations: z.array(PresentationSchema),
});

// Update EventSchema to include presentations
export const EventSchema = z.object({
  title: z.string(),
  slug: z.string(),
  date: z.string(),
  time: z.string(),
  location: z.string(),
  description: z.string(),
  presentationIds: z.array(z.string()).optional(), // NEW
  sections: z.array(SectionSchema),
  meta: MetaSchema,
});
```

#### Content Files

```json
// content/presenters.json
{
  "presenters": [
    {
      "id": "alice-johnson",
      "name": "Alice Johnson",
      "slug": "alice-johnson",
      "bio": "Lightning Network expert",
      "title": "Lightning Core Developer",
      "avatar": "/images/alice.jpg"
    }
  ]
}
```

```json
// content/presentations.json
{
  "presentations": [
    {
      "id": "intro-to-lightning",
      "title": "Introduction to Lightning Network",
      "slug": "intro-to-lightning-2025",
      "description": "Learn Lightning basics",
      "presenterId": "alice-johnson",
      "eventId": "lightning-workshop",
      "duration": "45 minutes",
      "sections": [
        {
          "title": "Overview",
          "body": "Content here..."
        }
      ],
      "meta": {
        "title": "Introduction to Lightning | Builder Vancouver",
        "description": "Learn Lightning Network basics",
        "keywords": ["lightning", "bitcoin"]
      }
    }
  ]
}
```

```json
// content/events.json (updated)
{
  "events": [
    {
      "title": "Lightning Network Workshop",
      "slug": "lightning-workshop",
      "date": "2025-12-15",
      "time": "6:00 PM - 8:30 PM",
      "location": "Bitcoin Commons, Vancouver",
      "description": "Hands-on Lightning workshop",
      "presentationIds": ["intro-to-lightning"],
      "sections": [...],
      "meta": {...}
    }
  ]
}
```

#### Usage in Component

```typescript
// app/events/[slug]/page.tsx

import { getEventWithPresentations } from "@/lib/content";
import { notFound } from "next/navigation";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const eventData = getEventWithPresentations(slug);

  if (!eventData) {
    notFound();
  }

  return (
    <div>
      <h1>{eventData.title}</h1>
      <p>{eventData.description}</p>

      {eventData.presentations && eventData.presentations.length > 0 && (
        <section>
          <h2>Presentations</h2>
          {eventData.presentations.map((presentation) => (
            <article key={presentation.id}>
              <h3>{presentation.title}</h3>
              <p>{presentation.description}</p>

              {presentation.presenter && (
                <div>
                  <p>Presented by {presentation.presenter.name}</p>
                  {presentation.presenter.title && (
                    <p>{presentation.presenter.title}</p>
                  )}
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
```

---

## Troubleshooting

### Common Issues

**Schema validation fails:**

- Check field types match Zod schema
- Ensure required fields are present
- Verify data formats (dates, URLs, etc.)

**TypeScript errors:**

- Run `npm run tsc` to see type errors
- Check imports are correct
- Ensure types are exported from `lib/types.ts`

**Content not loading:**

- Verify file name matches loader
- Check file is in `content/` directory
- Ensure JSON is valid (use `npm run validate:content`)

**Relationship data missing:**

- Verify IDs match between files
- Check helper functions are working
- Ensure related content files exist

---

## Additional Resources

- [Zod Documentation](https://zod.dev) - Schema validation library
- [Architecture Guide](./ARCHITECTURE.md) - Overall system architecture
- [Content Guide](./CONTENT-GUIDE.md) - Content authoring guide
- [Examples Directory](../examples/) - Reference implementations

---

## Questions?

For questions or clarifications:

1. Check existing schemas in `lib/schemas.ts` for patterns
2. Review this guide and architecture documentation
3. Look at examples in `/examples` directory
4. Ask in the Builder Vancouver community
