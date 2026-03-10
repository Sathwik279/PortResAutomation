// global reusables
const content = document.getElementById("content")

const genH3 = (parent,label,value)=>{
     if(value===undefined || value===null)return;

    const labelText = label? `<strong>${label}: </strong>`:'';
    const h3 = document.createElement('h3');
    h3.innerHTML = `${labelText}${value}`;

    parent.appendChild(h3);
}
const genP = (parent,label,value)=>{

    if(value===undefined || value===null)return;

    const labelText = label? `<strong>${label}: </strong>`:'';
    const p = document.createElement('p');
    p.innerHTML = `${labelText}${value}`;

    parent.appendChild(p);
}
const genDiv = (classList)=>{
    const div = document.createElement('div');
    if(classList.length!==0)
    div.classList.add(...classList)
    
    return div;
}
const genLink = (parent,label, url)=>{
    if(!url)return;
    const p = document.createElement('p');
    p.innerHTML = `<strong>${label}:</strong><a href="${url}" target="_blank">View Project</a>`;
    parent.appendChild(p);
}
const profObjTemp = (parent,object)=>{
    genH3(parent,'Name',object.name);
    genH3(parent,'Email',object.email);
    genH3(parent,'Ph',object.ph);
}
const eduObjTemp = (parent,object)=>{
    genH3(parent,'College',object.college);
    genP(parent,'Course',object.course);
    genP(parent,'Cgpa',object.cgpa);
    genP(parent,'Marks',object.marks);        
}
const projObjTemp = (parent,object)=>{
    genH3(parent,'Title',object.title);
    object.description.forEach((description)=>{
    genP(parent,'',description);     
    })
    genLink(parent,'Github',object.githubRepo);        
   
}
const expObjTemp = (parent,object)=>{
    genH3(parent,'Role',object.role);
    genP(parent,'Company',object.company);       
    genP(parent,'Duration',object.duration);        
 
}
const skillObjTemp = (parent,object)=>{
    console.log(object);
    Object.keys(object).forEach((key)=>{
    let arr = object[key];
    genP(parent,key,arr.join(','));
    })
}
const codingObjTemp = (parent,object)=>{
    genH3(parent,'Platform',object.platform);
    genP(parent,'Contest Rank',object.contestRank);        
}
const certifObjTemp = (parent,object)=>{
    genH3(parent,null,object.title);
}
const achieveObjTemp = (parent,object)=>{
    genH3(parent,null,object.title)
}

const registry = {
    'profile':profObjTemp,
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
        const arrOfObjects = input[key]; 
        const sectionHeading = document.createElement('h2');
        sectionHeading.textContent = key.toUpperCase();
        section.appendChild(sectionHeading)
        fillDetails(key,section,arrOfObjects);
        content.appendChild(section)
    });
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