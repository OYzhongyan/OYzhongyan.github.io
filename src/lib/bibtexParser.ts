import type { ParsedBibEntry, Publication, PublicationType } from "@/types/publication";

/**
 * Lightweight BibTeX parser: handles @type{key, fields} structure with nested braces.
 */
export function parseBibtex(bib: string): ParsedBibEntry[] {
  const entries: ParsedBibEntry[] = [];
  let i = 0;
  const n = bib.length;

  while (i < n) {
    // Find next @
    const at = bib.indexOf("@", i);
    if (at < 0) break;
    i = at + 1;

    // Read type (until {)
    const braceOpen = bib.indexOf("{", i);
    if (braceOpen < 0) break;
    const type = bib.slice(i, braceOpen).trim().toLowerCase();

    // Read key (until ,)
    let j = braceOpen + 1;
    const comma = bib.indexOf(",", j);
    if (comma < 0) break;
    const key = bib.slice(j, comma).trim();
    j = comma + 1;

    // Find matching closing brace (handle nesting)
    let depth = 1;
    let k = j;
    while (k < n && depth > 0) {
      const c = bib[k];
      if (c === "{") depth++;
      else if (c === "}") depth--;
      if (depth === 0) break;
      k++;
    }
    if (k >= n) break;
    const body = bib.slice(j, k);

    // Parse fields
    const fields = parseFields(body);
    entries.push({ key, type, fields });

    i = k + 1;
  }

  return entries;
}

function parseFields(body: string): Record<string, string> {
  const fields: Record<string, string> = {};
  let i = 0;
  const n = body.length;

  while (i < n) {
    // Skip whitespace and commas
    while (i < n && /[\s,]/.test(body[i])) i++;
    if (i >= n) break;

    // Read field name
    const nameStart = i;
    while (i < n && /[\w-]/.test(body[i])) i++;
    const name = body.slice(nameStart, i).toLowerCase();
    if (!name) break;

    // Skip whitespace and =
    while (i < n && /[\s=]/.test(body[i])) i++;
    if (i >= n) break;

    // Read value
    const { value, end } = readValue(body, i);
    if (name) fields[name] = value;
    i = end;
  }

  return fields;
}

function readValue(s: string, start: number): { value: string; end: number } {
  const n = s.length;
  let i = start;
  if (i >= n) return { value: "", end: i };

  // Brace-wrapped
  if (s[i] === "{") {
    let depth = 1;
    let j = i + 1;
    const inner: string[] = [];
    while (j < n && depth > 0) {
      const c = s[j];
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) break;
      }
      inner.push(c);
      j++;
    }
    return { value: inner.join("").trim(), end: j + 1 };
  }

  // Quote-wrapped
  if (s[i] === '"') {
    let j = i + 1;
    const inner: string[] = [];
    while (j < n && s[j] !== '"') {
      inner.push(s[j]);
      j++;
    }
    return { value: inner.join("").trim(), end: j + 1 };
  }

  // Bare value (until comma)
  let j = i;
  while (j < n && s[j] !== ",") j++;
  return { value: s.slice(i, j).trim(), end: j };
}

function mapType(bibType: string): PublicationType {
  switch (bibType.toLowerCase()) {
    case "article":
      return "journal";
    case "inproceedings":
    case "conference":
      return "conference";
    case "misc":
    case "unpublished":
    case "techreport":
      return "preprint";
    default:
      return "other";
  }
}

export function toPublication(entry: ParsedBibEntry): Publication {
  const f = entry.fields;
  const authors = (f.author || "")
    .split(/\s+and\s+/)
    .map((a) => a.trim())
    .filter(Boolean);

  // Handle LaTeX escaping: remove backslash before commands, simplify {X} to X
  const cleanTitle = (f.title || "Untitled")
    .replace(/\\\w+\{(.*?)\}/g, "$1")
    .replace(/\\\W/g, "")
    .replace(/\{([^{}]*)\}/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  return {
    key: entry.key,
    type: f.type ? (f.type as PublicationType) : mapType(entry.type),
    title: cleanTitle,
    authors,
    year: Number(f.year) || 0,
    journal: f.journal,
    booktitle: f.booktitle,
    volume: f.volume,
    number: f.number,
    pages: f.pages,
    doi: f.doi,
    eprint: f.eprint,
    archivePrefix: f.archiveprefix,
    selected: f.selected === "true",
  };
}

export function parseBibtexToPublications(bib: string): Publication[] {
  return parseBibtex(bib).map(toPublication);
}
