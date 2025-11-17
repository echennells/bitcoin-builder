import { loadEvents, loadRecaps } from "@/lib/content";
import { getSiteUrl, urls } from "@/lib/utils/urls";

import type { MetadataRoute } from "next";

/**
 * Dynamic sitemap generation for Builder Vancouver
 * Automatically includes all routes and content
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  // Load dynamic content
  const { events } = loadEvents();
  const { recaps } = loadRecaps();

  // Static pages
  const staticPages = [
    {
      url: urls.home(),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: urls.about.overview(),
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
    {
      url: urls.about.mission(),
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
    {
      url: urls.about.vision(),
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
    {
      url: urls.about.charter(),
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
    {
      url: urls.about.philosophy(),
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
    {
      url: urls.events.list(),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: urls.onboarding(),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: urls.whatToExpect(),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: urls.education.bitcoin101(),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: urls.education.lightning101(),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: urls.education.layer2(),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: urls.resources(),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: urls.recaps.list(),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: urls.projects(),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: urls.vibeApps(),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ];

  // Event pages
  const eventPages = events.map((event) => ({
    url: urls.events.detail(event.slug),
    lastModified: new Date(event.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Recap pages
  const recapPages = recaps.map((recap) => ({
    url: urls.recaps.detail(recap.slug),
    lastModified: new Date(recap.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...eventPages, ...recapPages];
}

