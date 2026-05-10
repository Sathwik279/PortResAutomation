export default function VersionHistory({ versions, onRestore }) {
  return (
    <section className="editor-panel">
      <div className="panel-head">
        <div>
          <h2>Version History</h2>
          <p>Each save stores the complete JSON, resume settings, and portfolio settings.</p>
        </div>
      </div>
      <div className="version-list">
        {versions.map((version) => (
          <article className="version-row" key={version.id}>
            <div>
              <h3>Version {version.version_number}</h3>
              <p>{version.message || "No message"}</p>
              <span>{new Date(version.created_at).toLocaleString()}</span>
            </div>
            <button type="button" className="ghost-button" onClick={() => onRestore(version.id)}>
              Restore
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
