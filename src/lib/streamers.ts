import { getCollection, type CollectionEntry } from "astro:content";

export type Streamer = CollectionEntry<"streamers">["data"];

export async function getValidatedStreamers(): Promise<Streamer[]> {
  const entries = await getCollection("streamers");
  const slugs = new Set<string>();

  for (const entry of entries) {
    if (slugs.has(entry.data.slug)) {
      throw new Error(`配信者のslugが重複しています: ${entry.data.slug}`);
    }

    slugs.add(entry.data.slug);
  }

  for (const entry of entries) {
    if (entry.id !== entry.data.slug) {
      throw new Error(
        `配信者JSONのファイル名とslugが一致していません: ${entry.id}.json / ${entry.data.slug}`
      );
    }
  }

  return entries.map((entry) => entry.data);
}
