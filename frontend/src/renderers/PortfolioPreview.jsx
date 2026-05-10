import { LinkLine, enabledSections, getProfile } from "./renderUtils.jsx";
import { getPortfolioCSS } from "../styles/portfolioStyles";

export default function PortfolioPreview({
  jsonData,
  settings,
  isEditMode,
  portfolioLayout,
  onRemove,
  onSpacing,
  onResize,
}) {
  const sections = enabledSections(settings);
  const profile = getProfile(jsonData);
  const contentSections = sections.filter((section) => section !== "profile");

  const wrap = (id, content) => {
    if (portfolioLayout?.hidden?.[id]) return null;
    const scale = portfolioLayout?.size?.[id] || 1;
    const spacing = portfolioLayout?.spacing?.[id] || { top: 0, bottom: 0 };
    
    return (
      <div
        key={id}
        className={`editable-wrapper ${isEditMode ? "edit-active" : ""}`}
        style={{
          transform: `scale(${scale})`,
          marginTop: `${spacing.top}px`,
          marginBottom: `${spacing.bottom}px`,
          transformOrigin: "center left",
        }}
      >
        {isEditMode && (
          <div className="editable-controls">
            <button type="button" className="control-btn" onClick={() => onRemove(id)} title="Hide">✕</button>
            <div className="spacing-controls">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button type="button" className="control-btn" onClick={() => onSpacing(id, 5, "top")}>↑</button>
                <button type="button" className="control-btn" onClick={() => onSpacing(id, -5, "top")}>↓</button>
              </div>
              <span className="control-label">TOP</span>
            </div>
            <div className="spacing-controls">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button type="button" className="control-btn" onClick={() => onSpacing(id, 5, "bottom")}>↑</button>
                <button type="button" className="control-btn" onClick={() => onSpacing(id, -5, "bottom")}>↓</button>
              </div>
              <span className="control-label">BOT</span>
            </div>
            <div className="spacing-controls">
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.02"
                value={scale}
                onChange={(e) => onResize(id, parseFloat(e.target.value))}
              />
              <span className="control-label">SIZE</span>
            </div>
          </div>
        )}
        {content}
      </div>
    );
  };

  return (
    <section className="preview portfolio-preview portfolio-original">
      <style>{getPortfolioCSS()}</style>
      {sections.includes("profile") ? (
        <PortfolioHero profile={profile} wrap={wrap} />
      ) : null}
      <div className="portfolio-page">
        {contentSections.map((section) => (
          <PortfolioSection
            key={section}
            section={section}
            jsonData={jsonData}
            wrap={wrap}
          />
        ))}
      </div>
    </section>
  );
}

function PortfolioHero({ profile, wrap }) {
  return (
    <section className="portfolio-hero">
      <div className="hero-copy">
        {wrap("hero-kicker", <p className="portfolio-kicker">{profile.role || "Developer"}</p>)}
        {wrap("hero-name", <h1>{profile.Name || "Portfolio"}</h1>)}
        {wrap("hero-description", <p className="hero-description">{profile.roleDescription}</p>)}
        <div className="hero-actions">
          {wrap("hero-github", <LinkLine href={profile.github}>Github</LinkLine>)}
          {wrap("hero-linkedin", <LinkLine href={profile.linkedin}>LinkedIn</LinkLine>)}
          {wrap("hero-portfolio", <LinkLine href={profile.portfolio}>Portfolio</LinkLine>)}
        </div>
      </div>
    </section>
  );
}

function PortfolioSection({ section, jsonData, wrap }) {
  const items = jsonData?.[section] || [];
  if (items.length === 0 && section !== "about" && section !== "contact") return null;

  const band = (content) => (
    <PortfolioBand
      eyebrow={wrap(`sec-${section}-eyebrow`, <p>{section === "about" ? "About" : section}</p>)}
      title={wrap(`sec-${section}-title`, <h2>{getSectionTitle(section)}</h2>)}
    >
      {content}
    </PortfolioBand>
  );

  if (section === "about") {
    const profile = getProfile(jsonData);
    return band(
      <div className="about-panel">
        {items.map((item, idx) => 
          (item.about || []).map((line, lidx) => 
            wrap(`about-${idx}-${lidx}`, <p key={lidx}>{line}</p>)
          )
        )}
      </div>
    );
  }

  if (section === "projects") {
    return band(
      <div className="project-grid">
        {items.map((item, idx) => (
          wrap(`project-${idx}`, 
            <article className="project-card">
              <div>
                {wrap(`project-${idx}-index`, <p className="card-index">{String(idx + 1).padStart(2, "0")}</p>)}
                {wrap(`project-${idx}-title`, <h3>{item.title}</h3>)}
                {Array.isArray(item.technologies) && item.technologies.length ? (
                  wrap(`project-${idx}-tech`, 
                    <div className="tech-row">
                      {item.technologies.map((tech) => <span key={tech}>{tech}</span>)}
                    </div>
                  )
                ) : null}
                <ul>
                  {(item.description || []).map((line, lidx) => (
                    wrap(`project-${idx}-desc-${lidx}`, <li key={lidx}>{line}</li>)
                  ))}
                </ul>
              </div>
              <div className="card-links">
                {wrap(`project-${idx}-code`, <LinkLine href={item.githubRepo}>Code</LinkLine>)}
                {wrap(`project-${idx}-live`, <LinkLine href={item.deployment}>Live</LinkLine>)}
              </div>
            </article>
          )
        ))}
      </div>
    );
  }

  if (section === "experience") {
    return band(
      <div className="timeline-list">
        {items.map((item, idx) => (
          wrap(`exp-${idx}`, 
            <article className="timeline-item">
              <div>
                {wrap(`exp-${idx}-duration`, <span>{item.duration}</span>)}
                {wrap(`exp-${idx}-role`, <h3>{item.role}</h3>)}
                {wrap(`exp-${idx}-company`, <p>{item.company}{item.location ? ` · ${item.location}` : ""}</p>)}
              </div>
              <ul>
                {(item.description || []).map((line, lidx) => 
                  wrap(`exp-${idx}-desc-${lidx}`, <li key={lidx}>{line}</li>)
                )}
              </ul>
            </article>
          )
        ))}
      </div>
    );
  }

  if (section === "skills") {
    return band(
      <div className="skill-groups">
        {items.map((group, idx) => (
          wrap(`skill-${idx}`, 
            <article className="skill-group">
              {Object.entries(group).map(([key, values]) => (
                <div key={key}>
                  {wrap(`skill-${idx}-${key}-title`, <h3>{key}</h3>)}
                  {wrap(`skill-${idx}-${key}-pills`, 
                    <div className="skill-pills">
                      {(Array.isArray(values) ? values : [values]).map((value) => <span key={value}>{value}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </article>
          )
        ))}
      </div>
    );
  }

  if (section === "education") {
    return band(
      <div className="compact-grid">
        {items.map((item, idx) => (
          wrap(`edu-${idx}`, 
            <article className="info-card">
              {wrap(`edu-${idx}-college`, <h3>{item.college}</h3>)}
              {wrap(`edu-${idx}-course`, <p>{item.course}</p>)}
              {wrap(`edu-${idx}-meta`, <span>{item.duration}{item.cgpa ? ` · CGPA ${item.cgpa}` : ""}</span>)}
            </article>
          )
        ))}
      </div>
    );
  }

  if (section === "achievements" || section === "certifications") {
    return band(
      <div className="compact-grid">
        {items.map((item, idx) => (
          wrap(`${section}-${idx}`, 
            <article className="info-card">
              {wrap(`${section}-${idx}-index`, <span>{String(idx + 1).padStart(2, "0")}</span>)}
              {wrap(`${section}-${idx}-text`, <p>{item.title}</p>)}
            </article>
          )
        ))}
      </div>
    );
  }

  if (section === "coding") {
    return band(
      <div className="stats-row">
        {items.map((item, idx) => (
          wrap(`coding-${idx}`, 
            <article className="stat-card">
              {wrap(`coding-${idx}-platform`, <span>{item.platform}</span>)}
              {wrap(`coding-${idx}-rank`, <strong>{item.contestrank}</strong>)}
            </article>
          )
        ))}
      </div>
    );
  }

  if (section === "contact") {
    const profile = getProfile(jsonData);
    return band(
      <div className="contact-panel">
        {wrap("contact-email", <a href={`mailto:${profile.email}`}>{profile.email}</a>)}
        {wrap("contact-ph", <a href={`tel:${profile.ph}`}>{profile.ph}</a>)}
        {wrap("contact-github", <LinkLine href={profile.github}>Github</LinkLine>)}
        {wrap("contact-linkedin", <LinkLine href={profile.linkedin}>LinkedIn</LinkLine>)}
      </div>
    );
  }

  return null;
}

function PortfolioBand({ eyebrow, title, children }) {
  return (
    <section className="portfolio-band">
      <div className="band-heading">
        {eyebrow}
        {title}
      </div>
      {children}
    </section>
  );
}

function getSectionTitle(section) {
  switch (section) {
    case "about": return "A little context";
    case "projects": return "Selected work";
    case "experience": return "Where I have built";
    case "skills": return "Tools I work with";
    case "education": return "Academic base";
    case "achievements": return "Highlights";
    case "certifications": return "Certifications";
    case "coding": return "Problem solving";
    case "contact": return "Let us build something useful";
    default: return section;
  }
}
