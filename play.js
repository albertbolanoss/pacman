var scenario = document.createElement("canvas");
var contexto = scenario.getContext("2d");

scenario.height = 800;
scenario.width = 1024;
document.body.appendChild(scenario);

var mainImage = new Image();
mainImage.ready = false;
mainImage.onload = startGame;
mainImage.src = "pac.png";

var score = 0;
var enemyScore = 0;
var initial = true;

var pacman = {
  x: 50,
  y: 100,
  mouth: 320,
  dir: 0,
  speed: 5
};

var enemy = {
    x: 150,
    y: 200,
    speed: 5,
    moving: 0,
    mouth: 0,
    dirx: 0,
    diry: 0
}

var powerDot = {
    x: 10,
    y: 10,
    powerUp: false
};

var keyclick = {};

    
function startGame() {
    this.ready = true;
    playgame();
}

function playgame() {
    render();
    requestAnimationFrame(playgame);
}

function random(factor) {
    return Math.floor(Math.random() * factor);
}

function setBackground() {   
    contexto.fillStyle = "black";
    contexto.fillRect(0,0,scenario.width, scenario.height);
    contexto.font = "20px Verdana";
    contexto.fillStyle = "white";
    contexto.fillText("Pacman: " + score + " vs Ghoshs " + enemyScore, 2, 18);    
}

function render() {
    setBackground();
    moveEnemy();
    defineLimits(enemy);

    
    // 1: Imagen
    // 2: La figura en x (empieza en cero, multiplicar x 32)
    // 3: La figura en y (empieza en cero, multiplicar x 32)
    // 4: Ancho seccion tomada (configurar con 32)
    // 5: Alto seccion tomada (configurar con 32)
    // 6: Posicion en x
    // 7: Posicion en y
    // 8: Ancho en x
    // 9: Alto Posicion
    contexto.drawImage(mainImage, pacman.mouth, pacman.dir, 32, 32, pacman.x, pacman.y, 50, 50);
    contexto.drawImage(mainImage, enemy.mouth, 0, 32, 32, enemy.x, enemy.y, 32, 32);
}

function movePacman(keyclick) {
    if (37 in keyclick) {
        pacman.x -= pacman.speed;
        pacman.dir = 64
    }
    
    if (38 in keyclick) {
        pacman.y -= pacman.speed;
        pacman.dir = 96
    }
    
    if (39 in keyclick) {
        pacman.x += pacman.speed;
        pacman.dir = 0
    }
    
    if (40 in keyclick) {
        pacman.y += pacman.speed;
        pacman.dir = 32
    }

    defineLimits(pacman);
    
    if (pacman.mouth == 320) {
        pacman.mouth = 352;
    } else {
        pacman.mouth = 320;

    }
    
    render();
}

function moveEnemy() {
    if (initial) {
        enemy.mouth = random(5) * 64;
        enemy.x = random(956);
        enemy.y = random(736);
        initial = false;
    }

    if (enemy.moving < 0) {
        enemy.moving = (random(30) * 3 ) + 10 + random(1);
        enemy.speed = random(4) + 1;
        enemy.dirx = 0;
        enemy.diry = 0;
        
        if (enemy.moving % 2) {
            if (pacman.x < enemy.x) {
                enemy.dirx = -enemy.speed;
            } else {
                enemy.dirx = enemy.speed;
            }
        } else{
            if (pacman.y < enemy.y){
                enemy.diry = -enemy.speed;
            } else {
                enemy.diry = enemy.speed;
            }
        }
    }
    
    enemy.moving--;
    enemy.x = enemy.x + enemy.dirx;
    enemy.y = enemy.y + enemy.diry;
}

function defineLimits(player) {
    if (player.x >= (scenario.width - 32)) {
        player.x = 0;
    }
    
    if (player.x < 0) {
        player.x = (scenario.width - 32);
    }
    
    if (player.y >= (scenario.height - 32)) {
        player.y = 0;
    }
    
    if (player.y < 0) {
        player.y = (scenario.height - 32);
    }
}

document.addEventListener("keydown", function(event){
    keyclick[event.keyCode] = true
    movePacman(keyclick)
}, false);

document.addEventListener("keyup", function(event){
    delete keyclick[event.keyCode]
}, false);