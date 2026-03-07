import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  schema?: object;
}

const SITE_NAME = "FinClarity";
const SITE_URL = "https://finclarity.in";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

const DEFAULT_DESCRIPTION =
  "FinClarity helps salaried professionals in India evaluate financial health, manage EMIs, escape debt, and plan financial independence — free, instant, no login required.";

const DEFAULT_KEYWORDS =
  "financial health score India, EMI calculator, debt planner India, emergency fund calculator, financial independence India, salary investment calculator, personal finance India";

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noIndex = false,
  schema,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Master Your Money in 60 Seconds`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@finclarity_in" />

      {/* Mobile / PWA */}
      <meta name="theme-color" content="#0F4C81" />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Geo targeting India */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="language" content="en-IN" />

      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

// ─── Pre-built schema objects ─────────────────────────────────────────────────
export const schemas = {
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FinClarity",
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },

  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FinClarity",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: DEFAULT_DESCRIPTION,
    address: { "@type": "PostalAddress", addressCountry: "IN" },
    sameAs: [
      "https://twitter.com/finclarity_in",
      "https://linkedin.com/company/finclarity",
    ],
  },

  financialTool: (name: string, description: string, url: string) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: `${SITE_URL}${url}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    author: { "@type": "Organization", name: "FinClarity" },
  }),

  breadcrumb: (items: { name: string; url: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }),

  faq: (questions: { question: string; answer: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  }),
};
