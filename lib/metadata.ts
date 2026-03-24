import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

type MetadataInput = {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  keywords = [],
  noIndex = false
}: MetadataInput): Metadata {
  const url = new URL(path, siteConfig.url).toString();

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    },
    keywords,
    robots: noIndex
      ? {
          index: false,
          follow: false
        }
      : {
          index: true,
          follow: true
        }
  };
}