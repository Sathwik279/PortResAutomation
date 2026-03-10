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
const eduObjTemp = (parent,object)=>{
    genH3(parent,'college',object.college);
    genP(parent,'course',object.course);        
}
const projObjTemp = (parent,object)=>{
    genH3(parent,'title:',object.title);
    genP(parent,'description:',object.description);     
    genP(parent,'github:',object.githubRepo);        
   
}
const expObjTemp = (parent,object)=>{
    genH3(parent,'Role:',object.role);
    genP(parent,'Company:',object.company);       
    genP(parent,'Duration:',object.duration);        
 
}
const skillObjTemp = (parent,object)=>{
    genH3(parent,'Skill:',object.skillname);
}
const codingObjTemp = (parent,object)=>{
    genH3(parent,'Platform:',object.platform);
    genP(parent,'Contest Rank',object.contestRank);        
}
const certifObjTemp = (parent,object)=>{
    genH3(parent,null,object.title);
}


const registry = {
    'education':eduObjTemp,
    'experience':expObjTemp,
    'skills':skillObjTemp,
    'projects':projObjTemp,
    'codingprofile':codingObjTemp,
    'certifications':certifObjTemp
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
        const arrOfObjects = input[key]; 
        const sectionHeading = document.createElement('h2');
        sectionHeading.textContent = key;
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
        const curObjContainer = genDiv(['object',key]) 
        template(curObjContainer,object);
        parent.appendChild(curObjContainer)
    })
}