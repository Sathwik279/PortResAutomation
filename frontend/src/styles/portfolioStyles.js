export const getPortfolioCSS = () => `
/* Global Reset for Portfolio */
.portfolio-original, .portfolio-original * {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  margin: 0;
  padding: 0;
}

.portfolio-original {
  --portfolio-bg: #0b0f14;
  --portfolio-panel: #121821;
  --portfolio-panel-strong: #182231;
  --portfolio-text: #f4f7fb;
  --portfolio-muted: #a8b3c7;
  --portfolio-line: rgba(148,163,184,0.12);
  --portfolio-accent: #ff6fb1;
  --portfolio-accent-2: #6ee7b7;
  
  background: var(--portfolio-bg);
  color: var(--portfolio-text);
  font-family: "Josefin Sans", sans-serif;
  line-height: 1.5;
  text-align: left;
}

/* Typography */
.portfolio-original h1 { font-size: 80px; font-weight: 800; line-height: 0.9; letter-spacing: -0.04em; }
.portfolio-original h2 { font-size: 48px; font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; }
.portfolio-original h3 { font-size: 24px; font-weight: 700; }
.portfolio-original p { font-size: 18px; line-height: 1.6; color: var(--portfolio-muted); }

/* Hero Section */
.portfolio-hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 400px;
  align-items: center;
  gap: 60px;
  padding: 100px 8%;
  position: relative;
}

.hero-image-container {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
}

.hero-profile-img {
  width: 380px;
  height: 480px;
  object-fit: cover;
  border-radius: 24px;
  border: 1px solid var(--portfolio-line);
  box-shadow: 0 30px 60px rgba(0,0,0,0.5);
  filter: grayscale(20%);
  transition: all 0.5s ease;
}

.hero-image-container::before {
  content: "";
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(255, 111, 177, 0.2), transparent 70%);
  z-index: -1;
  border-radius: 40px;
}

.hero-profile-img:hover {
  filter: grayscale(0%);
  transform: scale(1.02);
  border-color: var(--portfolio-accent);
}

.portfolio-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 80% 20%, rgba(255, 111, 177, 0.1), transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(110, 231, 183, 0.05), transparent 50%);
  pointer-events: none;
}

.portfolio-kicker {
  color: var(--portfolio-accent);
  text-transform: uppercase;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 0.15em;
  margin-bottom: 24px;
}

.hero-description {
  margin-top: 32px;
  max-width: 700px;
  font-size: 22px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 48px;
}

.hero-actions a, .card-links a, .contact-panel a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  border-radius: 99px;
  border: 1px solid var(--portfolio-line);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
  min-width: 100px;
}

.hero-actions a:first-child, .card-links a:first-child {
  background: #f4f7fb !important;
  color: #0b0f14 !important;
  border-color: #f4f7fb !important;
}

.hero-actions a:hover, .card-links a:hover {
  transform: translateY(-2px);
  border-color: var(--portfolio-accent);
  box-shadow: 0 10px 20px rgba(255, 111, 177, 0.1);
}

/* Content Layout with Sticky Sidebar */
.portfolio-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 5% 150px;
  display: flex;
  flex-direction: column;
  gap: 150px;
}

.portfolio-band {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 60px;
  align-items: start; /* CRITICAL for sticky */
}

.band-heading {
  position: sticky;
  top: 100px; /* Locks here when scrolling */
}

.band-heading p {
  color: var(--portfolio-accent);
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.2em;
  margin-bottom: 12px;
}

/* MASONRY GRID for Projects (No wasted space) */
.project-grid {
  columns: 2 380px;
  column-gap: 24px;
}

.project-card {
  break-inside: avoid;
  margin-bottom: 24px;
  background: var(--portfolio-panel);
  border: 1px solid var(--portfolio-line);
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  transition: border-color 0.3s;
}

.project-card:hover {
  border-color: rgba(255, 111, 177, 0.3);
}

.card-index { color: var(--portfolio-accent); font-weight: 800; font-size: 12px; margin-bottom: 16px; }
.tech-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.tech-row span {
  font-size: 11px;
  padding: 4px 10px;
  background: rgba(255, 111, 177, 0.1);
  color: var(--portfolio-accent);
  border-radius: 4px;
  font-weight: 700;
}

.project-card ul {
  padding-left: 20px;
  margin-bottom: 32px;
}

.project-card li {
  margin-bottom: 12px;
  font-size: 16px;
  color: var(--portfolio-muted);
}

.card-links {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  border-top: 1px solid var(--portfolio-line);
  padding-top: 24px;
}

/* Timeline/Experience Section */
.timeline-list { display: grid; gap: 24px; }
.timeline-item {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 40px;
  background: var(--portfolio-panel);
  border: 1px solid var(--portfolio-line);
  border-radius: 16px;
  padding: 32px;
}

.timeline-item span { color: var(--portfolio-accent); font-weight: 700; font-size: 14px; }

/* Skills & Others */
.skill-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.skill-group, .info-card, .stat-card {
  background: var(--portfolio-panel);
  border: 1px solid var(--portfolio-line);
  border-radius: 12px;
  padding: 32px;
}

.skill-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-pills span {
  padding: 8px 16px;
  background: var(--portfolio-panel-strong);
  border: 1px solid var(--portfolio-line);
  border-radius: 8px;
  font-size: 14px;
}

/* Contact */
.contact-panel {
  display: flex;
  gap: 40px;
  padding: 80px;
  background: var(--portfolio-panel-strong);
  justify-content: center;
  flex-wrap: wrap;
  border-radius: 16px;
  border: 1px solid var(--portfolio-line);
}

.contact-panel a {
  border: none;
  background: none;
  font-size: 22px;
  border-bottom: 2px solid var(--portfolio-accent);
  border-radius: 0;
  padding: 0 0 8px;
  min-width: auto;
}

/* Responsive */
@media (max-width: 1024px) {
  .portfolio-band { grid-template-columns: 1fr; gap: 30px; }
  .band-heading { position: static; }
  .project-grid { columns: 1; }
  .timeline-item { grid-template-columns: 1fr; gap: 16px; }
  .portfolio-page { gap: 100px; padding: 0 24px 100px; }
}
`;
