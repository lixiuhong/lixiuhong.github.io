import type { Profile } from "@/lib/sanity.types";

const PLATFORM_ICONS: Record<string, string> = {
  Email: "✉",
  Twitter: "𝕏",
  Facebook: "f",
  LinkedIn: "in",
  GitHub: "⌨",
  YouTube: "▶",
  "Google Scholar": "🎓",
  ORCID: "iD",
};

export default function ProfileSidebar({ profile }: { profile: Profile }) {
  return (
    <aside className="w-full md:w-[280px] flex-shrink-0">
      <div className="text-center md:text-left">
        {profile.photoUrl && (
          <img
            src={profile.photoUrl}
            alt={profile.name}
            className="w-40 h-40 rounded-full mx-auto md:mx-0 object-cover"
          />
        )}
        <h3 className="mt-4 text-xl font-bold">{profile.name}</h3>
        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
          {profile.title}
        </p>
        {profile.location && (
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
            📍 {profile.location}
          </p>
        )}

        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <div className="mt-4 space-y-1">
            {profile.socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent-dark no-underline hover:no-underline"
              >
                <span className="w-5 text-center text-xs">
                  {PLATFORM_ICONS[link.platform] || "🔗"}
                </span>
                {link.platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
