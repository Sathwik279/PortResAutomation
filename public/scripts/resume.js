const resumeRoot = document.getElementById("resumeRoot");
const printButton = document.getElementById("printResume");

printButton.addEventListener("click", () => {
    window.print();
});

fetch("../json/oneResume.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Failed to load resume data: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        renderResume(transformData(data));
    })
    .catch((error) => {
        resumeRoot.innerHTML = `<p class="error-state">${error.message}</p>`;
    });

function transformData(input) {
    return {
        profile: input.profile?.[0] || {},
        education: input.education || [],
        projects: input.projects || [],
        experience: input.experience || [],
        skills: input.skills || [],
        achievements: input.achievements || [],
        coding: input.coding || [],
        certifications: input.certifications || []
    };
}

function renderResume(data) {
    resumeRoot.innerHTML = `
        <header class="resume-header">
            <h1 class="resume-name">${escapeHtml(data.profile.Name || "Resume")}</h1>
            <div class="resume-contact">
                <div class="contact-row">
                    ${data.profile.ph ? `<i class="fa-solid fa-phone"></i> +91 ${escapeHtml(data.profile.ph)}` : ""}
                    ${data.profile.email ? ` | <a href="mailto:${encodeURI(data.profile.email)}"><i class="fa-solid fa-envelope"></i> ${escapeHtml(data.profile.email)}</a>` : ""}
                </div>
                <div class="contact-row">
                    ${data.profile.linkedin ? `<a href="${escapeAttribute(data.profile.linkedin)}" target="_blank" rel="noreferrer"><i class="fa-brands fa-linkedin"></i></a>` : ""}
                    ${(data.profile.linkedin && data.profile.github) ? " | " : ""}
                    ${data.profile.github ? `<a href="${escapeAttribute(data.profile.github)}" target="_blank" rel="noreferrer"><i class="fa-brands fa-github"></i></a>` : ""}
                    ${(data.profile.github && data.profile.portfolio) ? " | " : ""}
                    ${data.profile.portfolio ? `<a href="${escapeAttribute(data.profile.portfolio)}" target="_blank" rel="noreferrer">Portfolio</a>` : ""}


                </div>
            </div>
        </header>
        ${createEducationSection(data.education)}
        ${createProjectsSection(data.projects)}
        ${createExperienceSection(data.experience)}
        ${createSkillsSection(data.skills)}
        ${createAchievementsSection(data.achievements)}
        ${createCodingSection(data.coding)}
        ${createCertificationsSection(data.certifications)}
    `;
}

function createSection(title, content) {
    if (!content) {
        return "";
    }

    return `
        <section class="resume-section">
            <h2 class="section-heading">${escapeHtml(title)}</h2>
            <div class="section-rule"></div>
            ${content}
        </section>
    `;
}

function createEducationSection(items) {
    const content = items.map((item) => `
        <article class="resume-entry">
            <div class="entry-head">
                <h3 class="entry-title">${escapeHtml(item.college || "")}</h3>
                <span class="entry-meta">${escapeHtml(formatLocation(item.location))}</span>
            </div>
            <div class="entry-subline">
                <span>${escapeHtml(item.course || "")}${item.cgpa ? ` (CGPA: ${escapeHtml(item.cgpa)})` : ""}${item.marks ? ` (Marks: ${escapeHtml(item.marks)})` : ""}</span>
                <span>${escapeHtml(formatDuration(item.duration))}</span>
            </div>
        </article>
    `).join("");

    return createSection("Education", content);
}

function createProjectsSection(items) {
    const content = items.map((item) => `
        <article class="resume-entry">
            <div class="entry-head project-head">
                <div class="project-main">
                    <h3 class="entry-title">${escapeHtml(item.title || "")}</h3>
                    ${item.githubRepo ? `<a class="entry-link project-repo" href="${escapeAttribute(item.githubRepo)}" target="_blank" rel="noreferrer"><i class="fa-brands fa-github"></i> Repo</a>` : ""}
                </div>
                ${Array.isArray(item.technologies) && item.technologies.length ? `
                    <div class="project-tech">${escapeHtml(item.technologies.join(", "))}</div>
                ` : ""}
            </div>
            ${createBulletList(item.description)}
        </article>
    `).join("");

    return createSection("Projects", content);
}

function createExperienceSection(items) {
    const content = items.map((item) => `
        <article class="resume-entry">
            <div class="entry-head">
                <h3 class="entry-title">${escapeHtml(item.company || "")}</h3>
                <span class="entry-meta">${escapeHtml(formatDuration(item.duration))}</span>
            </div>
            <div class="entry-subline">
                <span>${escapeHtml(item.role || "")}</span>
                <span>${escapeHtml(item.location || "")}</span>
            </div>
            ${createBulletList(item.description)}
        </article>
    `).join("");

    return createSection("Experience", content);
}

function createSkillsSection(items) {
    const lines = items.flatMap((group) => {
        return Object.entries(group).map(([key, values]) => {
            const printable = Array.isArray(values) ? values.join(", ") : values;
            return `<div><strong>${escapeHtml(normalizeSkillKey(key))}:</strong> ${escapeHtml(printable)}</div>`;
        });
    }).join("");

    return createSection("Technical Skills", lines ? `<div class="plain-lines">${lines}</div>` : "");
}

function createAchievementsSection(items) {
    return createSection("Achievements", createCompactList(items.map((item) => item.title)));
}

function createCodingSection(items) {
    const content = createCompactList(items.map((item) => {
        return `${item.platform || ""}: ${item.contestrank || ""}`;
    }), "two-column-list");

    return createSection("Coding Profiles", content);
}

function createCertificationsSection(items) {
    return createSection("Certifications", createCompactList(items.map((item) => item.title), "two-column-list"));
}

function createBulletList(items) {
    if (!Array.isArray(items) || items.length === 0) {
        return "";
    }

    return `
        <ul class="bullet-list">
            ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
    `;
}

function createCompactList(items, className = "") {
    const filtered = items.filter(Boolean);
    if (filtered.length === 0) {
        return "";
    }

    return `
        <ul class="compact-list ${className}">
            ${filtered.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
    `;
}

function normalizeSkillKey(key) {
    if (key === "Tools ans Platforms") {
        return "Tools & Platforms";
    }
    return key;
}

function formatLocation(location) {
    return location === "Vijayawada,India" ? "Vijayawada, India" : (location || "");
}

function formatDuration(duration) {
    return duration || "";
}

function cleanLinkLabel(url) {
    return String(url).replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
    return escapeHtml(value);
}
