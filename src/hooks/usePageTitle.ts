import { useEffect } from "react";

const BASE_TITLE = "GiveWiZe";
const DEFAULT_DESC = "Find and support causes you care about with personalized charity recommendations. Take our quiz to discover your perfect charity match.";

export function usePageTitle(title?: string, description?: string) {
  useEffect(() => {
    document.title = title
      ? `${title} | ${BASE_TITLE}`
      : `${BASE_TITLE} - Discover Charities That Match Your Values`;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", description || DEFAULT_DESC);
    }

    return () => {
      document.title = `${BASE_TITLE} - Discover Charities That Match Your Values`;
      if (meta) meta.setAttribute("content", DEFAULT_DESC);
    };
  }, [title, description]);
}
