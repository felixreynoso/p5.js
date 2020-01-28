/*

The Game Project - Part 6 

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

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;    
    lives = 3;
    startGame();
}

function draw()
{
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

    //Draw
    renderFlagpole();
    pop(); 
    
    // Draw game character.
	drawGameChar();
   
    // Draw game score.
    fill(255);
    noStroke();
    text("score: " + game_score, 20, 20);
    checkPlayerDie();
    drawLives();

    // Game Over Behavior.
    if (lives < 1)
    {
        fill(0,0,255);
        textSize(18);
        text("Game over. Press space to continue.", width/3, height/2);
        return ;
    }
    
    // Level Complete Behavior.
    if (flagpole.isReached)
    {
        fill(245, 255, 0);
        textSize(18);
        text("Level complete. Press space to continue.", width/3, height/2);
        return ;
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
        gameChar_y += 2;
        isFalling = true;
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
	if (keyCode == 37)
        isLeft = true;
    if (keyCode == 39)
        isRight = true;
    if ((keyCode == 32) && (gameChar_y == floorPos_y))
    {
        gameChar_y -= 100;
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
        t_collectable.isFound = true;
        game_score++;
    }
}

// Function to draw flagpole.
function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y-250);
    noStroke();
    fill(250,0, 250);
    if (flagpole.isReached)
        rect(flagpole.x_pos,floorPos_y-250, 50, 50);
    else
    {   
        rect(flagpole.x_pos,floorPos_y-50, 50, 50);
        checkFlagpole();
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
        if (lives > 0)
        {   
            lives--;
            startGame();
        }
    }    
}

function drawLives()
{
    offset = 0;
    push();
    
    fill(255, 0, 0);
    for(i = 0; i < lives; i++)
    {
        ellipse(width-150+offset, 20, 15, 15);
        offset += 25;        
    }
    pop();
}

function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    treePos_y = height/2;
    isFalling = false;
    isPlummeting = false;

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
        {x_pos: 1900, size:2 }
    ];
    
    trees_x = [100, 600, 1500, 2000];
    
    collectables = [
        {x_pos: -400, y_pos: floorPos_y - 5, size: 50, isFound: false},
        {x_pos: -500, y_pos: floorPos_y - 5, size: 60, isFound: false},
        {x_pos: -600, y_pos: floorPos_y - 5, size: 70, isFound: false},
        {x_pos: -700, y_pos: floorPos_y - 5, size: 80, isFound: false},
        {x_pos: 2700, y_pos: floorPos_y - 75, size: 100, isFound: false}
    ];

    canyons = [
        {x_pos: 740, width: 100},
        {x_pos: -350, width: 75},
        {x_pos: 2250, width: 90}
    ];
    
    game_score = 0;
    
    flagpole = {isReached: false, x_pos: 2950};
}