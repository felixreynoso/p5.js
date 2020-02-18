/*

The Game Project - Part 7 

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var trees_x;
var clouds;
var mountains;
var collectables;
var canyons;  

var game_score;
var flagpole;
var lives;

var platforms;
var bullet_enemy;
var gameSounds;
let button;

function preload() {
    soundFormats('mp3'); 
    gameSounds = { 
            level: loadSound('https://adventurer2d.s3.ca-central-1.amazonaws.com/assets/sound_files/level_sound.mp3'),
            level_complete: loadSound('https://adventurer2d.s3.ca-central-1.amazonaws.com/assets/sound_files/level_complete_sound.mp3'),
            bullet_hit: loadSound('https://adventurer2d.s3.ca-central-1.amazonaws.com/assets/sound_files/bullet_hit_sound.mp3'),
            collected: loadSound('https://adventurer2d.s3.ca-central-1.amazonaws.com/assets/sound_files/collected_sound.mp3'),
            died: loadSound('https://adventurer2d.s3.ca-central-1.amazonaws.com/assets/sound_files/died_sound.mp3'),
            game_over: loadSound('https://adventurer2d.s3.ca-central-1.amazonaws.com/assets/sound_files/game_over_sound.mp3'),
            jumped: loadSound('https://adventurer2d.s3.ca-central-1.amazonaws.com/assets/sound_files/jumped_sound.mp3')
        };
}


function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;    
    lives = 3;
    startGame(); 
}

function draw()
{
//    console.log(frameRate());
    console.log(gameChar_world_x);
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    push();
    translate(scrollPos, 0);
    
	// Draw clouds.
    drawClouds();
    
	// Draw mountains.
    drawMountains();
    
	// Draw trees.
    drawTrees();
    
	// Draw canyons.
    for(var i = 0; i < canyons.length; i++)
    {   
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }
    
	// Draw collectable items.
    for(var i = 0; i < collectables.length; i++)
    {   
        if (collectables[i].isFound == false)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }    

    //Draw platforms
    for (var i = 0; i < platforms.length; i++)
        drawPlatform(platforms[i]);  
    
    //Call to render flagPole.
    renderFlagpole();
    
    //Call to render Bullet Enemies.
    for (var i = 0; i < bullet_enemy.length; i++)
        drawBulletEnemies(bullet_enemy[i]);

    pop(); 
    
    // Draw game character.
	drawGameChar();

    // Draw game score.
    fill(255);
    noStroke();
    textSize(18);
    text("score: " + game_score, 20, 20);
    checkPlayerDie();
    
    drawLives();

    // Game Over Behavior.
    if (lives < 1)
    {
        fill(255,0,0);
        textSize(18);
        text("Game over. Press space to continue.", width/3, height/2);
        noLoop();
        stopGameMusic();
        gameSounds.game_over.play();
    }
    
    // Level Complete Behavior.
    if (flagpole.isReached)
    {
        if (gameSounds.level.isPlaying())
            gameSounds.level.pause();
        fill(245, 255, 0);
        textSize(18);
        text("Level complete. Press space to continue.", width/3, height/2);
        noLoop();
        stopGameMusic();
        gameSounds.level_complete.play();
    }
    
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}
    
	// Logic to make the game character rise and fall.
    if (gameChar_y < floorPos_y)
    {
        // Stop from falling if character is on top of a platform.
        on_platform = checkPlatform();
        
        if (on_platform == false)
        {
            gameChar_y += 2;
            isFalling = true;
        }
    
        on_platform = false;
        console.log(on_platform, gameChar_y, platforms[0].y_pos, floorPos_y);
    }
    else
    {
        isFalling = false;
    }
    if (isPlummeting)
    {
        gameChar_y += 5;
    }

	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
    if (gameSounds.level.isPlaying() == false)
    {   
        gameSounds.level.rate(1.25);
        gameSounds.level.play();
        
    }
	if (keyCode == 37)
        isLeft = true;
    if (keyCode == 39)
        isRight = true;
    if (((keyCode == 32) && (gameChar_y == floorPos_y)) || //Only allows character to jump if on floor
        ((keyCode == 32) && checkPlatform()))              //Only allows character to jump if on platform
    {
        gameSounds.jumped.play();
        gameChar_y -= 100;
    }
    if ((keyCode == 32 && lives < 1) || (keyCode == 32 && flagpole.isReached) )
    {
        lives = 3;
        startGame();
    }
}

function keyReleased()
{
	if (keyCode == 37)
        isLeft = false;
    if (keyCode == 39)
        isRight = false;
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
        fill(232, 198, 135);
        var head_pos = 17.5
        rect(gameChar_x - head_pos, gameChar_y - 60, 35,35); // Head
        fill(207, 50, 29);
        rect(gameChar_x - head_pos + 2, gameChar_y - 25 , 31, 15); // Body
        var body_x = gameChar_x - head_pos + 2;
        var body_y = gameChar_y - 25;
        fill(76, 116, 191);
        rect(body_x - 4, body_y, 10,10); // Left arm
        fill(207, 50, 29);
        rect(gameChar_x - head_pos + 2, gameChar_y - 25 , 31, 15); // Body
        fill(76, 116, 191);
        rect(body_x + 25, body_y, 10,10); // right arm
        fill(120, 85, 22);
        rect(gameChar_x - head_pos - 1, gameChar_y -10 , 12, 10); // left leg
        rect(gameChar_x - head_pos + 21 , gameChar_y -10 , 12, 10); // right leg
	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        fill(232, 198, 135);
        var head_pos = 17.5
        rect(gameChar_x - head_pos, gameChar_y - 60, 35,35); // Head
        fill(207, 50, 29);
        rect(gameChar_x - head_pos + 2, gameChar_y - 25 , 31, 15); // Body
        var body_x = gameChar_x - head_pos + 2;
        var body_y = gameChar_y - 25;
        fill(76, 116, 191);
        rect(body_x + 25, body_y, 10,10); // right arm
        fill(207, 50, 29);
        rect(gameChar_x - head_pos + 2, gameChar_y - 25 , 31, 15); // Body
        fill(76, 116, 191);
        rect(body_x - 4, body_y, 10,10); // Left arm
        fill(120, 85, 22);
        rect(gameChar_x - head_pos + 2 , gameChar_y -10 , 12, 10); // left leg
        rect(gameChar_x - head_pos + 21 + 3, gameChar_y -10 , 12, 10); // right leg
	}
	else if(isLeft)
	{
		// add your walking left code
        fill(232, 198, 135);
        var head_pos = 17.5
        rect(gameChar_x - head_pos, gameChar_y - 60, 35,35); // Head
        fill(207, 50, 29);
        rect(gameChar_x - head_pos + 2, gameChar_y - 25 , 31, 15); // Body
        var body_x = gameChar_x - head_pos + 2;
        var body_y = gameChar_y - 25;
        fill(76, 116, 191);
        rect(body_x - 4, body_y, 10,10); // Left arm
        fill(207, 50, 29);
        rect(gameChar_x - head_pos + 2, gameChar_y - 25 , 31, 18); // Body
        fill(76, 116, 191);
        rect(body_x + 25, body_y, 10,10); // right arm
        fill(120, 85, 22);
        rect(gameChar_x - head_pos -1 , gameChar_y -7 , 12, 10); // left leg
        rect(gameChar_x - head_pos + 21, gameChar_y -7 , 12, 10); // right leg     
	}
	else if(isRight)
	{
		// add your walking right code
        fill(232, 198, 135);
        var head_pos = 17.5
        rect(gameChar_x - head_pos, gameChar_y - 60, 35,35); // Head
        fill(207, 50, 29);
        rect(gameChar_x - head_pos + 2, gameChar_y - 25 , 31, 15); // Body
        var body_x = gameChar_x - head_pos + 2;
        var body_y = gameChar_y - 25;
        fill(76, 116, 191);
        rect(body_x + 25, body_y, 10,10); // right arm
        fill(207, 50, 29);
        rect(gameChar_x - head_pos + 2, gameChar_y - 25 , 31, 18); // Body
        fill(76, 116, 191);
        rect(body_x - 4, body_y, 10,10); // Left arm
        fill(120, 85, 22);
        rect(gameChar_x - head_pos +2 , gameChar_y -7 , 12, 10); // left leg
        rect(gameChar_x - head_pos + 24, gameChar_y -7 , 12, 10); // right leg            
	}
	else if(isFalling)
	{
		// add your jumping facing forwards code
        fill(232, 198, 135);
        var head_pos = 17.5
        var body_x = gameChar_x - head_pos + 2;
        var body_y = gameChar_y - 25;
        rect(gameChar_x - head_pos, gameChar_y - 60, 35,35); // Head
        fill(207, 50, 29);
        fill(76, 116, 191);
        rect(body_x + 25, body_y, 10,10); // right arm
        rect(body_x - 4, body_y, 10,10); // Left arm
        fill(207, 50, 29);
        rect(gameChar_x - head_pos + 2, gameChar_y - 25 , 31, 15); // Body
        fill(120, 85, 22);
        rect(gameChar_x - head_pos -1 , gameChar_y -10 , 12, 10); // left leg
        rect(gameChar_x - head_pos + 21 + 3, gameChar_y -10 , 12, 10); // right leg 
	}
	else
	{
		// add your standing front facing code
        fill(232, 198, 135);
        var head_pos = 17.5
        var body_x = gameChar_x - head_pos + 2;
        var body_y = gameChar_y - 25;
        rect(gameChar_x - head_pos, gameChar_y - 60, 35,35); // Head
        fill(76, 116, 191);
        rect(body_x + 25, body_y, 10,10); // right arm
        rect(body_x - 4, body_y, 10,10); // Left arm
        fill(207, 50, 29);
        rect(gameChar_x - head_pos + 2, gameChar_y - 25 , 31, 18); // Body
        fill(120, 85, 22);
        rect(gameChar_x - head_pos + 2, gameChar_y -7 , 12, 10); // left leg
        rect(gameChar_x - head_pos + 21, gameChar_y -7 , 12, 10); // right leg 
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for(var i = 0; i < clouds.length; i++)
    {
        fill(255);
        noStroke();
        ellipse(clouds[i].x_pos, clouds[i].y_pos, 60, 60);
        ellipse(clouds[i].x_pos - 35, clouds[i].y_pos, 35, 35);
        ellipse(clouds[i].x_pos + 35, clouds[i].y_pos, 35, 35);
    }
}

// Function to draw mountains objects.
function drawMountains()
{
    for(var i = 0; i < mountains.length; i++)
    {
        fill(125, 138, 166);
        triangle(mountains[i].x_pos, 432,
            mountains[i].x_pos + ((100 * mountains[i].size)/2), (height /(1.5 * mountains[i].size)),
            mountains[i].x_pos +  (100 * mountains[i].size), 432);
    }
}

// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
        fill(114, 76, 10);
        rect(trees_x[i], treePos_y + 45 , 60, 100);
        fill(42, 241, 149);
        triangle(trees_x[i] - 50, treePos_y + 50, trees_x[i] + 30, treePos_y - 50, trees_x[i] + 110, treePos_y + 50);
        triangle(trees_x[i] - 50, treePos_y , trees_x[i] + 30, treePos_y - 100, trees_x[i] + 110, treePos_y );

    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(100, 155, 255); 
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width,(height-floorPos_y));
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{    
    if (in_range(gameChar_world_x, t_canyon.x_pos, (t_canyon.x_pos+t_canyon.width)) && (gameChar_y >= floorPos_y))
    {
        isPlummeting = true;
    }
}
        
function in_range(val, i, j)
{
    if ((val >= i) && (val <= j))
        return true;
    else
        return false;
}
// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
    noFill();
    strokeWeight(2);
    stroke(255,215,0);
    textSize(t_collectable.size - 20);
    text("$", t_collectable.x_pos, t_collectable.y_pos);
    noStroke();
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    collision_radious = dist(t_collectable.x_pos,t_collectable.y_pos,(gameChar_world_x),gameChar_y);
    
    if (collision_radious <= 25)
    {   
        gameSounds.collected.play();
        t_collectable.isFound = true;
        game_score++;
    }
}

// Function to draw flagpole.
function renderFlagpole()
{
    checkFlagpole();  
    push();
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y-250);
    noStroke();
    fill(250,0, 250);
    if (flagpole.isReached)
    {    
        rect(flagpole.x_pos,floorPos_y-250, 50, 50);
    }
    else
    {   
        rect(flagpole.x_pos,floorPos_y-50, 50, 50);
    }
    pop();    
}

//Function to check if flagpole has been reached.
function checkFlagpole()
{
    d = dist(flagpole.x_pos, floorPos_y+50, gameChar_world_x, floorPos_y+50);
    if (d <= 15)
    {
        flagpole.isReached = true;
    }
}

//Function to check if player is dead.
function checkPlayerDie()
{
    if (gameChar_y > height)
    {
        stopGameMusic();
        gameSounds.died.play();
        if (lives > 0)
        {   
            lives--;
            waitSongFinish(gameSounds.died);
            startGame();
        }
    }    
}

//Function to draw lives.
function drawLives()
{
    offset = 0;
    push();
    
    fill(255, 0, 0);
    for(i = 0; i < lives; i++)
    {
        heart(width-150+offset, 20, 18);
        offset += 30;        
    }
    pop();
}

//Function to draw Hearts.
function heart(x, y, size) 
{
    x_pos = x;
    y_pos = y;
    beginShape();
    vertex(x_pos, y_pos);
    bezierVertex(x_pos - size / 2, y_pos - size / 2, x_pos - size, y_pos + size / 3, x_pos, y_pos + size);
    bezierVertex(x_pos + size, y_pos + size / 3, x_pos + size / 2, y_pos - size / 2, x_pos, y_pos);
    endShape(CLOSE);
}

// ----------------------------------
// Platforms draw and check functions
// ----------------------------------
function drawPlatform(t_platform)
{
    x = t_platform.x_pos;
    y = t_platform.y_pos;
    
    push();
    stroke(0);
    strokeWeight(2);
    fill(175, 104, 20);
    
    for (var i = 0; i < t_platform.size; i++)
    {
        rect(x, y, 25, 5);
        x += 25;
    }
    
    y += 5;
    x = t_platform.x_pos;
    
    for (var i = 0; i <= t_platform.size; i++)
    {
        if (i == 0 || i == (t_platform.size))
        {
            rect(x, y, 12.5, 5);
            x += 12.5;
        }
        else
        {
            rect(x, y, 25, 5);
            x += 25;
        }
    }
    pop();
}

function checkPlatform()
{
    for (var i = 0; i < platforms.length; i++)
    {
        if (((gameChar_world_x > platforms[i].x_pos) && (gameChar_world_x <= (platforms[i].x_pos+(platforms[i].size * 25)))) && (gameChar_y == (platforms[i].y_pos+1)))
        {
            return (true);
        }
    }
    return (false);
}

// ----------------------------------
// Enemies Drawing & Checking Functions
// ----------------------------------
  
//Bullet Enemy
function drawBulletEnemies(t_bullet)
{
    t_bullet.x_pos -= t_bullet.speed; // Decreases x_pos to make Bullet fly across the word.
    
    if (t_bullet.x_pos <= -1300) //Resets Bullet Positioning if has reached the defined boundries.
        t_bullet.x_pos = 3500;
    
    
    x = t_bullet.x_pos;
    y = t_bullet.y_pos;
    size = t_bullet.size;
    push();
    
    if (t_bullet.deadly)
        fill(170, 13, 0);
    else
        fill(0); 
    first_part = {
        x: x,
        y: y,
        width: 25 * size,
        height: 25 * size
      };

    rect(first_part.x, first_part.y, first_part.width, first_part.height, 360, 0, 0, 360);

    fill(10); 
    second_part = {
        x: x + (25 * size),
        y: y + (2.5 * size),
        width: 4 * size,
        height: 20 * size
      };

    rect(second_part.x, second_part.y, second_part.width, second_part.height);
    fill(0);
    third_part = {
                    x: (x + (25 * size) + 4 * size),
                    y: y,
                    width: 2 * size,
                    height: 25 * size
                };
    rect(third_part.x, third_part.y, third_part.width, third_part.height);


    eyes_blank = {
        x_pos: x + (8.5 * size),
        y_pos: y + (6.5 * size),
        width: 8 * size,
        height: 9 * size
      };

      fill(255);
      arc(eyes_blank.x_pos, eyes_blank.y_pos, eyes_blank.width,
        eyes_blank.height, -HALF_PI + QUARTER_PI, PI + -QUARTER_PI, CHORD);

      eyes_pupil = {
        x_pos: x + (8.5 * size),
        y_pos: y + (6.5 * size),
        width: 3 * size,
        height: 4.5 * size
      };

      
      fill(0);
      arc(eyes_pupil.x_pos, eyes_pupil.y_pos, eyes_pupil.width,
        eyes_pupil.height, -HALF_PI + QUARTER_PI, PI + -QUARTER_PI, CHORD);

      fill(255, 0, 0);
      mouth = {
        x_pos: x * 3,
        y_pos: y * 2.6
      };

      beginShape();
      vertex(x + (2.5 * size), y + (20 * size));
      bezierVertex( x + (10 * size), y + (10 * size),
                    x + (13 * size), y + (22 * size),
                    x + (6 * size), y + (23 * size));
      endShape();
      pop();

    
    t_bullet.center_x = x + ( (first_part.width + second_part.width + third_part.width) / 2); 
    t_bullet.center_y = y + ( first_part.height / 2); 
    
    checkBulletEnemies(t_bullet); //Check bullet object collision.
}

function checkBulletEnemies(t_bullet)
{
    d = dist(gameChar_world_x, gameChar_y-25, t_bullet.center_x, t_bullet.center_y);
    
    if (t_bullet.size == 1)
        proximity = 35;
    else if (t_bullet.size == 2)
        proximity = 55;
    else if (t_bullet.size == 3)
        proximity = 65;
    
    if (d <= proximity)
    {
        stopGameMusic();
        gameSounds.bullet_hit.play();
        lives--;
        startGame();
    }
}

function stopGameMusic()
{
        gameSounds.level.pause();
        gameSounds.level_complete.pause();
        gameSounds.bullet_hit.pause(); 
        gameSounds.collected.pause(); 
        gameSounds.died.pause(); 
        gameSounds.game_over.pause();
        gameSounds.jumped.pause(); 
}

function waitSongFinish(sound)
{

}

function startGame()
{ 
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    treePos_y = height/2;
    isFalling = false;
    isPlummeting = false;
    on_platform = false;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    clouds = [
        {x_pos: 100, y_pos: 200, size: 1},
        {x_pos: 600, y_pos: 100, size: 1},
        {x_pos: 800, y_pos: 200, size: 1},
        {x_pos: 1100, y_pos: 150, size: 1},
        {x_pos: 1500, y_pos: 100, size: 1},
        {x_pos: 2100, y_pos: 75, size: 1.20} 
    ];
    
    mountains = [
        {x_pos: 100, size:1.75 },
        {x_pos: 1000, size: 1.2 },
        {x_pos: 2300, size:2 }
    ];
    
    trees_x = [100, 600, 1500, 2200];
    
    collectables = [
        {x_pos: -400, y_pos: floorPos_y - 5, size: 50, isFound: false},
        {x_pos: -500, y_pos: floorPos_y - 5, size: 60, isFound: false},
        {x_pos: -600, y_pos: floorPos_y - 5, size: 70, isFound: false},
        {x_pos: -700, y_pos: floorPos_y - 5, size: 80, isFound: false},
        {x_pos: 2700, y_pos: floorPos_y - 75, size: 100, isFound: false},
        {x_pos: 2840, y_pos: floorPos_y - 230, size: 50, isFound: false}
    ];

    canyons = [
        {x_pos: -1000, width: 200},
        {x_pos: -350, width: 120},
        {x_pos: 740, width: 130},
        {x_pos: 1650, width: 500}
    ];
    
    game_score = 0;
    
    flagpole = {isReached: false, x_pos: 3200};
    
    platforms = [
        {x_pos:500, y_pos: floorPos_y-37 , size: 4},
        {x_pos:1750, y_pos: floorPos_y-37 , size: 2},
        {x_pos:1900, y_pos: floorPos_y-37 , size: 3},
        {x_pos:2700, y_pos: floorPos_y-91 , size: 4},
        {x_pos:2810, y_pos: floorPos_y-175 , size: 2}
    ];
    
    bullet_enemy = [
        {x_pos: 2000, y_pos: floorPos_y-20, size: 1, speed: 3.5, center_x: null, center_y: null},
        {x_pos: 2500, y_pos: floorPos_y-30, size: 2, speed: 2.5, center_x: null, center_y: null},
        {x_pos: 2500, y_pos: floorPos_y-30, size: 3,  speed: 1.5, center_x: null, center_y: null},
        {x_pos: 2500, y_pos: floorPos_y-20, size: 1, speed: 7, center_x: null, center_y: null, deadly: true}
    ];
    
    loop();
}