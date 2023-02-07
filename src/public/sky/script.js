
function randomInteger(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomFloat(min, max, decimals = 2) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

function randomElements(array, n) {
    let pos = 0
    const ar = []
    for (i=0; i < n; i++) {
        pos = randomInteger(0, array.length - 1);
        ar.push(array[pos])
        delete(array[pos])
    }
    return ar
}

function addShot (spaceship, shotAudio, muted) {
    const shots = document.querySelector('#shots')
    const sleft = parseInt(getComputedStyle(spaceship).left)
    const el = document.createElement('div')
    el.style.left = `${sleft + 23}px`
    shots.appendChild(el)

    if (! muted) {
        shotAudio.currentTime = 0
        shotAudio.play()
    }
}

function time () {
    return Math.floor(Date.now() / 1000)
}

class Enemy {
    constructor(el, pos) {
        this.el = el
        this.pos = pos
        this.timer = time()
        this.speed = randomInteger(-10, 10)
        this.angle = randomFloat(0, 2*Math.PI)
    }
}

function addEnemies (n, bounds) {
    const enemies = document.querySelector('#enemies')
    let sp = Math.floor(bounds.x[1] / 10);
    positions = randomElements(Array.from({length: 10}, (v, k) => k*sp), n)
    const rEnemies = [];
    for(i=0; i < n; i++) {
        const el = document.createElement('img');
        el.src = 'sky/images/spaceship.png'
        el.style.left = positions[i] + 'px'
        enemies.appendChild(el)
        rEnemies.push(new Enemy(el, {top: -55, left: positions[i]}))
    }
    return rEnemies

}
  

let left = 100
const songs = [];
document.addEventListener("DOMContentLoaded", function(event) {
    // Load Songs
    const themeSong = new Audio("sky/audios/theme.mp3");
    themeSong.loop = true;

    const shotAudio = new Audio("sky/audios/shot.mp3")
    
    const container = document.querySelector('.container')
    rect = container.getBoundingClientRect()
    const bounds = {x: [0, parseInt(rect.width)], y: [0, parseInt(rect.height)]}
    const nPoints = 20;

    boxShadow = ''
    for(let i = 0; i < nPoints; i++) {
        x = randomInteger(bounds.x[0], bounds.x[1])
        y = randomInteger(bounds.y[0], bounds.y[1])
        boxShadow += `${x}px ${y}px white,`
    }
    boxShadow = boxShadow.slice(0, -1)
    document.documentElement.style.setProperty('--boxShadow', boxShadow)

    boxShadow = ''
    for(let i = 0; i < nPoints; i++) {
        x = randomInteger(bounds.x[0], bounds.x[1])
        y = randomInteger(bounds.y[0], bounds.y[1])
        boxShadow += `${x}px ${y}px white,`
    }
    boxShadow = boxShadow.slice(0, -1)
    document.documentElement.style.setProperty('--boxShadow2', boxShadow)

    const spaceship = document.querySelector('#spaceship')

    const volume = document.querySelector('#volume')
    let muted = true

    volume.addEventListener('click', (ev) => {
        if (ev.target.textContent.trim() === 'volume_off') {
            ev.target.textContent = 'volume_up'
            themeSong.play()
            muted = false
        } else {
            ev.target.textContent = 'volume_off'
            themeSong.pause()
            muted = true
        }
    })

    document.addEventListener('keydown', (ev) => {

        if (ev.key === 'ArrowLeft' && left >= 15) {
            left -= 15
            spaceship.style.left = `${left}px`
        }

        if(ev.key === 'ArrowRight' && left <= parseInt(rect.width) - 50) {
            left += 15
            spaceship.style.left = `${left}px`
        }
        if (ev.key === ' ') {
            addShot(spaceship, shotAudio, muted)

        }

    })

    document.addEventListener('mousemove', (ev) => {
        spaceship.style.left = `${ev.clientX - 25}px`
    })

    document.addEventListener('mousedown', (ev) => {
        if (ev.button === 0) {
            addShot(spaceship, shotAudio, muted)

        }
    })

    const enemies = addEnemies(5, bounds)
    function loop () {
        const shots = document.querySelector('#shots')
        for (const shot of shots.children) {
            let top = parseInt(getComputedStyle(shot).top.replace('/\D/g', ''));
            top -= 15;
            if (top < -100) {
                shot.remove()
            } else {
                shot.style.top = `${top}px`
            }
        }

        for (const enemy of enemies) {
            if(time() - enemy.timer >= 4) {
                enemy.speed = randomInteger(-10, 10)
                enemy.angle = randomFloat(0, 2*Math.PI)

                enemy.timer = time()
            }
            if (enemy.speed !== 0) {
                if (enemy.pos.left < rect.width - 60 && enemy.pos.left > 0) {
                    enemy.pos.left += enemy.speed * Math.cos(enemy.angle)
                    enemy.el.style.left = enemy.pos.left + 'px'
                } else {
                    if (enemy.pos.left <= 0) {
                        enemy.pos.left = 1
                    } else {
                        enemy.pos.left = rect.width - 61
                    }
                }
                if (enemy.pos.top < rect.height/2 - 120 && enemy.pos.top >= -55) {
                    enemy.pos.top += enemy.speed * Math.sin(enemy.angle)
                    enemy.el.style.top = enemy.pos.top + 'px'
                } else {
                    if (enemy.pos.top < -55) {
                        enemy.pos.top = -54
                    } else {
                        enemy.pos.top = rect.height/2 - 121
                    }
                }
            }
        }
    }
    
    loop()
    setInterval(loop, 30)


})

