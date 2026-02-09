import { useEffect } from "react";

const BASE_TITLE = "GiveWiZe";
const DEFAULT_DESC = "Find and support causes you care about with personalized charity recommendations. Take our quiz to discover your perfect charity match.";
const DEFAULT_TITLE = `${BASE_TITLE} - Discover Charities That Match Your Values`;

function setMeta(selector: string, attr: string, value: string) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export function usePageTitle(title?: string, description?: string) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${BASE_TITLE}` : DEFAULT_TITLE;
    const desc = description || DEFAULT_DESC;

    document.title = fullTitle;
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", desc);

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('meta[name="description"]', "content", DEFAULT_DESC);
      setMeta('meta[property="og:title"]', "content", DEFAULT_TITLE);
      setMeta('meta[property="og:description"]', "content", DEFAULT_DESC);
      setMeta('meta[name="twitter:title"]', "content", DEFAULT_TITLE);
      setMeta('meta[name="twitter:description"]', "content", DEFAULT_DESC);
    };
  }, [title, description]);
}
