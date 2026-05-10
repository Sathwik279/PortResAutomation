export default function Dashboard({
  configs,
  error,
  loading,
  user,
  onLogout,
  onCreate,
  onDelete,
  onOpen,
  onRefresh,
  onRename
}) {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {user?.photoURL && (
            <img 
              src={user.photoURL} 
              alt={user.displayName} 
              style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid var(--portfolio-accent)" }} 
            />
          )}
          <div>
            <p className="eyebrow">Welcome, {user?.displayName || "User"}</p>
            <h1>Config Studio</h1>
          </div>
        </div>
        <div className="topbar-actions">
          <button type="button" className="ghost-button" onClick={onLogout}>
            Logout
          </button>
          <button type="button" className="ghost-button" onClick={onRefresh}>
            Refresh
          </button>
          <button type="button" className="primary-button" onClick={onCreate}>
            Create Config
          </button>
        </div>
      </header>

      {error ? <p className="error-banner">{error}</p> : null}
      {loading ? <p className="empty-state">Loading configs...</p> : null}

      {!loading && configs.length === 0 ? (
        <section className="empty-panel">
          <h2>No configs yet</h2>
          <p>Create your first config to edit JSON, resume sections, portfolio sections, and save versions.</p>
          <button type="button" className="primary-button" onClick={onCreate}>
            Create Config
          </button>
        </section>
      ) : null}

      <section className="config-grid">
        {configs.map((config) => (
          <article className="config-card" key={config.id}>
            <div>
              <h2>{config.name}</h2>
              <p>{config.description || "Resume, portfolio, and JSON snapshot"}</p>
            </div>
            <dl className="meta-row">
              <div>
                <dt>Current</dt>
                <dd>{config.current_version_id ? `#${config.current_version_id}` : "None"}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{new Date(config.updated_at).toLocaleString()}</dd>
              </div>
            </dl>
            <div className="card-actions">
              <button type="button" className="primary-button" onClick={() => onOpen(config.id)}>
                Edit
              </button>
              <button type="button" className="ghost-button" onClick={() => onRename(config)}>
                Rename
              </button>
              <button type="button" className="danger-button" onClick={() => onDelete(config)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
