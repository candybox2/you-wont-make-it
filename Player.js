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

function Player(x, y){
    // Call the Entity constructor
    Entity.call(this, x, y, 45, 92, "#A69789", true, true, true);
    
    // Set the movement speed
    this.movementSpeed = 7;
    
    // Set the number of frames spent jumping
    this.framesSpentJumping = 0;
    
    // Set the maximum number of frames we can spend jumping
    this.maximumFramesWeCanSpendJumping = 15;
    
    // Set the jump speeds array
    this.jumpSpeedsArray = [20, 18, 17, 16, 15, 14, 13, 12, 11, 11, 10, 10, 9, 9, 8];
    
    // Did we jump last frame?
    this.jumpedLastFrame = false;
}

Player.prototype = Object.create(Entity.prototype);

// Loop method, inherited from Entity
Player.prototype.loop = function(){
    // By default, we didn't jump last frame
    this.jumpedLastFrame = false;
    
    // Move, depending on user input
    this.moveOnUserInput();
    
    // Call Entity loop method and get the entity loop report
    var entityLoopReport = Entity.prototype.loop.call(this);
    
    // Update the top bar current score
    TopBar.updateCurrentScore();
    
    // If there was a bottom collision
    if(entityLoopReport.entityMoveReport.bottomCollision){
        // We reset the number of frames spent jumping
        this.framesSpentJumping = 0;
    }
    // Else, if we didn't jump
    else if(!this.jumpedLastFrame){
        // We won't be able to jump anymore until getting a bottom collision again
        this.framesSpentJumping = this.maximumFramesWeCanSpendJumping;
    }
    
    // If we made it to the end (protip : won't happen)
    if(this.x + this.kineticRectangle.width() >= main.gameWidth && Game.gameState != GameState.WON) Game.won();
};

// Moving method
Player.prototype.moveOnUserInput = function(){
    // Booleans
    var moveLeft = false;
    var moveRight = false;
    var jump = false;
      
    // Iterate over active keys
    for(var i = 0; i < KeyboardJS.activeKeys().length; i++){
        switch(KeyboardJS.activeKeys()[i]){
            case 'left': case 'a': case 'q':
                moveLeft = true;
            break;
            case 'right': case 'd':
                moveRight = true;
            break;
            // Jump
            case 'up': case 'w': case 'z': case 'space':
                jump = true;
            break;
        }
    }
    
    // Move left
    if(moveLeft)
        this.xMovement -= (Game.gameState != GameState.WON? this.movementSpeed : 7);
    
    // Move right
    if(moveRight)
        this.xMovement += (Game.gameState != GameState.WON? this.movementSpeed : 7);
    
    // Jump
    if(jump){
        // If we didn't reach the maximum number of frames we can spend jumping yet
        if(this.framesSpentJumping < this.maximumFramesWeCanSpendJumping){
            // We jump
            this.yMovement -= this.jumpSpeedsArray[this.framesSpentJumping] * (Game.gameState != GameState.WON? 1 : 2);
            
            // We increase the number of frames spent jumping
            this.framesSpentJumping++;
            
            // We now jumped last frame
            this.jumpedLastFrame = true;
        }
    }
};

// Test collision with another entity
Player.prototype.testCollisionWithAnEntity = function(entity){
    // If we didn't won
    if(Game.gameState != GameState.WON){
        // Return the base class method
        return Entity.prototype.testCollisionWithAnEntity.call(this, entity);
    }
    // Else
    else{
        // Return false
        return false;
    }
};

// Get gravity force method, inherited from Entity
Player.prototype.getGravityForce = function(){
    // If we jumped last frame, we return 0
    if(this.jumpedLastFrame)
        return 0;
    // Else, we return the Entity method
    else
        return Entity.prototype.getGravityForce.call(this);
};
