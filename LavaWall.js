/**
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2012 David "aniwey" L.
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

function LavaWall(x, y){
    // Call the Instakiller constructor
    Instakiller.call(this, x, y, 500, main.gameHeight - main.topBarHeight, "#CF0000", false, false, false, false);
    
    // Is it the end of the wall journey?
    this.end = false;
}

LavaWall.prototype = Object.create(Instakiller.prototype);

// Loop method, inherited from Instakiller
LavaWall.prototype.loop = function(){
    // Move to the right
    this.moveToTheRight();
    
    // Call Instakiller loop method
    Instakiller.prototype.loop.call(this);
};

// Hit method, inherited from Entity
LavaWall.prototype.hit = function(entity){
    // If it's not the end
    if(!this.end){
        // Call Instakiller hit method
        Instakiller.prototype.hit.call(this, entity);
    }
};

// Moving to the right method
LavaWall.prototype.moveToTheRight = function(){
    // Go slow
    if(Game.frameNumber < 80)
        this.xMovement += 1;
    // Accelerate!
    else if(Game.frameNumber < 100)
        this.xMovement += 2;
    else if(Game.frameNumber < 102)
        this.xMovement += 3;
    else if(Game.frameNumber < 104)
        this.xMovement += 4;
    else if(Game.frameNumber < 106)
        this.xMovement += 5;
    else if(Game.frameNumber < 108)
        this.xMovement += 6;
    else if(Game.frameNumber < 110)
        this.xMovement += 7;
    else if(Game.frameNumber < 112)
        this.xMovement += 8;
    else if(Game.frameNumber < 114)
        this.xMovement += 9;
    else if(Game.frameNumber < 116)
        this.xMovement += 10;
    else if(Game.frameNumber < 118)
        this.xMovement += 11;
    // Go fast
    else if(Game.frameNumber < 190)
        this.xMovement += 12;
    // Decelerate
    else if(Game.frameNumber < 186)
        this.xMovement += 11;
    else if(Game.frameNumber < 188)
        this.xMovement += 10;
    else if(Game.frameNumber < 190)
        this.xMovement += 9;
    else if(Game.frameNumber < 192)
        this.xMovement += 8;
    else if(Game.frameNumber < 194)
        this.xMovement += 7;
    else if(Game.frameNumber < 196)
        this.xMovement += 6;
    else if(Game.frameNumber < 198)
        this.xMovement += 5;
    else if(Game.frameNumber < 200)
        this.xMovement += 4;
    // Go slow
    else if(Game.frameNumber < 350)
        this.xMovement += 4;
    // Accelerate!
    else if(Game.frameNumber < 380)
        this.xMovement += 5;
    else if(Game.frameNumber < 385)
        this.xMovement += 6;
    else if(Game.frameNumber < 390)
        this.xMovement += 7;
    else if(Game.frameNumber < 395)
        this.xMovement += 8;
    else if(Game.frameNumber < 400)
        this.xMovement += 9;
    else if(Game.frameNumber < 405)
        this.xMovement += 10;
    else if(Game.frameNumber < 410)
        this.xMovement += 11;
    else if(Game.frameNumber < 415)
        this.xMovement += 12;
    else if(Game.frameNumber < 420)
        this.xMovement += 13;
    else if(Game.frameNumber < 425)
        this.xMovement += 14;
    else if(Game.frameNumber < 430)
        this.xMovement += 15;
    else if(Game.frameNumber < 435)
        this.xMovement += 16;
    else if(Game.frameNumber < 440)
        this.xMovement += 17;
    else if(Game.frameNumber < 445)
        this.xMovement += 18;
    else if(Game.frameNumber < 450)
        this.xMovement += 19;
    else if(Game.frameNumber < 455)
        this.xMovement += 20;
    else if(Game.frameNumber < 460)
        this.xMovement += 21;
    else if(Game.frameNumber < 465)
        this.xMovement += 22;
    else if(Game.frameNumber < 470)
        this.xMovement += 23;
    else if(Game.frameNumber < 475)
        this.xMovement += 24;
    else{
        this.end = true;
        Game.easyPartText.show();
    }
};


