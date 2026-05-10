import { useEffect, useMemo, useState } from "react";

import { getConfig, listVersions, publishPortfolio, restoreVersion, saveVersion } from "../api/configApi";
import JsonEditor from "../components/JsonEditor";
import SectionPicker from "../components/SectionPicker";
import VersionHistory from "../components/VersionHistory";
import PortfolioPreview from "../renderers/PortfolioPreview";
import ResumePreview from "../renderers/ResumePreview";
import { downloadPortfolioHtml, getPortfolioHtml, printResume } from "../utils/exporters";
import RemovedPanel from "../components/RemovedPanel";
import ImageUploader from "../components/ImageUploader";


const tabs = ["JSON", "Profile", "Resume", "Portfolio", "Versions", "Settings"];

export default function ConfigEditor({ config, onBack, onConfigChange }) {
  const [activeTab, setActiveTab] = useState("JSON");
  const [snapshot, setSnapshot] = useState(config.current_version?.snapshot_json);
  const [versions, setVersions] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const isReady = Boolean(snapshot);

  async function refreshVersions() {
    setVersions(await listVersions(config.id));
  }

  useEffect(() => {
    setSnapshot(config.current_version?.snapshot_json);
    refreshVersions();
  }, [config.id]);

  const jsonText = useMemo(() => JSON.stringify(snapshot?.jsonData || {}, null, 2), [snapshot]);

  function updateSnapshot(updater) {
    setSnapshot((current) => {
      const next = structuredClone(current);
      updater(next);
      return next;
    });
  }

  async function handleSaveVersion() {
    setStatus("");
    const version = await saveVersion(config.id, {
      snapshot,
      message: message || "Saved config changes"
    });
    setMessage("");
    await refreshVersions();
    onConfigChange(await getConfig(config.id));
    setStatus(`Saved version ${version.version_number}`);
  }

  async function handleRestoreVersion(versionId) {
    const restored = await restoreVersion(config.id, versionId);
    await refreshVersions();
    const updated = await getConfig(config.id);
    onConfigChange(updated);
    setSnapshot(restored.snapshot_json);
    setStatus(`Restored as version ${restored.version_number}`);
  }

  const [sessionImage, setSessionImage] = useState(null);

  const [portfolioLayout, setPortfolioLayout] = useState({
    hidden: {},   // { id: boolean }
    size: {},     // { id: scale }
    spacing: {}   // { id: { top: number, bottom: number } }
  });

  // Initialize layout when entering Portfolio tab (first time)
  useEffect(() => {
    if (activeTab === "Portfolio" && isReady) {
      const existing = snapshot?.portfolioLayout || { hidden: {}, size: {}, spacing: {} };
      setPortfolioLayout({
        hidden: { ...existing.hidden },
        size: { ...existing.size },
        spacing: { ...existing.spacing },
      });
    }
  }, [activeTab, isReady]);

  const toggleEditMode = () => setEditMode(prev => !prev);

  // ----- Callbacks that manipulate only the layout -----
  const handleRemove = (id) => {
    setPortfolioLayout(prev => ({
      ...prev,
      hidden: { ...prev.hidden, [id]: true },
    }));
  };

  const handleRestoreLayoutItem = (id) => {
    setPortfolioLayout(prev => {
      const newHidden = { ...prev.hidden };
      delete newHidden[id];
      return { ...prev, hidden: newHidden };
    });
  };

  const handleSpacing = (id, delta, type) => {
    setPortfolioLayout(prev => {
      const current = prev.spacing[id] || { top: 0, bottom: 0 };
      const newValue = (current[type] || 0) + delta;
      return {
        ...prev,
        spacing: {
          ...prev.spacing,
          [id]: { ...current, [type]: newValue }
        }
      };
    });
  };

  const handleResize = (id, scale) => {
    setPortfolioLayout(prev => ({
      ...prev,
      size: { ...prev.size, [id]: scale },
    }));
  };

  // ----- Apply button – persists layout into snapshot -----
  const applyLayout = () => {
    updateSnapshot(next => {
      next.portfolioLayout = portfolioLayout; // store layout alongside jsonData
    });
    setEditMode(false);
  };

  const handlePublish = async () => {
    const deployment = JSON.parse(localStorage.getItem("portfolio_deployment") || "{}");
    if (!deployment.projectId || !deployment.token) {
      setActiveTab("Settings");
      setStatus("Please configure deployment settings first.");
      return;
    }

    setStatus("Publishing portfolio...");
    try {
      const html = getPortfolioHtml(config.name);
      await publishPortfolio(config.id, {
        project_id: deployment.projectId,
        site_id: deployment.siteId || deployment.projectId,
        token: deployment.token,
        html: html
      });
      setStatus("Portfolio published successfully!");
    } catch (err) {
      setStatus(`Failed to publish: ${err.message}`);
    }
  };

  const [editMode, setEditMode] = useState(false);

  return (
    <main className="editor-shell">
      <header className="editor-header">
        <button type="button" className="ghost-button" onClick={onBack}>
          Back
        </button>
        <div>
          <p className="eyebrow">Editing config</p>
          <h1>{config.name}</h1>
        </div>
        <div className="save-box">
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Version message"
          />
          <button type="button" className="primary-button" onClick={handleSaveVersion} disabled={!isReady}>
            Save Version
          </button>
        </div>
        {activeTab === "Portfolio" && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" className="ghost-button" onClick={toggleEditMode}>
              {editMode ? "Exit Edit Mode" : "Edit Mode"}
            </button>
            {editMode && (
              <button type="button" className="primary-button" onClick={applyLayout}>
                Apply Layout
              </button>
            )}
          </div>
        )}
      </header>


      {status ? <p className="success-banner">{status}</p> : null}

      <nav className="tabs" aria-label="Editor sections">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            className={activeTab === tab ? "is-active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {isReady && activeTab === "Resume" ? (
        <div className="preview-actions">
          <button type="button" className="primary-button" onClick={printResume}>
            Download Resume
          </button>
        </div>
      ) : null}

      {isReady && activeTab === "Portfolio" ? (
        <div className="preview-actions">
          <button type="button" className="ghost-button" onClick={() => downloadPortfolioHtml(config.name)}>
            Download HTML
          </button>
          <button type="button" className="primary-button" onClick={handlePublish}>
            Publish Portfolio
          </button>
        </div>
      ) : null}

      {!isReady ? <p className="empty-state">No snapshot found for this config.</p> : null}

      {isReady && activeTab === "JSON" ? (
        <JsonEditor
          value={jsonText}
          onApply={(jsonData) => updateSnapshot((next) => {
            next.jsonData = jsonData;
          })}
        />
      ) : null}

      {isReady && activeTab === "Resume" ? (
        <section className="two-column">
          <SectionPicker
            title="Resume Sections"
            settings={snapshot.resumeSettings}
            onChange={(settings) => updateSnapshot((next) => {
              next.resumeSettings = settings;
            })}
          />
          <ResumePreview 
            jsonData={snapshot.jsonData} 
            settings={snapshot.resumeSettings} 
            sessionImage={sessionImage}
            onImageChange={setSessionImage}
            onSettingsChange={(newSettings) => updateSnapshot(next => {
              next.jsonData.profile[0].imageSettings = newSettings;
            })}
          />
        </section>
      ) : null}

      {isReady && activeTab === "Portfolio" ? (
        <section className="two-column">
          <SectionPicker
            title="Portfolio Sections"
            settings={snapshot.portfolioSettings}
            onChange={(settings) => updateSnapshot((next) => {
              next.portfolioSettings = settings;
            })}
          />
          <PortfolioPreview
            jsonData={snapshot.jsonData}
            settings={snapshot.portfolioSettings}
            isEditMode={editMode}
            portfolioLayout={portfolioLayout}
            onRemove={handleRemove}
            onSpacing={handleSpacing}
            onResize={handleResize}
          />
          {editMode && (
            <RemovedPanel
              removedMap={portfolioLayout.hidden}
              onRestore={handleRestoreLayoutItem}
              jsonData={snapshot.jsonData}
            />
          )}
        </section>
      ) : null}

      {activeTab === "Versions" ? (
        <VersionHistory versions={versions} onRestore={handleRestoreVersion} />
      ) : null}

      {activeTab === "Profile" ? (
        <section className="settings-view">
          <div className="settings-card">
            <h3>Personal Information</h3>
            <p>Update your profile details across all platforms.</p>
            <div className="deployment-form">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={snapshot.jsonData.profile[0]?.Name || ""} 
                  onChange={e => updateSnapshot(next => { next.jsonData.profile[0].Name = e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Role / Title</label>
                <input 
                  type="text" 
                  value={snapshot.jsonData.profile[0]?.role || ""} 
                  onChange={e => updateSnapshot(next => { next.jsonData.profile[0].role = e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Role Description</label>
                <textarea 
                  value={snapshot.jsonData.profile[0]?.roleDescription || ""} 
                  onChange={e => updateSnapshot(next => { next.jsonData.profile[0].roleDescription = e.target.value })}
                  rows={4}
                  style={{ width: '100%', background: '#0b0f14', color: 'white', border: '1px solid #182231', borderRadius: '8px', padding: '12px' }}
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "Settings" ? (
        <section className="settings-view">
          <div className="settings-card">
            <h3>Global Deployment Settings</h3>
            <p>These settings are used to publish your portfolio to Firebase Hosting.</p>
            <DeploymentSettings />
          </div>
        </section>
      ) : null}
    </main>
  );
}

function DeploymentSettings() {
  const [config, setConfig] = useState(() => 
    JSON.parse(localStorage.getItem("portfolio_deployment") || '{"projectId":"","siteId":"","token":""}')
  );

  const save = () => {
    localStorage.setItem("portfolio_deployment", JSON.stringify(config));
    alert("Deployment settings saved locally!");
  };

  return (
    <div className="deployment-form">
      <div className="form-group">
        <label>Firebase Project ID</label>
        <input 
          type="text" 
          value={config.projectId} 
          onChange={e => setConfig({...config, projectId: e.target.value})} 
          placeholder="my-portfolio-project"
        />
      </div>
      <div className="form-group">
        <label>Site ID (Optional)</label>
        <input 
          type="text" 
          value={config.siteId} 
          onChange={e => setConfig({...config, siteId: e.target.value})} 
          placeholder="Defaults to Project ID"
        />
      </div>
      <div className="form-group">
        <label>Firebase CI Token</label>
        <input 
          type="password" 
          value={config.token} 
          onChange={e => setConfig({...config, token: e.target.value})} 
          placeholder="firebase login:ci"
        />
        <small>Generate this using <code>firebase login:ci</code> in your terminal.</small>
      </div>
      <button type="button" className="primary-button" onClick={save}>Save Settings</button>
    </div>
  );
}
