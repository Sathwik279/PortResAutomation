// global reusables
const content = document.getElementById("content")
const sidebar = document.getElementById("sidebar")
const themeStorageKey = "portfolio-theme"
const iconMap = {
    'name': 'fa-solid fa-user',
    'email': 'fa-solid fa-envelope',
    'ph': 'fa-solid fa-phone',
    'linkedin': 'fa-brands fa-linkedin',
    'github': 'fa-brands fa-github'
};

function setTheme(theme){
    const isDark = theme === "dark";
    document.body.classList.toggle("theme-dark", isDark);
}

function getPreferredTheme(){
    const savedTheme = localStorage.getItem(themeStorageKey);
    if(savedTheme){
        return savedTheme;
    }
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
}

function createThemeToggle(){
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("theme-toggle");

    const updateLabel = () => {
        const isDark = document.body.classList.contains("theme-dark");
        button.textContent = isDark ? "Switch to Day Mode" : "Switch to Night Mode";
    };

    button.addEventListener("click", () => {
        const nextTheme = document.body.classList.contains("theme-dark") ? "light" : "dark";
        setTheme(nextTheme);
        localStorage.setItem(themeStorageKey, nextTheme);
        updateLabel();
    });

    updateLabel();
    return button;
}

setTheme(getPreferredTheme());

function capitalize(str){
    return str.charAt(0).toUpperCase()+str.slice(1);
}
const genH3 = (parent,label,value)=>{
     if(value===undefined || value===null)return;

    const labelText = label? `<strong>${label}: </strong>`:'';
    const h3 = document.createElement('h3');
    h3.innerHTML = `${labelText}${value}`;

    parent.appendChild(h3);
}
const genH2 = (parent,label,value)=>{
     if(value===undefined || value===null)return;

    const labelText = label? `<strong>${label}: </strong>`:'';
    const h2 = document.createElement('h2');
    h2.innerHTML = `${labelText}${value}`;

    parent.appendChild(h2);
}
const genP = (parent,label,value)=>{
    if(value===undefined || value===null)return;

    const labelText = label? `<strong>${label} </strong>`:'';
    const p = document.createElement('p');
    p.innerHTML = `${labelText}${value}`;

    parent.appendChild(p);
}

const genBulletP = (parent,label,value)=>{
    if(value===undefined || value===null)return;

    const labelText = label? `<strong>${label}: </strong>`:'';
    const p = document.createElement('p');
    p.innerHTML = `&bull; ${labelText}${value}`;

    parent.appendChild(p);
}

const genBulletList = (parent,items)=>{
    if(!Array.isArray(items) || items.length===0)return;

    const list = document.createElement('ul');
    list.classList.add('detail-list');

    items.forEach((item)=>{
        if(item===undefined || item===null)return;
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
    });

    parent.appendChild(list);
}

const genDiv = (classList)=>{
    const div = document.createElement('div');
    if(classList.length!==0)
    div.classList.add(...classList)
    
    return div;
}

const wrapDiv = (parent,content,classList)=>{
    const div = document.createElement('div');
    if(classList.length!==0){
        div.classList.add(...classList)
    }
    div.appendChild(content);
    parent.appendChild(div);
}

const genLink = (parent,label,url)=>{
    if(!url)return;
    const iconHTML = iconMap[label] ? `<i class="${iconMap[label]}"></i> ` : `${label}`;
    const p = document.createElement('p');
    if(label==='email'||label==='ph'){
        return genP(parent,iconHTML,url);
    }
    p.innerHTML = `<a href="${url}" target="_blank">${iconHTML}${label}</a>`;
    parent.appendChild(p);
}

function generateNavLinks(data){
    const navDiv = document.createElement("div");
    navDiv.classList.add('nav-links');

    const resumeLink = document.createElement('a');
    resumeLink.href = './resume.html';
    resumeLink.textContent = 'RESUME VIEW';
    navDiv.appendChild(resumeLink);

    Object.keys(data).forEach((key)=>{

        if(key==='about'||key==='projects'||key === 'profile'||key==='certifications'||key==='education'||key==='coding'||key==='achievements')return ;

        const link = document.createElement('a');
        link.href = `#${key}`;
        link.textContent = key.toUpperCase();

        navDiv.appendChild(link);
    });
    document.getElementById('sidebar').appendChild(navDiv);
    document.getElementById('sidebar').appendChild(createThemeToggle());
}

const profObjTemp = (parent,object)=>{
    const socialDiv = document.createElement('div');
    socialDiv.classList.add('social');
    genLink(socialDiv,'linkedin',object['linkedin'])
    genLink(socialDiv,'github',object['github'])

    // if(object.image){
    //     const imgDiv = document.createElement('div');
    //     imgDiv.innerHTML = `<img src="${object.image}" alt='hello' class='profile-pic'>`;
    //     parent.appendChild(imgDiv)
    // }
        
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('name')
    genH2(nameDiv,'',object['Name'])
    genLink(nameDiv,'email',object['email'])
    genLink(nameDiv,'ph',object['ph'])
    const nameAndSocialDiv = document.createElement('div')
    nameAndSocialDiv.classList.add('nameAndSocial');
    nameAndSocialDiv.appendChild(nameDiv)
    nameAndSocialDiv.appendChild(socialDiv)
    parent.appendChild(nameAndSocialDiv)

}

const eduObjTemp = (parent,object)=>{
    genP(parent,'College',object.college);
    genP(parent,'Course',object.course);
    genP(parent,'Cgpa',object.cgpa);
    genP(parent,'Marks',object.marks);    
    genP(parent,'Duration',object.duration);
}

const projObjTemp = (parent,object)=>{
    parent.classList.add('detail-card');
    genP(parent,'Title',object.title);
    genP(parent,'Description','');
    genBulletList(parent,object.description);
    genLink(parent,'github',object.githubRepo);        
   
}

const expObjTemp = (parent,object)=>{
    parent.classList.add('detail-card');
    genP(parent,'Role',object.role);
    genP(parent,'Company',object.company);
    genP(parent,'Description','');
    genBulletList(parent,object.description);
    genP(parent,"Duration",object.duration);
    genP(parent,"Location",object.location)
}

const aboutObjTemp = (parent,object)=>{
    parent.classList.add('detail-card');
    genH3(parent,'',object.about);
}

const skillObjTemp = (parent,object)=>{
    Object.keys(object).forEach((key)=>{
    let arr = object[key];
    genP(parent,key,arr.join(','));
    })
}

const codingObjTemp = (parent,object)=>{
    genP(parent,'Platform',object.platform);
    genP(parent,'Contest Rank',object.contestrank);        
}

const certifObjTemp = (parent,object)=>{
    genBulletP(parent,null,object.title);
}

const achieveObjTemp = (parent,object)=>{
    genBulletP(parent,null,object.title)
}

const registry = {
    'profile':profObjTemp,
    'about':aboutObjTemp,
    'education':eduObjTemp,
    'experience':expObjTemp,
    'skills':skillObjTemp,
    'projects':projObjTemp,
    'coding':codingObjTemp,
    'certifications':certifObjTemp,
    'achievements':achieveObjTemp
}

const rec = (input) => {
    if (Array.isArray(input)) {
        input.forEach((item) => {
            rec(item);
        })

    } else if (input !== null && typeof input === "object") {
        Object.keys(input).forEach((key) => {
            const item = input[key];
            rec(item);
        })
    } else {
        console.log(`${input} is a ismple value ${typeof input}`)
    }
}

fetch('../json/oneResume.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`http error~ status: ${response.status}`);
        }
        return response.json()
    })
    .then(data => {
        // rec(data)
        secLaydown(data)
    })
    .catch(error => {
        console.log('Error fetching json', error);
    })

const secLaydown = (input) => {
    Object.keys(input).forEach((key) => {
        const section = document.createElement('section');
        section.classList.add(key);
        section.id = key;
        const arrOfObjects = input[key]; 
        const sectionHeading = document.createElement('h2');
        if(key!=='profile')
        {
            sectionHeading.textContent = key.toUpperCase();
            section.appendChild(sectionHeading)
        }
        const objectsContainer = document.createElement('div');
        objectsContainer.classList.add('objectsContainer');

        fillDetails(key,objectsContainer,arrOfObjects);
        section.appendChild(objectsContainer)

        //ignore section
        if(key==='certifications'||key==='education'||key==='coding'){
            return;
        }
        if(key=="profile"){
            sidebar.appendChild(section);
        }else{
            content.appendChild(section);
        }
    });

    generateNavLinks(input)
}

function fillDetails(key,parent,arrOfObjects) {

    let template = registry[key]
    if(typeof template !=='function'){
        console.warn(`No template found for section: ${key}`)
        return;
    }
    arrOfObjects.forEach((object) => {
        const curObjContainer = genDiv(['object']) 
        template(curObjContainer,object);
        parent.appendChild(curObjContainer)
    })
}
