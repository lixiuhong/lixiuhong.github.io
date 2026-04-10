import type { Profile, Publication, Talk } from "./sanity.types";
import profileData from "@/data/profile.json";
import publicationsData from "@/data/publications.json";
import talksData from "@/data/talks.json";

export async function getProfile(): Promise<Profile | null> {
  return profileData as Profile;
}

export async function getPublications(): Promise<Publication[]> {
  return publicationsData as Publication[];
}

export async function getTalks(): Promise<Talk[]> {
  return talksData as Talk[];
}
