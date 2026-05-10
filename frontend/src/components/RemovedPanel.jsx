import "../styles/app.css";

export default function RemovedPanel({
  removedMap,
  onRestore,
}) {
  const ids = Object.keys(removedMap || {}).filter(id => removedMap[id]);
  
  if (ids.length === 0) return null;

  return (
    <aside className="removed-panel">
      <h3>Removed Items</h3>
      <ul>
        {ids.map(id => (
          <li key={id}>
            <button
              className="restore-btn"
              type="button"
              onClick={() => onRestore(id)}
            >
              ↩︎ {id.replace(/-/g, " ")}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
