# Example Files

This directory contains annotated example files demonstrating best practices for the Bitcoin Builder Vancouver codebase.

## Files

### `example-page-with-seo.tsx`
Complete page component implementation showing:
- Next.js metadata generation
- Schema.org structured data (JSON-LD)
- Breadcrumb navigation
- Type-safe content loading
- URL builder usage
- Proper component structure

**Use this as a template** when creating new static pages.

### `example-dynamic-route.tsx`
Dynamic route handling with [slug] parameters:
- Async params handling (Next.js 15+ requirement)
- 404 error handling with `notFound()`
- Static path generation for SSG
- Dynamic metadata generation
- Type-safe props interface

**Use this as a template** when creating new dynamic routes.

### `example-content-file.json`
Annotated JSON content file showing:
- All available schema fields
- Proper formatting and structure
- Comments explaining each field
- Examples of sections, links, images, and metadata

**Use this as a reference** when creating or editing content files.

## How to Use These Examples

### For Developers

1. **Creating a New Page**: Copy `example-page-with-seo.tsx` and adapt it to your needs
2. **Creating a Dynamic Route**: Copy `example-dynamic-route.tsx` for [slug] routes
3. **Understanding Content Structure**: Refer to `example-content-file.json`

### For AI Agents

These examples serve as reference implementations. When asked to:

- **Create a page**: Use `example-page-with-seo.tsx` as the baseline pattern
- **Add a dynamic route**: Follow patterns in `example-dynamic-route.tsx`
- **Structure content**: Match the format in `example-content-file.json`

## Key Principles

All examples follow these core principles:

1. **Named Exports**: Always use named exports, never default exports
2. **Type Safety**: Use TypeScript types from `@/lib/types`
3. **URL Builders**: Never hardcode URLs, use `@/lib/utils/urls`
4. **Content Loaders**: Use type-safe loaders from `@/lib/content`
5. **SEO First**: Every page needs metadata and structured data
6. **Semantic HTML**: Proper heading hierarchy (H1 → H2 → H3)
7. **Async Params**: Always await params in Next.js 15+

## Common Patterns

### Loading Content
```typescript
// Static content
const content = loadBitcoin101();

// Collection
const { events } = loadEvents();

// Single item from collection
const event = loadEvent(slug);
```

### Generating URLs
```typescript
// For structured data (full URLs)
urls.events.list()       // "https://builder.van/events"
urls.events.detail(slug) // "https://builder.van/events/lightning-workshop"

// For Next.js Link (paths only)
paths.events.list()       // "/events"
paths.events.detail(slug) // "/events/lightning-workshop"
```

### Creating Structured Data
```typescript
// Choose appropriate schema type
const eventSchema = createEventSchema(event);
const articleSchema = createArticleSchema(recap);
const courseSchema = createCourseSchema(course);

// Add breadcrumbs
const breadcrumbs = createBreadcrumbList([
  { name: "Home", url: urls.home() },
  { name: "Events", url: urls.events.list() },
  { name: "Current Page" },
]);

// Combine into graph
const structuredData = createSchemaGraph(eventSchema, breadcrumbs);
```

## Testing Your Implementation

After creating a new page based on these examples:

1. **Run type check**: `npm run tsc`
2. **Validate content**: `npm run validate:content`
3. **Build the site**: `npm run build`
4. **Check in browser**: Test all links and functionality
5. **Verify SEO**: Check JSON-LD in page source

## Additional Resources

- `/docs/ARCHITECTURE.md` - Overall architecture documentation
- `/docs/CONTENT-GUIDE.md` - Content authoring guide
- `/lib/schemas.ts` - Zod schema definitions
- `/lib/types.ts` - TypeScript type definitions

## Questions?

If these examples don't cover your use case, refer to existing page implementations in `/app` or consult the architecture documentation.

