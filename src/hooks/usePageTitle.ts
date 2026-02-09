import { useEffect } from "react";

const BASE_TITLE = "GiveWiZe";

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : `${BASE_TITLE} - Discover Charities That Match Your Values`;
    return () => {
      document.title = `${BASE_TITLE} - Discover Charities That Match Your Values`;
    };
  }, [title]);
}
