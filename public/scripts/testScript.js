const container = document.getElementById("container");
const btn = document.getElementById("add");

btn.addEventListener('click',()=>{
    container.textContent = 'i am larger one'
    for(let i=0;i<10;i++){
        const newDiv = document.createElement("div");
        newDiv.textContent = "new div"
        newDiv.id = i;
        container.appendChild(newDiv);
    }
})

container.addEventListener('click',(event)=>{
    console.log(event.target)
})


