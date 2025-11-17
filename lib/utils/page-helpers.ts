/**
 * Page Helper Utilities
 * Reduce boilerplate in page components with reusable patterns
 */

import type { Metadata } from "next";
import {
  generateMetadata as generateMeta,
  createBreadcrumbList,
  createCollectionPageSchema,
  createSchemaGraph,
} from "../seo";
import { urls } from "./urls";
import { BreadcrumbListInput } from "../structured-data";

/**
 * Configuration for creating a standard collection page
 */
export interface CollectionPageConfig {
  /** Collection title */
  title: string;
  /** Page description */
  description: string;
  /** SEO keywords */
  keywords: string[];
  /** URL path for the collection page */
  path: string;
  /** Items in the collection */
  items: Array<{
    /** Item name */
    name: string;
    /** Item URL */
    url: string;
    /** Optional item description */
    description?: string;
  }>;
  /** Optional breadcrumb override (defaults to Home → Collection) */
  breadcrumbs?: BreadcrumbListInput;
}

/**
 * Creates complete metadata and structured data for a collection page
 * Reduces boilerplate for events, recaps, resources, etc.
 *
 * @param config - Collection page configuration
 * @returns Object with metadata and structuredData for the page
 *
 * @example
 * const { metadata, structuredData } = createCollectionPage({
 *   title: "Events | Builder Vancouver",
 *   description: "Upcoming Bitcoin meetups",
 *   keywords: ["events", "bitcoin", "vancouver"],
 *   path: urls.events.list(),
 *   items: events.map(e => ({
 *     name: e.title,
 *     url: urls.events.detail(e.slug),
 *     description: e.description,
 *   })),
 * });
 *
 * // In your page component:
 * export const metadata = collectionPage.metadata;
 * return <><JsonLd data={collectionPage.structuredData} />...</>
 */
export function createCollectionPage(config: CollectionPageConfig) {
  // Generate metadata
  const metadata: Metadata = generateMeta({
    title: config.title,
    description: config.description,
    keywords: config.keywords,
  });

  // Create structured data
  const collectionSchema = createCollectionPageSchema(
    config.path,
    config.title,
    config.description,
    config.items
  );

  // Default breadcrumbs if not provided
  const breadcrumbSchema = createBreadcrumbList(
    config.breadcrumbs || [
      { name: "Home", url: urls.home() },
      { name: config.title },
    ]
  );

  const structuredData = createSchemaGraph(collectionSchema, breadcrumbSchema);

  return {
    metadata,
    structuredData,
  };
}

/**
 * Configuration for creating a standard detail/dynamic page
 */
export interface DetailPageConfig {
  /** Page title */
  title: string;
  /** Page description */
  description: string;
  /** SEO keywords */
  keywords?: string[];
  /** Current page URL */
  currentUrl: string;
  /** Parent collection name */
  parentName: string;
  /** Parent collection URL */
  parentUrl: string;
  /** Optional additional breadcrumb items */
  additionalBreadcrumbs?: Array<{ name: string; url: string }>;
}

/**
 * Creates metadata and breadcrumbs for a detail page
 * Reduces boilerplate for [slug] routes
 *
 * @param config - Detail page configuration
 * @returns Object with metadata and breadcrumbs
 *
 * @example
 * const { metadata, breadcrumbs } = createDetailPage({
 *   title: event.title,
 *   description: event.description,
 *   keywords: ["event", "bitcoin", "workshop"],
 *   currentUrl: urls.events.detail(event.slug),
 *   parentName: "Events",
 *   parentUrl: urls.events.list(),
 * });
 */
export function createDetailPage(config: DetailPageConfig) {
  // Generate metadata
  const metadata: Metadata = generateMeta({
    title: config.title,
    description: config.description,
    keywords: config.keywords,
  });

  // Build breadcrumb list
  const breadcrumbItems: BreadcrumbListInput = [
    { name: "Home", url: urls.home() },
  ];

  // Add any additional breadcrumbs
  if (config.additionalBreadcrumbs) {
    breadcrumbItems.push(...config.additionalBreadcrumbs);
  }

  // Add parent
  breadcrumbItems.push({
    name: config.parentName,
    url: config.parentUrl,
  });

  // Add current page (no URL)
  breadcrumbItems.push({ name: config.title });

  const breadcrumbs = createBreadcrumbList(breadcrumbItems);

  return {
    metadata,
    breadcrumbs,
  };
}

/**
 * Configuration for a static content page
 */
export interface StaticPageConfig {
  /** Page title */
  title: string;
  /** Page description */
  description: string;
  /** SEO keywords */
  keywords?: string[];
  /** Optional breadcrumb parent */
  parent?: {
    name: string;
    url: string;
  };
}

/**
 * Creates metadata and breadcrumbs for a static page
 * Reduces boilerplate for simple content pages
 *
 * @param config - Static page configuration
 * @returns Object with metadata and breadcrumbs
 *
 * @example
 * const { metadata, breadcrumbs } = createStaticPage({
 *   title: "About Us | Builder Vancouver",
 *   description: "Learn about Builder Vancouver",
 *   keywords: ["about", "mission", "community"],
 *   parent: {
 *     name: "Home",
 *     url: urls.home(),
 *   },
 * });
 */
export function createStaticPage(config: StaticPageConfig) {
  // Generate metadata
  const metadata: Metadata = generateMeta({
    title: config.title,
    description: config.description,
    keywords: config.keywords,
  });

  // Build breadcrumb list
  const breadcrumbItems: BreadcrumbListInput = [
    { name: "Home", url: urls.home() },
  ];

  if (config.parent) {
    breadcrumbItems.push(config.parent);
  }

  breadcrumbItems.push({ name: config.title });

  const breadcrumbs = createBreadcrumbList(breadcrumbItems);

  return {
    metadata,
    breadcrumbs,
  };
}

/**
 * Helper to extract items from a collection for the page helper
 *
 * @example
 * const items = mapCollectionItems(
 *   events.events,
 *   (event) => ({
 *     name: event.title,
 *     url: urls.events.detail(event.slug),
 *     description: event.description,
 *   })
 * );
 */
export function mapCollectionItems<T>(
  collection: T[],
  mapper: (item: T) => { name: string; url: string; description?: string }
): Array<{ name: string; url: string; description?: string }> {
  return collection.map(mapper);
}

