export type PublicationType = "journal" | "conference" | "preprint" | "other";

export interface Publication {
  key: string;
  type: PublicationType;
  title: string;
  authors: string[];
  year: number;
  journal?: string;
  booktitle?: string;
  volume?: string;
  number?: string;
  pages?: string;
  doi?: string;
  eprint?: string;
  archivePrefix?: string;
  selected?: boolean;
}

export interface ParsedBibEntry {
  key: string;
  type: string;
  fields: Record<string, string>;
}
