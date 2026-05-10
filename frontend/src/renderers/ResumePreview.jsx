import { BulletList, LinkLine, enabledSections, getProfile, normalizeDuration, normalizeLocation } from "./renderUtils.jsx";

export default function ResumePreview({ jsonData, settings, sessionImage, onImageChange, onSettingsChange }) {
  const sections = enabledSections(settings);
  const profile = getProfile(jsonData);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageChange(url);
    }
  };

  const imageSrc = sessionImage || profile.image;
  const imageSettings = profile.imageSettings || { posX: 50, posY: 50, zoom: 100, radius: 50 };

  const updateSetting = (key, val) => {
    onSettingsChange({ ...imageSettings, [key]: parseInt(val) });
  };

  return (
    <section className="preview resume-preview resume-paper">
      <header className="resume-header">
        <div className="header-content">
          <h1 className="resume-name">{profile.Name || "Resume"}</h1>
          <div className="resume-contact">
            <div className="contact-row">
              {profile.ph ? <span><i className="fa-solid fa-phone"></i> +91 {profile.ph}</span> : null}
              {profile.ph && profile.email ? " | " : ""}
              {profile.email ? <a href={`mailto:${profile.email}`}><i className="fa-solid fa-envelope"></i> {profile.email}</a> : null}
            </div>
            <div className="contact-row">
              <LinkLine href={profile.linkedin}><i className="fa-brands fa-linkedin"></i></LinkLine>
              {profile.linkedin && profile.github ? " | " : ""}
              <LinkLine href={profile.github}><i className="fa-brands fa-github"></i></LinkLine>
              {profile.github && profile.portfolio ? " | " : ""}
              <LinkLine href={profile.portfolio}>Portfolio</LinkLine>
            </div>
          </div>
        </div>
        
        <div className="resume-headshot-container">
          <label className="resume-headshot-label">
            <div 
              className="resume-headshot clickable-headshot" 
              style={{ borderRadius: `${imageSettings.radius / 5}px` }}
            >
              {imageSrc ? (
                <img 
                  src={imageSrc} 
                  alt={profile.Name} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: `${imageSettings.posX}% ${imageSettings.posY}%`,
                    transform: `scale(${imageSettings.zoom / 100})`
                  }}
                />
              ) : (
                <div className="headshot-placeholder">
                  <i className="fa-solid fa-camera"></i>
                  <span>Add Photo</span>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </label>

          {(imageSrc) && (
            <div className="resume-photo-controls no-print">
              <div className="control-row">
                <i className="fa-solid fa-arrows-up-down"></i>
                <input type="range" min="0" max="100" value={imageSettings.posY} onChange={e => updateSetting('posY', e.target.value)} />
              </div>
              <div className="control-row">
                <i className="fa-solid fa-arrows-left-right"></i>
                <input type="range" min="0" max="100" value={imageSettings.posX} onChange={e => updateSetting('posX', e.target.value)} />
              </div>
              <div className="control-row">
                <i className="fa-solid fa-magnifying-glass-plus"></i>
                <input type="range" min="100" max="200" value={imageSettings.zoom} onChange={e => updateSetting('zoom', e.target.value)} />
              </div>
              <div className="control-row">
                <i className="fa-solid fa-circle-notch"></i>
                <input type="range" min="0" max="50" value={imageSettings.radius} onChange={e => updateSetting('radius', e.target.value)} />
              </div>
            </div>
          )}
        </div>
      </header>

      {sections.filter((section) => section !== "profile").map((section) => (
        <ResumeSection key={section} section={section} jsonData={jsonData} />
      ))}
    </section>
  );
}

function ResumeSection({ section, jsonData }) {
  const items = jsonData?.[section] || [];

  if (section === "education") {
    return (
      <PreviewSection title="Education">
        {items.map((item, index) => (
          <article className="resume-entry" key={index}>
            <div className="entry-head">
              <h3 className="entry-title">{item.college || ""}</h3>
              <span className="entry-meta">{normalizeLocation(item.location)}</span>
            </div>
            <div className="entry-subline">
              <span>{item.course || ""}{item.cgpa ? ` (CGPA: ${item.cgpa})` : ""}{item.marks ? ` (Marks: ${item.marks})` : ""}</span>
              <span>{normalizeDuration(item.duration)}</span>
            </div>
          </article>
        ))}
      </PreviewSection>
    );
  }

  if (section === "projects") {
    return (
      <PreviewSection title="Projects">
        {items.map((item, index) => (
          <article className="resume-entry" key={index}>
            <div className="entry-head project-head">
              <div className="project-main">
                <h3 className="entry-title">{item.title || ""}</h3>
                {item.githubRepo ? <a className="entry-link project-repo" href={item.githubRepo} target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i> Repo</a> : null}
              </div>
              {Array.isArray(item.technologies) && item.technologies.length ? (
                <div className="project-tech">{item.technologies.join(", ")}</div>
              ) : null}
            </div>
            <BulletList className="bullet-list" items={item.description} />
          </article>
        ))}
      </PreviewSection>
    );
  }

  if (section === "experience") {
    return (
      <PreviewSection title="Experience">
        {items.map((item, index) => (
          <article className="resume-entry" key={index}>
            <div className="entry-head">
              <h3 className="entry-title">{item.company || ""}</h3>
              <span className="entry-meta">{normalizeDuration(item.duration)}</span>
            </div>
            <div className="entry-subline">
              <span>{item.role || ""}</span>
              <span>{item.location || ""}</span>
            </div>
            <BulletList className="bullet-list" items={item.description} />
          </article>
        ))}
      </PreviewSection>
    );
  }

  if (section === "skills") {
    return (
      <PreviewSection title="Skills">
        <div className="plain-lines">
          {items.map((group, index) => (
            <div key={index}>
            {Object.entries(group).map(([key, values]) => (
              <span key={key}><strong>{key}:</strong> {Array.isArray(values) ? values.join(", ") : values}</span>
            ))}
            </div>
          ))}
        </div>
      </PreviewSection>
    );
  }

  if (["achievements", "certifications"].includes(section)) {
    return (
      <PreviewSection title={titleCase(section)}>
        <BulletList className="compact-list two-column-list" items={items.map((item) => item.title)} />
      </PreviewSection>
    );
  }

  if (section === "coding") {
    return (
      <PreviewSection title="Coding">
        <BulletList className="compact-list two-column-list" items={items.map((item) => `${item.platform}: ${item.contestrank}`)} />
      </PreviewSection>
    );
  }

  return null;
}

function PreviewSection({ title, children }) {
  return (
    <section className="resume-section">
      <h2 className="section-heading">{title}</h2>
      <div className="section-rule"></div>
      {children}
    </section>
  );
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
