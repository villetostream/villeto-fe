export const ISO3_TO_COUNTRY_NAME: Record<string, string> = {
  NGA: "Nigeria",
  GHA: "Ghana",
  KEN: "Kenya",
  ZAF: "South Africa",
};

export function getCountryName(code: string): string {
  return ISO3_TO_COUNTRY_NAME[code] ?? code;
}
