// global reusables
const content = document.getElementById("content")
const iconMap = {
    'name': 'fa-solid fa-user',
    'email': 'fa-solid fa-envelope',
    'ph': 'fa-solid fa-phone',
    'linkedin': 'fa-brands fa-linkedin',
    'github': 'fa-brands fa-github'
};
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
const genP = (parent,label,value)=>{
    // console.log(label)

    if(value===undefined || value===null)return;

    const labelText = label? `<strong>${label}: </strong>`:'';
    const p = document.createElement('p');
    p.innerHTML = `${labelText}${value}`;

    parent.appendChild(p);
}

const genBulletP = (parent,label,value)=>{
    // console.log(label)

    if(value===undefined || value===null)return;

    const labelText = label? `<strong>${label}: </strong>`:'';
    const p = document.createElement('p');
    p.innerHTML = `&bull; ${labelText}${value}`;

    parent.appendChild(p);
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
    p.innerHTML = `<a href="${url}" target="_blank">${iconHTML}${label}</a>`;
    parent.appendChild(p);
}
const profObjTemp = (parent,object)=>{
    const socialDiv = document.createElement('div');
    socialDiv.classList.add('social');
    genLink(socialDiv,'linkedin',object['linkedin'])
    genLink(socialDiv,'github',object['github'])

    if(object.image){
        const imgDiv = document.createElement('div');
        imgDiv.innerHTML = `<img src="${object.image}" alt='hello' class='profile-pic'>`;
        parent.appendChild(imgDiv)
    }
        
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('name')
    genP(nameDiv,'Name',object['Name'])
    genP(nameDiv,'Email',object['email'])
    genP(nameDiv,'Ph',object['ph'])
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
    genP(parent,'Title',object.title);
    genP(parent,'Description','');
    object.description.forEach((description)=>{
        genP(parent,'',description);     
    })
    genLink(parent,'github',object.githubRepo);        
   
}
const expObjTemp = (parent,object)=>{
    genP(parent,'Role',object.role);
    genP(parent,'company',object.comapany);
    genP(parent,'Description','');
    object.description.forEach((description)=>{
        genP(parent,'',description)
    })
    genP(parent,"Duration",object.duration);
    genP(parent,"Location",object.location)
}
const skillObjTemp = (parent,object)=>{
    // console.log(object);
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
        const objectsContainer = document.createElement('div');
        objectsContainer.classList.add('objectsContainer');

        fillDetails(key,objectsContainer,arrOfObjects);
        section.appendChild(objectsContainer)
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


function generatePDF() {
    const element = document.getElementById('content');
    
    const options = {
        margin:       0.5,
        filename:     'My_Professional_Resume.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 }, // Increases resolution for clear text
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // New Promise-based usage
    html2pdf().set(options).from(element).save();
}
