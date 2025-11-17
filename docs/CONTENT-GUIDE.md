# Content Authoring Guide

## Overview

This guide explains how to create and edit content for the Bitcoin Builder Vancouver website. Content is stored as JSON files with automatic validation to ensure quality and consistency.

## Quick Start

### Adding a New Event

1. Open `content/events.json`
2. Add your event to the `events` array:

```json
{
  "title": "Lightning Network Workshop",
  "slug": "lightning-workshop-dec-2025",
  "date": "2025-12-15",
  "time": "6:00 PM - 8:30 PM",
  "location": "Bitcoin Commons, Vancouver",
  "description": "Hands-on workshop about Lightning Network",
  "sections": [
    {
      "title": "What You'll Learn",
      "body": "Lightning fundamentals and practical setup."
    }
  ],
  "meta": {
    "title": "Lightning Workshop | Builder Vancouver",
    "description": "Learn Lightning Network basics",
    "keywords": ["lightning", "bitcoin", "workshop"]
  }
}
```

3. Validate: `npm run validate:content`
4. Test: `npm run dev`
5. Commit your changes

## Content Files

### Location

All content lives in the `/content` directory:

```
content/
├── events.json          # Upcoming events
├── recaps.json          # Past event summaries
├── bitcoin101.json      # Bitcoin educational content
├── lightning101.json    # Lightning Network content
├── layer2.json          # Layer 2 overview
├── resources.json       # Learning resources
├── projects.json        # Community projects
├── vibeapps.json        # Bitcoin apps showcase
├── onboarding.json      # New member guide
├── what-to-expect.json  # Event expectations
├── home.json            # Homepage content
├── mission.json         # Organization mission
├── vision.json          # Organization vision
├── charter.json         # Community charter
└── philosophy.json      # Community philosophy
```

### Validation

Content is automatically validated:

- **On development**: `npm run dev` validates before starting
- **Manual check**: `npm run validate:content`
- **Type check**: `npm run content:check` (validation + TypeScript)

## Schema Reference

### Common Fields

All content types share these common patterns:

#### Meta Object

Required for SEO:

```json
{
  "meta": {
    "title": "Page Title | Builder Vancouver",
    "description": "SEO description 120-160 chars",
    "keywords": ["keyword1", "keyword2"]
  }
}
```

**Best Practices:**

- Title: Include page name and site name, under 60 characters
- Description: Compelling summary, 120-160 characters
- Keywords: 3-7 relevant terms

#### Section Object

Content is organized into sections:

```json
{
  "title": "Section Heading",
  "body": "Section content. Use \\n\\n for paragraphs.",
  "links": [
    /* optional */
  ],
  "images": [
    /* optional */
  ]
}
```

#### Link Object

```json
{
  "text": "Link Text",
  "url": "https://example.com or /internal-page",
  "external": true // true for external, false for internal
}
```

#### Image Object

```json
{
  "src": "/images/filename.png",
  "alt": "Descriptive alt text for accessibility",
  "caption": "Optional caption"
}
```

### Events Schema

```json
{
  "events": [
    {
      "title": "Event Name",
      "slug": "url-friendly-slug",
      "date": "YYYY-MM-DD",
      "time": "H:MM AM/PM - H:MM AM/PM",
      "location": "Venue Name, City",
      "description": "Brief event description",
      "sections": [
        /* Section objects */
      ],
      "meta": {
        /* Meta object */
      }
    }
  ]
}
```

**Field Details:**

- `slug`: URL-safe identifier, use kebab-case (e.g., "lightning-workshop-2025")
- `date`: ISO format date (YYYY-MM-DD)
- `time`: Human-readable time range
- `location`: Full venue name and city
- `description`: 1-2 sentence summary (shows in listings)
- `sections`: Detailed event information

**Example:**

See full example in `/examples/example-content-file.json`

### Recaps Schema

```json
{
  "recaps": [
    {
      "title": "Recap Title",
      "slug": "url-friendly-slug",
      "date": "YYYY-MM-DD",
      "eventTitle": "Original Event Name",
      "summary": "Brief recap summary",
      "sections": [
        /* Section objects */
      ],
      "meta": {
        /* Meta object */
      }
    }
  ]
}
```

### Educational Content Schema

Used for Bitcoin 101, Lightning 101, Layer 2:

```json
{
  "title": "Course Title",
  "slug": "url-slug",
  "description": "Course description",
  "sections": [
    /* Section objects */
  ],
  "meta": {
    /* Meta object */
  }
}
```

### Resources Schema

```json
{
  "title": "Resources",
  "slug": "resources",
  "description": "Collection description",
  "resources": [
    {
      "title": "Resource Name",
      "url": "https://resource-url.com",
      "description": "What this resource offers",
      "category": "Category Name",
      "tags": ["tag1", "tag2"]
    }
  ],
  "meta": {
    /* Meta object */
  }
}
```

### Projects Schema

```json
{
  "title": "Projects",
  "slug": "projects",
  "description": "Projects overview",
  "projects": [
    {
      "title": "Project Name",
      "slug": "project-slug",
      "description": "Project description",
      "status": "active", // active, completed, or archived
      "links": [
        /* Link objects */
      ]
    }
  ],
  "meta": {
    /* Meta object */
  }
}
```

## Content Best Practices

### Writing Guidelines

1. **Be Clear and Concise**
   - Use simple language
   - Avoid jargon unless explained
   - Break up long paragraphs

2. **Proper Formatting**
   - Use `\n\n` for paragraph breaks
   - Keep lines under 120 characters in source
   - Use proper punctuation

3. **Accessibility**
   - Write descriptive alt text for images
   - Use clear link text (not "click here")
   - Maintain heading hierarchy

### SEO Guidelines

1. **Titles**
   - Include primary keyword
   - Keep under 60 characters
   - Format: "Page Name | Builder Vancouver"

2. **Descriptions**
   - Compelling and accurate
   - 120-160 characters optimal
   - Include call-to-action when appropriate

3. **Keywords**
   - 3-7 relevant terms
   - Focus on user intent
   - Avoid keyword stuffing

### URL Slugs

Good slugs are:

- **Descriptive**: "lightning-network-workshop"
- **Consistent**: Always use kebab-case
- **Permanent**: Don't change once published
- **Brief**: Under 50 characters when possible

Bad examples:

- ❌ "event1" - Not descriptive
- ❌ "Lightning_Network_Workshop" - Wrong case
- ❌ "super-awesome-lightning-network-workshop-december-2025" - Too long

## Workflow

### Local Development

1. **Edit content file**

   ```bash
   # Edit the file
   code content/events.json
   ```

2. **Validate changes**

   ```bash
   npm run validate:content
   ```

3. **Test locally**

   ```bash
   npm run dev
   # Visit http://localhost:3000
   ```

4. **Check types**

   ```bash
   npm run tsc
   ```

5. **Build to verify**
   ```bash
   npm run build
   ```

### Validation Errors

When validation fails, you'll see detailed error messages:

```
✗ events.json

  Validation errors:
  • events → 0 → date: Invalid date format

  Suggestions:
  💡 Use ISO date format: YYYY-MM-DD
```

Common fixes:

- **Invalid date**: Use YYYY-MM-DD format
- **Missing field**: Add all required fields
- **Wrong type**: Check string vs number vs boolean
- **Extra fields**: Remove fields not in schema

## Advanced Topics

### Multi-Paragraph Content

Use `\n\n` to create paragraph breaks:

```json
{
  "body": "First paragraph with some content.\\n\\nSecond paragraph with more details.\\n\\nThird paragraph with conclusion."
}
```

### Internal vs External Links

```json
{
  "links": [
    {
      "text": "Bitcoin.org",
      "url": "https://bitcoin.org",
      "external": true // Opens in new tab
    },
    {
      "text": "Our Events",
      "url": "/events",
      "external": false // Internal navigation
    }
  ]
}
```

### Images

Images should be placed in `/public/images/`:

```json
{
  "images": [
    {
      "src": "/images/lightning-diagram.png",
      "alt": "Lightning Network payment channel diagram showing opening, transacting, and closing phases",
      "caption": "How Lightning channels work"
    }
  ]
}
```

**Image Best Practices:**

- Optimize images (WebP format, compressed)
- Use descriptive filenames
- Write detailed alt text
- Include dimensions in filename (e.g., `hero-1200x630.webp`)

## Troubleshooting

### Content Not Showing

1. **Check validation**: `npm run validate:content`
2. **Restart dev server**: Stop and run `npm run dev` again
3. **Clear Next.js cache**: Delete `.next` folder
4. **Check slug**: Ensure slug matches URL

### Validation Passing But Page Errors

1. **Check schema**: Field might be optional but required by page
2. **Type check**: Run `npm run tsc`
3. **Check console**: Look for runtime errors in terminal

### Build Fails

1. **Validate content**: `npm run validate:content`
2. **Type check**: `npm run tsc`
3. **Check imports**: Ensure all files are properly imported
4. **Clear cache**: Delete `.next` and `node_modules`, reinstall

## Content Guidelines

### Voice and Tone

- **Educational**: Focus on teaching and learning
- **Welcoming**: Inclusive and beginner-friendly
- **Technical but accessible**: Explain complexity clearly
- **Community-focused**: Emphasize collaboration

### Sensitive Topics

When discussing:

- **Price/investment**: Focus on technology, not speculation
- **Regulations**: Present facts, not opinions
- **Controversies**: Remain neutral and factual

## Resources

- [Example Content File](/examples/example-content-file.json)
- [Architecture Documentation](/docs/ARCHITECTURE.md)
- [JSON Validator](https://jsonlint.com/) - Validate JSON syntax
- [Zod Documentation](https://zod.dev) - Schema validation

## Getting Help

If you're stuck:

1. Check `/examples` directory for reference
2. Review existing content files for patterns
3. Run validation for detailed error messages
4. Consult this guide and architecture docs
5. Ask in the Builder Vancouver community

## Content Checklist

Before committing:

- [ ] Content validates: `npm run validate:content`
- [ ] Types check: `npm run tsc`
- [ ] Tested locally: `npm run dev`
- [ ] Builds successfully: `npm run build`
- [ ] Meta fields complete (title, description, keywords)
- [ ] Slugs are unique and descriptive
- [ ] Links tested (internal and external)
- [ ] Images optimized and have alt text
- [ ] No spelling or grammar errors
- [ ] Follows voice and tone guidelines

## Future Improvements

Potential enhancements to content system:

1. **Visual editor**: GUI for non-technical editors
2. **Content preview**: See changes before committing
3. **Workflow automation**: Automated testing and deployment
4. **Content scheduling**: Publish dates for events
5. **Media library**: Centralized image management

---

Happy content authoring! 🚀
