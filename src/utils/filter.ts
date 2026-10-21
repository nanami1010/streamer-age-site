export type AgeFilter =
  | ""
  | "under-20"
  | "20-24"
  | "25-29"
  | "30-34"
  | "35-39"
  | "40-and-over"
  | "unknown";

export function matchesGenre(
  genres: readonly string[],
  selectedGenre: string
): boolean {
  return selectedGenre === "" || genres.includes(selectedGenre);
}

export function matchesAgeFilter(
  age: number | null,
  selectedAge: string
): boolean {
  switch (selectedAge as AgeFilter) {
    case "":
      return true;
    case "under-20":
      return age !== null && age <= 19;
    case "20-24":
      return age !== null && age >= 20 && age <= 24;
    case "25-29":
      return age !== null && age >= 25 && age <= 29;
    case "30-34":
      return age !== null && age >= 30 && age <= 34;
    case "35-39":
      return age !== null && age >= 35 && age <= 39;
    case "40-and-over":
      return age !== null && age >= 40;
    case "unknown":
      return age === null;
    default:
      return false;
  }
}
