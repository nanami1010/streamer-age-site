export interface ProfileImageData {
  src: string;
  alt: string;
  sourceUrl: string;
  permissionStatus: "confirmed" | "unconfirmed" | "not-permitted";
  permissionNote: string;
  credit?: string | null;
  lastVerifiedAt: string;
}

export function getDisplayProfileImage(
  image: ProfileImageData | null
): ProfileImageData | null {
  return image?.permissionStatus === "confirmed" ? image : null;
}
