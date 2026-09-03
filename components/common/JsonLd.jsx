/**
 * Safe Server Component to render application/ld+json script tags.
 * Accepts a single schema object or an array of schema objects.
 */
export default function JsonLd({ data, id }) {
  if (!data) return null;

  const items = Array.isArray(data) ? data : [data];
  const validItems = items.filter(Boolean);

  if (validItems.length === 0) return null;

  return (
    <>
      {validItems.map((schema, index) => {
        const scriptId = id ? (validItems.length > 1 ? `${id}-${index}` : id) : undefined;
        return (
          <script
            key={scriptId || index}
            id={scriptId}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema),
            }}
          />
        );
      })}
    </>
  );
}
