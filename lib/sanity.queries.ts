import { client } from "./sanity.client";
import type { Profile, Publication, Talk } from "./sanity.types";

export async function getProfile(): Promise<Profile> {
  return client.fetch(
    `*[_type == "profile"][0]{
      _id,
      name,
      title,
      location,
      bio,
      photo{
        asset->{_ref, url}
      },
      socialLinks[]{platform, url},
      researchInterests[]{title, description},
      awards[]{date, description},
      news[]{date, text},
      cvFile{
        asset->{url}
      }
    }`
  );
}

export async function getPublications(): Promise<Publication[]> {
  return client.fetch(
    `*[_type == "publication"] | order(year desc, date desc){
      _id,
      title,
      authors,
      venue,
      year,
      date,
      type,
      abstract,
      pdfUrl,
      externalUrl,
      codeUrl,
      slidesUrl,
      scholarUrl
    }`
  );
}

export async function getTalks(): Promise<Talk[]> {
  return client.fetch(
    `*[_type == "talk"] | order(date desc){
      _id,
      title,
      event,
      date,
      location,
      type,
      description,
      slidesUrl,
      videoUrl,
      eventUrl
    }`
  );
}
