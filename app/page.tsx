import { getProfile } from "@/lib/sanity.queries";

export default async function HomePage() {
  const profile = await getProfile();

  if (!profile) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-8">
        <p>No profile data found. Please add data to data/profile.json.</p>
      </div>
    );
  }

  return (
    <>
      {/* Gradient Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-600 to-indigo-400 dark:from-indigo-950 dark:via-indigo-800 dark:to-indigo-600">
        <div className="max-w-[960px] mx-auto px-6 py-10 flex gap-6 items-center">
          {profile.photoUrl && (
            <img
              src={profile.photoUrl}
              alt={profile.name}
              className="w-28 h-28 rounded-full object-cover border-[3px] border-white/30 flex-shrink-0"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
            <p className="text-sm text-white/80 mt-1">{profile.title}</p>
            {profile.location && (
              <p className="text-xs text-white/60 mt-1">{profile.location}</p>
            )}
            {profile.socialLinks && profile.socialLinks.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {profile.socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white bg-white/15 px-3 py-1 rounded-full no-underline hover:no-underline hover:bg-white/25 transition-colors"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[960px] mx-auto px-6 py-8">
        {profile.cvUrl && (
          <a
            href={profile.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-accent text-white px-5 py-2 rounded-lg mb-8 text-sm no-underline hover:no-underline hover:bg-accent/90 transition-colors"
          >
            Download CV (PDF)
          </a>
        )}

        {profile.bio && (
          <section className="mb-8">
            <h2 className="text-base font-semibold text-accent dark:text-accent-dark mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-accent to-accent-lighter rounded-full" />
              About
            </h2>
            <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
              {profile.bio}
            </p>
          </section>
        )}

        {profile.news && profile.news.length > 0 && (
          <section className="mb-8">
            <h2 className="text-base font-semibold text-accent dark:text-accent-dark mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-accent to-accent-lighter rounded-full" />
              News
            </h2>
            <div className="space-y-2">
              {profile.news.map((item, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-gray-400 dark:text-slate-500 w-20 flex-shrink-0">{item.date}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {profile.researchInterests && profile.researchInterests.length > 0 && (
          <section className="mb-8">
            <h2 className="text-base font-semibold text-accent dark:text-accent-dark mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-accent to-accent-lighter rounded-full" />
              Research Interests
            </h2>
            <div className="space-y-1">
              {profile.researchInterests.map((interest, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2 border-b border-gray-100 dark:border-slate-800 last:border-b-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-light dark:bg-accent-dark mt-1.5 flex-shrink-0" />
                  <p className="text-sm">
                    <strong className="text-gray-900 dark:text-slate-200">{interest.title}: </strong>
                    <span className="text-gray-600 dark:text-slate-400">{interest.description}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {profile.awards && profile.awards.length > 0 && (
          <section>
            <h2 className="text-base font-semibold text-accent dark:text-accent-dark mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-accent to-accent-lighter rounded-full" />
              Awards
            </h2>
            <div className="space-y-2">
              {profile.awards.map((award, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-gray-400 dark:text-slate-500 w-20 flex-shrink-0">{award.date}</span>
                  <span>{award.description}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
