/**
 * JsonLd Component - Reusable component for adding structured data to pages
 * Usage: <JsonLd data={schemaObject} />
 */

import Script from "next/script";

interface JsonLdProps {
  data: object | object[];
  id?: string;
}

export default function JsonLd({ data, id }: JsonLdProps) {
  // Handle array of schemas
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={id ? `${id}-${index}` : `schema-${index}`}
          id={id ? `${id}-${index}` : undefined}
          type="application/ld+json"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}
