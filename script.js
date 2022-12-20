var selectedIs = "pen"
var color = "#020204"

window.onload = () => {
    document.querySelectorAll("[leftbarbutton]").forEach(el=>{
        el.addEventListener("click",()=>{
            selectedIs=el.id.split("button-").join("")
            let c = el.getAttribute("bcolor") || "black"
            let b = "#020204"
            //80DE46
            color = c == "black" ? b : (c=="green" ? "#80DE46" : c=="blue" ? "#4846de" : (c=="red" ? "#de4646" : b))
            document.querySelectorAll("[leftbarbutton]").forEach(nel=>{
                nel.classList.replace("selected","_")
            })

            el.classList.add("selected")
        })
    })

    getSelected().classList.add("selected")

    let bg = document.getElementById("bg")
    for(let y=0;y<3000;y+=50) {
        bg.innerHTML+=`
        <path d="M0,${y} L5000,${y}"
            stroke="#C3C3C3" stroke-width="3px"
            fill="none"
            style="stroke-linecap: round; ;"
            erasable="1"
            stroke-linejoin="round"/>
        `

        
    }

    for(let x=0;x<3000;x+=50) {
        bg.innerHTML+=`
        <path d="M${x},0 L${x},5000"
            stroke="#C3C3C3" stroke-width="3px"
            fill="none"
            style="stroke-linecap: round; ;"
            erasable="1"
            stroke-linejoin="round"/>
        `
    }


    main()
}

function getSelected() {
    return document.querySelector("#button-"+selectedIs)
}

function main() {
    var workspace = document.getElementById("workspace")
    let pos = [0,0]
    let pressed = false
    let rnElement = document.createElement("path")
    let allowDraw = false
    let oldPos = [0,0]
    setInterval(()=>{
        allowDraw = true
    },75)


    window.addEventListener("mousemove", (e) => {
        pos = [e.clientX, e.clientY]
    
        if(pressed && allowDraw && selectedIs=="pen" && pos !== oldPos) {
            oldPos = pos
            let add = rnElement.getAttribute("d") ? rnElement.getAttribute("d") + "L" : "M"
            document.getElementById("workspace").style.color="black"
            rnElement.setAttribute("d", " "+add+pos[0]+","+pos[1]+" ")
            allowDraw = false
        }
    })

    window.addEventListener("mousedown", ()=>{
        if(pos[0] < 60 || selectedIs != "pen") return
        pressed = true
        rnElement = new DOMParser().parseFromString(`
        <path d="M${pos[0] || 50},${pos[1] || 0} "
            stroke="${color}" stroke-width="8px"
            fill="none"
            style="stroke-linecap: round; ;"
            erasable="1"
            stroke-linejoin="round"/>
        `, "text/xml").firstChild
        
        workspace.appendChild(rnElement)
    })

    window.addEventListener("mouseup", ()=>{
        pressed = false  
        if(selectedIs !== "pen") return
        workspace.innerHTML+=``
    })

    document.getElementById("button-undo").addEventListener("click",()=>{
        workspace.lastChild.remove()
    })

    document.getElementById("button-import").addEventListener("click",()=>{
        otazka()
    })

    document.getElementById("button-export").addEventListener("click",()=>{
        download(workspace.innerHTML.toString(), "projekt.svg", "text/plain")
        
    })
}

function dataChanged() {
    main()
}


function download(text, name, type) {
    var a = document.createElement("a");
    var file = new Blob([`
    <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://miftik.tk">
    ${text}
    </svg>
    `], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click()
  }

function getBase64(file) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
        workspace.innerHTML+=`
        <g>
        ${reader.result.toString()}
        </g>
        `
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }

function otazka() {
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
        let file =   input.files[0];
        getBase64(file)
    };
    input.click();
}