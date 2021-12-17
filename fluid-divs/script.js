const border = document.getElementsByClassName("border")[0]
const wrapper = document.getElementsByClassName("wrapper")[0]
const one = document.getElementById("one")

let drag = false

const handleMouseMove = (e) => {
    const percent = (e.clientX / window.innerWidth)*100
    one.style.width = percent + "%"
    const rect = border.getBoundingClientRect()

    const width = (rect.right - rect.left)*0.9
    wrapper.style.width = width + "px"
}

const handleClick = (e) => {
    e.preventDefault()
    const rect = border.getBoundingClientRect()
    const clickPointX = e.clientX
    const left = rect.left
    const padding = 2 

    if (clickPointX <= left + padding) {
        drag = true
        document.addEventListener("mousemove", handleMouseMove) 
    }
}

border.addEventListener("mousedown", handleClick)

document.addEventListener("mouseup", () => {
    if (drag) {
        document.removeEventListener("mousemove", handleMouseMove)
        drag = false
    }
})
