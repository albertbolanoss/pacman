var scenario = document.createElement("canvas");
var context = scenario.getContext("2d");

scenario.width = 1024;
scenario.height = 800;
document.body.appendChild(scenario);

var mainImage = new Image();
mainImage.ready = false;
mainImage.onload = startGame;
mainImage.src = "pac.png";

var score = 0;
var enemyScore = 0;
var initial = true;
var maxTries = 3;

var playerOne = {
  x: 64,
  y: 64,
  character: 320,
  face: 0,
  speed: 5,
  width: 32,
  height: 32
};

var enemyTemplate = {
    x: 0,
    y: 0,
    character: 0,
    ghost: 0,
    speed: 5,
    moving: 0,
    face: 0,
    dirX: 0,
    dirY: 0,
    width: 32,
    height: 32,
    initial: true,
    defeated: false
};

var faces = {
    right: 0,
    down: 32,
    left: 64,
    up: 96
};

var characters = {
    closedMouth: 320,
    openedMouth: 352,
    red: 0,
    orange: 64,
    pink: 128,
    green: 192,
    purple: 256,
    blue: 384
};

var speds = {
    normal: 5,
    fast: 10
};


var red = Object.assign({}, enemyTemplate, {character: characters.red, ghost: characters.red, x: 0});
var orange = Object.assign({}, enemyTemplate, {character: characters.orange, ghost: characters.orange, x: 32});
var pink = Object.assign({}, enemyTemplate, {character: characters.pink, ghost: characters.pink, x: 64});
var green = Object.assign({}, enemyTemplate, {character: characters.green, ghost: characters.green, x: 96});
var purple = Object.assign({}, enemyTemplate, {character: characters.purple, ghost: characters.purple, x: 128});

var enemies = [red, orange, pink, green, purple];

var powerDot = {
    x: 10,
    y: 10,
    powerUp: false,
    radio: 5,
    countDown: 0,
    ghostNum: 0
};

var dimensions = {
    width: scenario.width - (playerOne.width * 2),
    height: scenario.height - (playerOne.height * 2)
};


var keyclick = {};

function startGame() {
    this.ready = true;
    playgame();
}

function resetGame() {
    location.reload();
}

function playgame() {
    render();
    requestAnimationFrame(playgame);
}

function random(factor) {
    return Math.floor(Math.random() * factor);
}

function setBackground() {   
    context.fillStyle = "black";
    context.fillRect(0, 0, scenario.width, scenario.height);
    context.font = "20px Verdana";
    context.fillStyle = "white";
    context.fillText("Pacman: " + score + " vs Ghoshs " + enemyScore, 2, 18);    
}

function drawCharacter(character) {
    // 1: Imagen
    // 2: La figura en x (empieza en cero, multiplicar x 32)
    // 3: La figura en y (empieza en cero, multiplicar x 32)
    // 4: Ancho seccion tomada (configurar con 32)
    // 5: Alto seccion tomada (configurar con 32)
    // 6: Posicion en x
    // 7: Posicion en y
    // 8: Ancho en x
    // 9: Alto Posicion
    context.drawImage(mainImage, character.character, character.face, character.width, character.height, character.x, character.y, character.width, character.height);
}

function render() {
    setBackground();
    
    enemies.forEach(enemy => {
        drawCharacter(enemy);
        moveEnemy(enemy);
        checkEnemyCollision(enemy);
    });
    
    drawCharacter(playerOne);
    movePowerDot();
    checkTimeoutPowerDot();
    
}

function movePlayerOne(keyclick) {
    if (37 in keyclick) {
        playerOne.x -= playerOne.speed;
        playerOne.face = faces.left;
    }
    
    if (38 in keyclick) {
        playerOne.y -= playerOne.speed;
        playerOne.face = faces.up;
    }
    
    if (39 in keyclick) {
        playerOne.x += playerOne.speed;
        playerOne.face = faces.right;
    }
    
    if (40 in keyclick) {
        playerOne.y += playerOne.speed;
        playerOne.face = faces.down;
    }
    
    if (playerOne.character == characters.closedMouth) {
        playerOne.character = characters.openedMouth;
    } else {
        playerOne.character = characters.closedMouth;
    }
    
    defineLimits(playerOne);
    render();
}


function moveEnemy(enemy) {
    if (enemy.initial) {
        enemy.x = random(dimensions.width);
        enemy.y = random(dimensions.height);
        enemy.initial = false;
    }

    if (enemy.moving < 0) {
        enemy.moving = (random(30) * 3 ) + 10 + random(1);
        enemy.speed = random(5);
        enemy.dirX = 0;
        enemy.dirY = 0;
        
        if (enemy.moving % 2) {
            moveEnemyInX(enemy);
        } else{
            moveEnemyInY(enemy);
        }
    }
    
    enemy.moving--;
    enemy.x = enemy.x + enemy.dirX;
    enemy.y = enemy.y + enemy.dirY;

    defineLimits(enemy);
}

function defineLimits(character) {
    if (character.x >= (scenario.width - character.width)) {
        character.x = 0;
    }
    
    if (character.x < 0) {
        character.x = scenario.width - character.width;
    }
    
    if (character.y >= (scenario.height - character.height)) {
        character.y = 0;
    }
    
    if (character.y < 0) {
        character.y = scenario.height - character.height;
    }
}


function moveEnemyInX(enemy) {
    if (powerDot.countDown === 0 && playerOne.x < enemy.x) {
        enemy.dirX = -enemy.speed;
        changeGhost(enemy, faces.left);
    } else {
        enemy.dirX = enemy.speed;
        changeGhost(enemy, faces.right);
    }
}

function moveEnemyInY(enemy) {
    if (powerDot.countDown === 0 && playerOne.y < enemy.y) {
        enemy.dirY = - enemy.speed;
        changeGhost(enemy, faces.up);
    } else {
        enemy.dirY = enemy.speed;
        changeGhost(enemy, faces.down);
    }
}

function changeGhost(enemy, face) {
    if (powerDot.countDown === 0) {
        enemy.face = face;
        enemy.character = enemy.ghost;
        enemy.defeated = false;
    } else {
        enemy.character = characters.blue;

        if (enemy.defeated === false) {
            if (enemy.face === faces.right) {
                enemy.face = faces.down;
            } else {
                enemy.face = faces.right;
            }
        }
    }
}


function movePowerDot() {
    if (powerDot.countDown === 0) {
        if (powerDot.powerUp) {
            context.fillStyle = "#ffffff";
            
            context.beginPath();
            context.arc(powerDot.x, powerDot.y, powerDot.radio, 20, Math.PI * 2, true);
            context.closePath();
            context.fill();
        } else {
            powerDot.x = random(dimensions.width) + 30;
            powerDot.y = random(dimensions.height);
            powerDot.powerUp = true;
        }
    
        checkPowerDot();
    }
}

function checkPowerDot() {
    if (playerOne.x <= (powerDot.x - powerDot.radio) && powerDot.x <= (playerOne.x + playerOne.width) 
        && playerOne.y <= (powerDot.y - powerDot.radio) && powerDot.y <= (playerOne.y + playerOne.height)) {
        powerDot.x = 0;
        powerDot.y = 0;
        powerDot.powerUp = false;
        powerDot.countDown = 1000;
        playerOne.speed = speds.fast;
    }
}

function checkEnemyCollision(enemy) {
    var deltaX = Math.abs(playerOne.x - enemy.x);
    var deltaY = Math.abs(playerOne.y - enemy.y);
    
    if (deltaX <= enemy.width && deltaY <= enemy.height) {
        var x = random(dimensions.width);
        var y = random(dimensions.height);
        
        if (powerDot.countDown > 0) {
            score++;
            enemy.x = x - enemy.width;
            enemy.y = y - enemy.height;
            enemy.defeated = true;
            enemy.face = faces.left;

        } else {
            enemyScore++;
            playerOne.x = x - playerOne.width;
            playerOne.y = y - playerOne.height;
        }

        checkIfYouWon();
    }
}


function checkIfYouWon() {
    var defeated = enemies.filter(e => e.defeated);
    
    if (defeated.length === enemies.length) {
        alert("You Win");
        resetGame();
    } else if (enemyScore === maxTries) {
        alert("You Lose");
        resetGame();
    }

}

function checkTimeoutPowerDot() {
    if (powerDot.countDown > 0) {
        powerDot.countDown--;
    } else {
        playerOne.speed = speds.normal;
    }
}

document.addEventListener("keydown", function(event){
    keyclick[event.keyCode] = true
    movePlayerOne(keyclick)
}, false);

document.addEventListener("keyup", function(event){
    delete keyclick[event.keyCode]
}, false);