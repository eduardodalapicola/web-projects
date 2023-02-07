document.addEventListener("DOMContentLoaded", function(event) {
    const container = document.querySelector('.container')
    const square = document.querySelector('.square')
    container.addEventListener('click', (ev) => {
        square.classList.add('slide-right')
    })

    square.addEventListener('animationend', (ev) => {
        square.classList.remove('slide-right')
    })

});