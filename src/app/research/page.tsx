import { PublicationsList } from "@/components/research/PublicationsList";
import { parseBibtexToPublications } from "@/lib/bibtexParser";
import { loadPublicationsBib } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export const metadata = {
  title: `研究工作 · ${siteConfig.author.displayName}`,
};

export default function ResearchPage() {
  const bib = loadPublicationsBib();
  const pubs = parseBibtexToPublications(bib);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <PublicationsList publications={pubs} authorName={siteConfig.author.name} />
    </div>
  );
}
