import { calculateAge } from "../utils/age";

export function updateDisplayedAges(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("[data-birth]").forEach((element) => {
    const age = calculateAge(element.dataset.birth ?? null);
    element.textContent = age === null ? "非公開" : `${age}歳`;
  });
}
