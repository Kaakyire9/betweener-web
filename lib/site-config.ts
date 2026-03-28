export const siteConfig = {
  name: "Betweener",
  shortName: "Betweener",
  domain: "getbetweener.com",
  url: "https://getbetweener.com",
  description:
    "A premium intentional dating app designed around trust, chemistry, deeper context, and real-world momentum.",
  tagline: "Intentional dating, composed for trust and real-world follow-through.",
  locale: "en_GB",
  contact: {
    supportEmail: "support@getbetweener.com",
    privacyEmail: "privacy@getbetweener.com",
    legalEmail: "legal@getbetweener.com",
    partnershipsEmail: "hello@getbetweener.com",
    supportHours: "Monday to Friday, 09:00 to 18:00 GMT",
    responseWindow: "Most support requests receive a response within 2 business days."
  },
  stores: {
    appStore: "https://apps.apple.com/app/idREPLACE_WITH_APP_STORE_ID",
    playStore: "https://play.google.com/store/apps/details?id=REPLACE_WITH_ANDROID_PACKAGE"
  },
  deepLinks: {
    scheme: "betweener://",
    universal: "https://getbetweener.com/open"
  },
  legal: {
    entityName: "Nyansapa Ltd",
    effectiveDate: "March 25, 2026",
    address: "428B Soundwell Road, Bristol, UK",
    jurisdiction: "England and Wales"
  },
  social: {
    instagram: "https://instagram.com/betweenerapp"
  },
  navigation: [
    { href: "/#story", label: "Story" },
    { href: "/#trust", label: "Trust" },
    { href: "/privacy", label: "Privacy" },
    { href: "/support", label: "Support" }
  ],
  footerNavigation: [
    { href: "/", label: "Home" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/support", label: "Support" },
    { href: "/delete-account", label: "Delete Account" },
    { href: "/safety", label: "Safety" },
    { href: "/contact", label: "Contact" }
  ]
} as const;