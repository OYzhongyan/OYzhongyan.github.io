import { Profile } from "@/components/home/Profile";
import { About } from "@/components/home/About";
import { News } from "@/components/home/News";
import { SelectedPublications } from "@/components/home/SelectedPublications";
import { loadAbout, loadNews } from "@/lib/content";
import { parseBibtexToPublications } from "@/lib/bibtexParser";
import { loadPublicationsBib } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export default function HomePage() {
  const about = loadAbout();
  const news = loadNews();
  const bib = loadPublicationsBib();
  const pubs = parseBibtexToPublications(bib);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-1">
          <Profile />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <About content={about} />
          <SelectedPublications
            publications={pubs}
            authorName={siteConfig.author.name}
          />
          <News items={news} />
        </div>
      </div>
    </div>
  );
}
