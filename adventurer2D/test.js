var gameSounds;
var mySound;


function preload() {
    soundFormats('mp3'); 
    mySound =  loadSound('https://adventurer2d.s3.ca-central-1.amazonaws.com/assets/sound_files/level_sound.mp3');

    
}


function setup()
{
    
    createCanvas(1024, 576);
    background(250,0,0);
}

function draw()
{
    console.log(mySound.isPlaying());
}

function keyPressed()
{
    mySound.play();
}
function mousePressed()
{
    mySound.pause();
}