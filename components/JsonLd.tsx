/**
 * JsonLd Component - Reusable component for adding structured data to pages
 * Renders as a static <script> tag so crawlers see it in the initial HTML.
 * Usage: <JsonLd data={schemaObject} />
 */

interface JsonLdProps {
  data: object | object[];
  id?: string;
}

export default function JsonLd({ data, id }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={id ? `${id}-${index}` : `schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
