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

function Entity(x, y, width, height, color, affectedByCollisions, affectedByGravity, canBeKilled, stuffCanGoThrough){
    // Set members from parameters
    this.x = x;
    this.y = y;
    this.affectedByCollisions = affectedByCollisions;
    this.affectedByGravity = affectedByGravity;
    this.canBeKilled = canBeKilled;
    this.stuffCanGoThrough = stuffCanGoThrough;
    
    // Last entity loop report
    this.lastEntityLoopReport = undefined;
    
    // Set the default speed
    this.xSpeed = 0;
    this.ySpeed = 0;
    
    // Set the default movement
    this.xMovement = 0;
    this.yMovement = 0;
    
    // Not dead by default
    this.dead = false;
    
    // Add the Kinetic rectangle of the entity
    this.kineticRectangle = new Kinetic.Rect({
        x: x - Game.viewportXOffset,
        y: y,
        width: width,
        height: height,
        fill: color
    });
}

// Test collision with another entity
Entity.prototype.testCollisionWithAnEntity = function(entity){
    // Return false if there is no collision
    if(this.x + this.kineticRectangle.width() <= entity.x)
        return false;
        
    if(this.x >= entity.x + entity.kineticRectangle.width())
        return false;
        
    if(this.y + this.kineticRectangle.height() <= entity.y)
        return false;
        
    if(this.y >= entity.y + entity.kineticRectangle.height())
        return false;
    
    // Collision, return true
    return true;
};

// Get a collision report with another entity
Entity.prototype.getCollisionReportWithAnEntity = function(entity){
    // Create the entity collision report
    var entityCollisionReport = new EntityCollisionReport();
    
    // If there is a collision
    if(this.testCollisionWithAnEntity(entity)){
        // Add the entity to the entity collision report entities list
        entityCollisionReport.entitiesList.push(entity);
    
        // Unless we can go through it
        if(!entity.stuffCanGoThrough){
            // Set the entity collision report collision boolean
            entityCollisionReport.collisionBoolean = true;
            
            // Set the entity collision report collision points minimum and maximum positions
            if(!entityCollisionReport.minimumXCollisionPoint || entity.x < entityCollisionReport.minimumXCollisionPoint)
                entityCollisionReport.minimumXCollisionPoint = entity.x;

            if(!entityCollisionReport.minimumYCollisionPoint || entity.y < entityCollisionReport.minimumYCollisionPoint)
                entityCollisionReport.minimumYCollisionPoint = entity.y;
                
            if(!entityCollisionReport.maximumXCollisionPoint || entity.x + entity.kineticRectangle.width() > entityCollisionReport.maximumXCollisionPoint)
                entityCollisionReport.maximumXCollisionPoint = entity.x + entity.kineticRectangle.width();

            if(!entityCollisionReport.maximumYCollisionPoint || entity.y + entity.kineticRectangle.height() > entityCollisionReport.maximumYCollisionPoint)
                entityCollisionReport.maximumYCollisionPoint = entity.y + entity.kineticRectangle.height();
        }
    }
    
    // Return the entity collision report
    return entityCollisionReport;
};

// Loop method
Entity.prototype.loop = function(){
    // Create the entity loop report
    var entityLoopReport = new EntityLoopReport();
    
    // Apply gravity on our speed
    this.ySpeed += this.getGravityForce();
    
    // If the entity should move
    if(this.xSpeed + this.xMovement != 0 || this.ySpeed + this.yMovement != 0){
        // Move the entity depending on its speed
        entityLoopReport.entityMoveReport = this.move();
        
        // Reset speed depending on the move report
        if(entityLoopReport.entityMoveReport.leftCollision || entityLoopReport.entityMoveReport.rightCollision)
            this.xSpeed = 0;
            
        if(entityLoopReport.entityMoveReport.topCollision || entityLoopReport.entityMoveReport.bottomCollision)
            this.ySpeed = 0;
    }
    
    // Store the new entity loop report as the last entity loop report
    this.lastEntityLoopReport = entityLoopReport;
    
    // Return the entity loop report
    return entityLoopReport;
};

// Moving method
Entity.prototype.move = function(){
    // Create the entity move report
    var entityMoveReport = new EntityMoveReport();

    // If we're not dead
    if(!this.dead){
        // Move along x
        if(this.xSpeed + this.xMovement != 0)
            entityMoveReport.merge(this.moveAlongX());
    }

    // If we're not dead
    if(!this.dead){
        // Move along y
        if(this.ySpeed + this.yMovement != 0)
            entityMoveReport.merge(this.moveAlongY());
    }
        
    // Reset the movement
    this.xMovement = 0;
    this.yMovement = 0;
        
    // Return the entity move report
    return entityMoveReport;
};

// Move along x
Entity.prototype.moveAlongX = function(){
    // Create the entity move report
    var entityMoveReport = new EntityMoveReport();
    
    // Move
    this.x += (this.xSpeed + this.xMovement) * (Game.gameState == GameState.WON? Math.random() * 20 : 1);
    
    // Get the collision report
    entityMoveReport.entityCollisionReport = Game.getEntityFullCollisionReport(this);
    
    // If we are affected by collisions and there is a collision
    if(this.affectedByCollisions && entityMoveReport.entityCollisionReport.collisionBoolean){
        // If we were moving to the right
        if(this.xSpeed + this.xMovement > 0){
            // Set the new x position and note that there was a right collision
            this.x = entityMoveReport.entityCollisionReport.minimumXCollisionPoint - this.kineticRectangle.width();
            entityMoveReport.rightCollision = true;
        }
        // Else, we were moving to the left
        else{
            // Set the new x position and note that there was a left collision
            this.x = entityMoveReport.entityCollisionReport.maximumXCollisionPoint;
            entityMoveReport.leftCollision = true;
        }
    }
    
    // If we have a collision report
    if(entityMoveReport.entityCollisionReport){
        // Get hit by and hit all entities listed in the collision report
        for(var i = 0; i < entityMoveReport.entityCollisionReport.entitiesList.length; i++){
            entityMoveReport.entityCollisionReport.entitiesList[i].hit(this);
            this.hit(entityMoveReport.entityCollisionReport.entitiesList[i]);
        }
    }
    
    // Return the entity move report
    return entityMoveReport;
};

// Move along y
Entity.prototype.moveAlongY = function(){
    // Create the entity move report
    var entityMoveReport = new EntityMoveReport();
    
    // Move
    this.y += (this.ySpeed + this.yMovement) * (Game.gameState == GameState.WON? Math.random() * 20 : 1);
    
    // Get the collision report
    entityMoveReport.entityCollisionReport = Game.getEntityFullCollisionReport(this);
    
    // If we are affected by collisions and there is a collision
    if(this.affectedByCollisions && entityMoveReport.entityCollisionReport.collisionBoolean){
        // If we were moving to the bottom
        if(this.ySpeed + this.yMovement > 0){
            // Set the new y position and note that there was a bottom collision
            this.y = entityMoveReport.entityCollisionReport.minimumYCollisionPoint - this.kineticRectangle.height();
            entityMoveReport.bottomCollision = true;
        }
        // Else, we were moving to the top
        else{
            // Set the new y position and note that there was a top collision
            this.y = entityMoveReport.entityCollisionReport.maximumYCollisionPoint;
            entityMoveReport.topCollision = true;
        }
    }
    
    // If we have a collision report
    if(entityMoveReport.entityCollisionReport){
        // Get hit by and hit all entities listed in the collision report
        for(var i = 0; i < entityMoveReport.entityCollisionReport.entitiesList.length; i++){
            entityMoveReport.entityCollisionReport.entitiesList[i].hit(this);
            this.hit(entityMoveReport.entityCollisionReport.entitiesList[i]);
        }
    }
    
    // Return the entity move report
    return entityMoveReport;
};

// Hitting method
Entity.prototype.hit = function(entity){
    
};

// Get the gravity force applied to the entity
Entity.prototype.getGravityForce = function(){
    if(this.affectedByGravity)
        return Game.gravityForce;
    else
        return 0;
};

// Die
Entity.prototype.die = function(){
    // We set ourselves dead so that the Game can remove us
    this.dead = true;
    
    // We remove our rectangle from the main layer if we're still playing
    if(Game.gameState === GameState.PLAYING)
        this.kineticRectangle.remove();
}
