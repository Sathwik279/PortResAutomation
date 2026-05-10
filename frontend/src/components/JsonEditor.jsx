import { useEffect, useState } from "react";

export default function JsonEditor({ value, onApply }) {
  const [text, setText] = useState(value);
  const [error, setError] = useState("");

  useEffect(() => {
    setText(value);
  }, [value]);

  function handleApply() {
    try {
      onApply(JSON.parse(text));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="editor-panel">
      <div className="panel-head">
        <div>
          <h2>Main JSON</h2>
          <p>Edit the source data used by both resume and portfolio.</p>
        </div>
        <button type="button" className="primary-button" onClick={handleApply}>
          Apply JSON
        </button>
      </div>
      {error ? <p className="error-banner">{error}</p> : null}
      <textarea
        className="json-textarea"
        value={text}
        spellCheck="false"
        onChange={(event) => setText(event.target.value)}
      />
    </section>
  );
}
