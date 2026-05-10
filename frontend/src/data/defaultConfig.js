export const sectionLabels = {
  profile: "Profile",
  about: "About",
  education: "Education",
  projects: "Projects",
  experience: "Experience",
  skills: "Skills",
  achievements: "Achievements",
  coding: "Coding",
  certifications: "Certifications",
  contact: "Contact"
};

export const resumeSections = [
  "profile",
  "education",
  "projects",
  "experience",
  "skills",
  "achievements",
  "coding",
  "certifications"
];

export const portfolioSections = [
  "profile",
  "about",
  "education",
  "projects",
  "experience",
  "skills",
  "achievements",
  "coding",
  "certifications",
  "contact"
];

export const defaultJsonData = {
  profile: [
    {
      Name: "Sudikonda Sri Srinivasa Sathwik",
      role: "Full stack Developer",
      roleDescription: "I build resilient and scalable full stack Applications",
      linkedin: "https://www.linkedin.com/in/sathwik-sudikonda/",
      github: "https://github.com/Sathwik279",
      image: "../images/sathwik.jpg",
      email: "ssathwik31831@gmail.com",
      ph: "9063246116",
      portfolio: "https://portfolio-resume-automation.web.app/index.html"
    }
  ],
  about: [
    {
      about: [
        "I am a final-year B.Tech student graduating in 2026, with a strong interest in Data Structures and Algorithms. I am passionate about building full-stack applications and solving real-world problems through technology"
      ]
    }
  ],
  education: [
    {
      college: "Velagapudi Ramakrishna Siddhartha Engineering College",
      course: "B.Tech in Computer Science and Engineering",
      duration: "2022-2026",
      cgpa: "8.86",
      location: "Vijayawada,India"
    }
  ],
  projects: [
    {
      title: "TodoRevamp",
      description: [
        "Developed a full-stack task management web application using React.js with responsive UI.",
        "Handled asynchronous API requests using Fetch API and processed JSON responses.",
        "Implemented JWT-based authentication and role-based access control using Spring Boot."
      ],
      technologies: ["React", "Spring Boot", "Google Cloud Run"],
      githubRepo: "https://github.com/Sathwik279/TodoApplication-Web-.git",
      deployment: "https://todo-frontend-44556.web.app/"
    },
    {
      title: "Portfolio and Resume Automation",
      description: [
        "Built an automated portfolio and resume system using a single JSON file as the source of truth.",
        "Deployed the site with GitHub Actions and Firebase Hosting."
      ],
      technologies: ["JavaScript", "CSS", "HTML"],
      githubRepo: "https://github.com/Sathwik279/Portfolio-website",
      deployment: "https://portfolio-resume-automation.web.app/index.html"
    }
  ],
  experience: [
    {
      role: "Application Developer Intern",
      company: "DeepMedIQ",
      description: [
        "Developed an Android-based medical assistant application using Kotlin and Jetpack Compose.",
        "Integrated REST APIs using Retrofit and implemented local data persistence with Room."
      ],
      duration: "May 2025 - July 2025",
      location: "Remote"
    }
  ],
  skills: [
    { Languages: ["Java", "JavaScript", "Python", "SQL"] },
    { "Web and Frameworks": ["React.js", "HTML", "CSS3", "Spring Boot", "RESTful APIs"] },
    { "Tools and Platforms": ["Git", "Github", "Google Cloud", "Postman"] }
  ],
  achievements: [
    { title: "State Rank 5486 in AP EAMCET 2022" },
    { title: "Top 5% nationally in NPTEL Modern C++ Programming" }
  ],
  coding: [
    { platform: "leetcode", contestrank: "1546" },
    { platform: "Codechef", contestrank: "1350" }
  ],
  certifications: [
    { title: "Google Associate Cloud Engineer" },
    { title: "Postman API Fundamentals Student Expert" }
  ]
};

function settingsFromSections(sections) {
  return {
    sections: Object.fromEntries(sections.map((section, index) => [
      section,
      {
        enabled: true,
        order: index + 1
      }
    ]))
  };
}

export function createDefaultConfig() {
  return {
    jsonData: structuredClone(defaultJsonData),
    resumeSettings: settingsFromSections(resumeSections),
    portfolioSettings: settingsFromSections(portfolioSections)
  };
}
