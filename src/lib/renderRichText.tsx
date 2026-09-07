import React from "react";

/**
 * Parses lightweight inline markdown formatting:
 * - **bold text** -> <strong className="font-bold">bold text</strong>
 * - *italic text* -> <em className="italic">italic text</em>
 * - [link label](url) -> <a href="url" ...>link label</a>
 */
export function renderRichText(
  text: string,
  options?: {
    linkColorClass?: string;
  }
): React.ReactNode {
  if (!text) return "";

  const linkClass =
    options?.linkColorClass ||
    "text-orange-600 hover:text-orange-700 underline font-medium transition";

  // Regex pattern matching:
  // 1. **bold**
  // 2. *italic*
  // 3. [link text](url)
  const pattern = /(\*\*[\s\S]+?\*\*|\*[^*]+?\*|\[[^\]]+\]\([^\s)]+\))/g;
  const parts = text.split(pattern);

  if (parts.length === 1) {
    return text;
  }

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold: **text**
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      const content = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-navy-950">
          {content}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      const content = part.slice(1, -1);
      return (
        <em key={index} className="italic">
          {content}
        </em>
      );
    }

    // Link: [label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      const isInternal = url.startsWith("/");
      return (
        <a
          key={index}
          href={url}
          target={isInternal ? undefined : "_blank"}
          rel={isInternal ? undefined : "noopener noreferrer"}
          className={linkClass}
        >
          {label}
        </a>
      );
    }

    // Normal text
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
