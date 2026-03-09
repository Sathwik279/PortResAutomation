// core principles..
// we must not do explicit hardcoding.
// good usage of interfaces or logic seperation in code.

// global context variables
const content = document.getElementById("content")
const registry = {
    "education":renderEducation,
    "projects":renderProjects,
    "skills":renderSkills,
    "experience":renderExperience,
    "profile":renderProfile
}
// test function
const rec = (input)=>{
    if(Array.isArray(input)){
        input.forEach((item)=>{
            rec(item);
        })

    }else if(input!==null && typeof input==="object"){
        Object.keys(input).forEach((key)=>{
            const item = input[key];
            rec(item);
        })
    }else{
        console.log(`${input} is a ismple value ${typeof input}`)
    }
}

fetch('../json/oneResume.json')
    .then(response=>{
        if(!response.ok){
            throw new Error(`http error~ status: ${response.status}`);
        }
        return response.json()
    })
    .then(data=>{
        // rec(data)
        secLaydown(data)
    })
    .catch(error=>{
        console.log('Error fetching json',error);
    })



// section abstraction

const secLaydown = (input) => {
    Object.keys(input).forEach((key) => {
        // 1. Look up the function in the registry
        const builderFunc = registry[key]; 

        // 2. If it exists, CALL it using () and pass the data
        if (builderFunc) {
            const sectionNode = builderFunc(input[key], key); 
            content.appendChild(sectionNode);
        } else {
            // Fallback if you forgot to define a specific method
            console.warn(`No render method found for: ${key}`);
        }
    });
}


function renderEducation(data, title) {
    const section = document.createElement('section');
    section.innerHTML = `<h2>${title}</h2>`;

    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-container';
        div.innerHTML = `
            <div class="item-header">
                <p class="item-title">${item.College || item.college}</p>
                <span class="item-meta">${item.duration}</span>
            </div>
            <p class="item-subtitle">${item.course} ${item.cgpa ? `| CGPA: ${item.cgpa}` : ''}</p>
        `;
        section.appendChild(div);
    });
    return section;
}


function renderProjects(data, title) {
    const section = document.createElement('section');
    section.innerHTML = `<h2>${title.toUpperCase()}</h2>`;
    
    data.forEach(proj => {
        const div = document.createElement('div');
        div.className = 'project-item';
        div.innerHTML = `
            <div class="item-header">
                <h3>${proj.title} <a href="${proj.githubRepo || '#'}" class="repo-link">🔗 Repo</a></h3>
                <span class="tech-stack">${proj.tech || 'React, Spring Boot'}</span>
            </div>
            <p class="description">${proj.description}</p>
        `;
        section.appendChild(div);
    });
    return section;
}


function renderExperience(data, title) {
    const section = document.createElement('section');
    section.innerHTML = `<h2>${title.toUpperCase()}</h2>`;

    data.forEach(exp => {
        const div = document.createElement('div');
        div.className = 'exp-item';
        div.innerHTML = `
            <div class="item-header">
                <div>
                    <h3>${exp.company}</h3>
                    <p class="role">${exp.Role}</p>
                </div>
                <span class="duration">${exp.duration}</span>
            </div>
        `;
        section.appendChild(div);
    });
    return section;
}

function renderSkills(data, title) {
    const section = document.createElement('section');
    section.innerHTML = `<h2>${title.toUpperCase()}</h2>`;
    
    const container = document.createElement('div');
    container.className = 'skills-grid';

    data.forEach(item => {
        const span = document.createElement('span');
        span.className = 'skill-tag';
        span.textContent = item.skillname; // Accessing the new key
        container.appendChild(span);
    });

    section.appendChild(container);
    return section;
}


function renderSimpleList(data, title) {
    const section = document.createElement('section');
    section.innerHTML = `<h2>${title.toUpperCase()}</h2>`;
    
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'list-item';
        
        // This makes it work for ANY key (platform, title, etc.)
        const content = Object.values(item).join(" - "); 
        div.textContent = content;
        
        section.appendChild(div);
    });
    return section;
}


function renderProfile(data, title) {
    const section = document.createElement('section');
    section.className = 'profile-header';
    
    // We target the first object in the array [0]
    const info = data[0]; 
    
    section.innerHTML = `
        <h1>${info.name.toUpperCase()}</h1>
        <div class="contact-bar">
            <span>📧 ${info.email}</span> | 
            <span>📞 ${info.ph}</span>
        </div>
    `;
    return section;
}
