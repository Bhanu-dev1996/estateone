const MONTH_SUFFIX_RE = /\s\/\s*month\b/i;

/** Rental price line for cards and detail (avoids duplicate “/ month”). */
export function getRentalPriceDisplay(property) {
  const text =
    property?.monthlyRentDisplay ||
    property?.priceDisplay ||
    '';
  const showMonthSuffix =
    property?.intent === 'rent' && Boolean(text) && !MONTH_SUFFIX_RE.test(text);

  return { text, showMonthSuffix };
}