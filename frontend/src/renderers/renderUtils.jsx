export function enabledSections(settings) {
  return Object.entries(settings?.sections || {})
    .map(([section, options], index) => [
      section,
      typeof options === "boolean"
        ? { enabled: options, order: index + 1 }
        : { enabled: Boolean(options?.enabled), order: Number(options?.order || index + 1) }
    ])
    .filter(([, options]) => options.enabled)
    .sort(([, first], [, second]) => first.order - second.order)
    .map(([section]) => section);
}

export function getProfile(jsonData) {
  return jsonData?.profile?.[0] || {};
}

export function BulletList({ items, className = "" }) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }
  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

export function LinkLine({ href, children }) {
  if (!href) {
    return null;
  }
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export function normalizeDuration(duration) {
  return duration || "";
}

export function normalizeLocation(location) {
  return location === "Vijayawada,India" ? "Vijayawada, India" : (location || "");
}
