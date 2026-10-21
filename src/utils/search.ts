export interface SearchableStreamer {
  name: string;
  nameKana: string;
  aliases: string[];
}

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("ja-JP")
    .replace(/[ァ-ヶ]/g, (character) =>
      String.fromCharCode(character.charCodeAt(0) - 0x60)
    )
    .replace(/\s+/g, "");
}

export function createStreamerSearchIndex(streamer: SearchableStreamer): string {
  return normalizeSearchText([
    streamer.name,
    streamer.nameKana,
    ...streamer.aliases
  ].join("|"));
}

export function matchesStreamer(searchIndex: string, query: string): boolean {
  const normalizedQuery = normalizeSearchText(query);
  return normalizedQuery === "" || searchIndex.includes(normalizedQuery);
}
