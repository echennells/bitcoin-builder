/**
 * Structured Error System
 * Type-safe error classes with actionable error messages and suggestions
 */

import { z } from "zod";

/**
 * Error codes for content-related errors
 */
export enum ContentErrorCode {
  FILE_NOT_FOUND = "CONTENT_FILE_NOT_FOUND",
  VALIDATION_ERROR = "CONTENT_VALIDATION_ERROR",
  PARSE_ERROR = "CONTENT_PARSE_ERROR",
  UNKNOWN_ERROR = "CONTENT_UNKNOWN_ERROR",
}

/**
 * Base content error with structured information
 */
export class ContentError extends Error {
  constructor(
    public code: ContentErrorCode,
    public filename: string,
    message: string,
    public suggestions: string[] = []
  ) {
    super(message);
    this.name = "ContentError";
  }
}

/**
 * Error thrown when content file cannot be found
 */
export class ContentNotFoundError extends ContentError {
  constructor(filename: string) {
    super(
      ContentErrorCode.FILE_NOT_FOUND,
      filename,
      `Content file not found: ${filename}`,
      [
        `Check that ${filename} exists in the content/ directory`,
        "Verify the filename spelling and extension",
        "Run 'npm run validate:content' to check all content files",
      ]
    );
    this.name = "ContentNotFoundError";
  }
}

/**
 * Error thrown when content fails Zod validation
 */
export class ContentValidationError extends ContentError {
  constructor(
    filename: string,
    public zodError: z.ZodError,
    suggestions: string[] = []
  ) {
    const errorDetails = zodError.errors
      .map((err) => {
        const path = err.path.length > 0 ? err.path.join(" → ") : "root";
        return `  • ${path}: ${err.message}`;
      })
      .join("\n");

    super(
      ContentErrorCode.VALIDATION_ERROR,
      filename,
      `Validation error in ${filename}:\n${errorDetails}`,
      suggestions.length > 0 ? suggestions : ContentValidationError.generateSuggestions(zodError)
    );
    this.name = "ContentValidationError";
  }

  /**
   * Generates helpful suggestions based on Zod error types
   */
  static generateSuggestions(error: z.ZodError): string[] {
    const suggestions: string[] = [];
    const seenSuggestions = new Set<string>();

    for (const err of error.errors) {
      let suggestion: string | null = null;

      switch (err.code) {
        case "invalid_type":
          if (err.expected === "string" && err.received === "number") {
            suggestion = `Wrap numeric values in quotes to convert to strings`;
          } else {
            suggestion = `Check data type: expected ${err.expected}, got ${err.received}`;
          }
          break;

        case "invalid_string":
          suggestion = "Ensure all string values are properly formatted and escaped";
          break;

        case "invalid_date":
          suggestion = "Use ISO 8601 date format: YYYY-MM-DD";
          break;

        case "too_small":
          if (err.type === "string") {
            suggestion = `String must be at least ${err.minimum} characters long`;
          } else if (err.type === "array") {
            suggestion = `Array must contain at least ${err.minimum} item(s)`;
          }
          break;

        case "too_big":
          if (err.type === "string") {
            suggestion = `String must be at most ${err.maximum} characters long`;
          } else if (err.type === "array") {
            suggestion = `Array must contain at most ${err.maximum} item(s)`;
          }
          break;

        case "invalid_union":
          suggestion = "Value doesn't match any of the allowed formats - check the schema";
          break;

        case "unrecognized_keys":
          suggestion = "Remove unexpected fields or check for typos in field names";
          break;

        case "invalid_literal":
          suggestion = `Value must be exactly: ${err.expected}`;
          break;

        default:
          suggestion = "Check the content against the schema definition";
      }

      if (suggestion && !seenSuggestions.has(suggestion)) {
        suggestions.push(suggestion);
        seenSuggestions.add(suggestion);
      }
    }

    if (suggestions.length === 0) {
      suggestions.push(
        "Review the schema in lib/schemas.ts",
        "Check examples/ directory for reference implementations",
        "Run 'npm run validate:content' for detailed error output"
      );
    }

    return suggestions;
  }
}

/**
 * Error thrown when JSON parsing fails
 */
export class ContentParseError extends ContentError {
  constructor(filename: string, parseError: Error) {
    super(
      ContentErrorCode.PARSE_ERROR,
      filename,
      `Failed to parse JSON in ${filename}: ${parseError.message}`,
      [
        "Check for syntax errors in the JSON file",
        "Ensure all strings are properly quoted",
        "Verify no trailing commas in arrays or objects",
        "Use a JSON validator: https://jsonlint.com/",
      ]
    );
    this.name = "ContentParseError";
  }
}

/**
 * Helper function to create appropriate content error from an exception
 */
export function createContentError(
  filename: string,
  error: unknown
): ContentError {
  if (error instanceof z.ZodError) {
    return new ContentValidationError(filename, error);
  }

  if (error instanceof SyntaxError) {
    return new ContentParseError(filename, error);
  }

  if ((error as NodeJS.ErrnoException).code === "ENOENT") {
    return new ContentNotFoundError(filename);
  }

  if (error instanceof ContentError) {
    return error;
  }

  // Unknown error
  return new ContentError(
    ContentErrorCode.UNKNOWN_ERROR,
    filename,
    error instanceof Error ? error.message : String(error),
    [
      "Check the terminal output for more details",
      "Ensure the file is accessible and not corrupted",
      "Try running 'npm run validate:content'",
    ]
  );
}

/**
 * Format a content error for console output
 */
export function formatContentError(error: ContentError): string {
  const lines: string[] = [
    `❌ ${error.name}`,
    `   File: ${error.filename}`,
    `   Code: ${error.code}`,
    "",
    `   ${error.message}`,
  ];

  if (error.suggestions.length > 0) {
    lines.push("", "   💡 Suggestions:");
    error.suggestions.forEach((suggestion) => {
      lines.push(`      • ${suggestion}`);
    });
  }

  return lines.join("\n");
}

