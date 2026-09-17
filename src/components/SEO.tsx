import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  noindex?: boolean;
  schema?: any;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = 'https://networthvisa.com/og-image.png', // Assuming there's an image
  noindex = false,
  schema
}) => {
  const siteName = 'Networth Certificate Visa';
  const fullTitle = title ? `${title} | ${siteName}` : 'Net Worth Certificate for Visa | CA-Certified with UDIN';
  const fullDescription = description || 'Get a professionally prepared Net Worth Certificate for visa applications with CA review, clear asset-liability summary, document guidance, and online support.';
  const origin = 'https://networthvisa.com';
  const url = canonical ? `${origin}${canonical}` : origin;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {canonical && <link rel="canonical" href={url} />}
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow" />
      )}

      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Schema Markup */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
