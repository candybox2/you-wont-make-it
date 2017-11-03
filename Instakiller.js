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

function Instakiller(x, y, width, height, color, affectedByCollisions, affectedByGravity, canBeKilled, fragile){
    // Call the Entity constructor
    Entity.call(this, x, y, width, height, color, affectedByCollisions, affectedByGravity, canBeKilled);
    
    // Set members from parameters
    this.fragile = fragile;
    
    // Get a collision report just to check if we spawned on the player
    var entityCollisionReport = Game.getEntityFullCollisionReport(this);
    for(var i = 0; i < entityCollisionReport.entitiesList.length; i++){
        // If we appeared on the player
        if(entityCollisionReport.entitiesList[i] == Game.player && Game.gameState != GameState.WON){
            // Game over and kill everyone
            Game.gameOver();
            Game.player.die();
            this.die();
        }
    }
}

Instakiller.prototype = Object.create(Entity.prototype);

// Loop method, inherited from Entity
Instakiller.prototype.loop = function(){
    // Call Entity loop method and get the entity loop report
    var entityLoopReport = Entity.prototype.loop.call(this);
    
    // If there was a collision with borders and we are fragile, we die
    if(entityLoopReport.entityMoveReport !== undefined &&
       entityLoopReport.entityMoveReport.entityCollisionReport !== undefined &&
       entityLoopReport.entityMoveReport.entityCollisionReport.collisionWithBordersBoolean &&
       this.fragile){
        this.die();
    }
};

// Hit method, inherited from Entity
Instakiller.prototype.hit = function(entity){
    // If the entity we are hitting is the player
    if(entity === Game.player && Game.gameState != GameState.WON){
        Game.gameOver();
        this.die();
    }

    // If the entity can be killed
    if(entity.canBeKilled && Game.gameState != GameState.WON){
        // It dies
        entity.die();
    }
    
    // If we are fragile
    if(this.fragile){
        // We die
        this.die();
    }
};
