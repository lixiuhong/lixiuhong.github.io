import ProfileSidebar from "@/components/ProfileSidebar";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import { getProfile } from "@/lib/sanity.queries";

export default async function HomePage() {
  const profile = await getProfile();

  if (!profile) {
    return <p>No profile data found. Please add a profile in Sanity Studio.</p>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12">
      <ProfileSidebar profile={profile} />

      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold mb-6">About</h1>

        {profile.cvFile?.asset?.url && (
          <a
            href={profile.cvFile.asset.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-accent text-white px-5 py-2.5 rounded mb-6 no-underline hover:no-underline hover:bg-accent/90 transition-colors"
          >
            📄 Download CV (PDF)
          </a>
        )}

        {profile.bio && (
          <div className="prose dark:prose-invert max-w-none mb-8">
            <PortableTextRenderer value={profile.bio} />
          </div>
        )}

        {profile.researchInterests && profile.researchInterests.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Research Interests</h2>
            <ul className="space-y-2">
              {profile.researchInterests.map((interest, i) => (
                <li key={i} className="pl-4 border-l-2 border-gray-200 dark:border-slate-700">
                  <span className="font-semibold">{interest.title}:</span>{" "}
                  <span className="text-gray-600 dark:text-slate-400">
                    {interest.description}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {profile.awards && profile.awards.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Awards</h2>
            <ul className="space-y-2">
              {profile.awards.map((award, i) => (
                <li key={i}>
                  <span className="text-sm text-gray-500 dark:text-slate-500 mr-2">
                    {award.date}
                  </span>
                  {award.description}
                </li>
              ))}
            </ul>
          </section>
        )}

        {profile.news && profile.news.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">News</h2>
            <ul className="space-y-3">
              {profile.news.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-sm text-gray-500 dark:text-slate-500 flex-shrink-0 w-24">
                    {item.date}
                  </span>
                  <div className="prose dark:prose-invert prose-sm max-w-none">
                    <PortableTextRenderer value={item.text} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
