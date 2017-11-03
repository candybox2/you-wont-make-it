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

function MissileLauncher(x, y, size, defaultLaunchingDirection, fragileMissiles){
    // Call the Entity constructor
    Entity.call(this, x, y, size, size, "#E86217", true, false, true);
    
    // Set members from parameters
    this.size = size;
    this.defaultLaunchingDirection = defaultLaunchingDirection;
    this.fragileMissiles = fragileMissiles;
}

MissileLauncher.prototype = Object.create(Entity.prototype);

// Loop method, inherited from Entity
MissileLauncher.prototype.loop = function(){
    // If we should launch a missile
    if(this.shouldLaunchMissile()){
        // Get the new missile
        var missile = this.getNewMissile();
            
        // If it is't null
        if(missile != null){
            // Add it
            Game.addEntity(missile);
        }
    }
    
    // Call Entity loop method
    Entity.prototype.loop.call(this);
};

// Should we launch a missile?
MissileLauncher.prototype.shouldLaunchMissile = function(){
    return false;
};

// Get the launching direction
MissileLauncher.prototype.getLaunchingDirection = function(){
    return this.defaultLaunchingDirection;
};

// Get the missile color
MissileLauncher.prototype.getMissileColor = function(){
    return "#E8A300";
};

// Get the missile speed
MissileLauncher.prototype.getMissileSpeed = function(){
    return 10;
};

// Get the missile other speed
MissileLauncher.prototype.getMissileOtherSpeed = function(){
    return 0;
};

// Are new missiles affected by gravity?
MissileLauncher.prototype.areNewMissilesAffectedByGravity = function(){
    return false;
};

// Get a new missile
MissileLauncher.prototype.getNewMissile = function(){
    // Get the launching direction
    var launchingDirection = this.getLaunchingDirection()
    
    // If the launching direction isn't undefined
    if(launchingDirection !== undefined){
        // Create a different missile, depending on the direction
        var missile;
        switch(launchingDirection){
            case Direction.TOP:
                missile = new Instakiller(this.x, this.y - this.size, this.size, this.size, this.getMissileColor(), true, this.areNewMissilesAffectedByGravity(), this.fragileMissiles, this.fragileMissiles);
                missile.ySpeed -= this.getMissileSpeed();
                missile.xSpeed += this.getMissileOtherSpeed();
            break;
            case Direction.BOTTOM:
                missile = new Instakiller(this.x, this.y + this.size, this.size, this.size, this.getMissileColor(), true, this.areNewMissilesAffectedByGravity(), this.fragileMissiles, this.fragileMissiles);
                missile.ySpeed += this.getMissileSpeed();
                missile.xSpeed += this.getMissileOtherSpeed();
            break;
            case Direction.RIGHT:
                missile = new Instakiller(this.x + this.size, this.y, this.size, this.size, this.getMissileColor(), true, this.areNewMissilesAffectedByGravity(), this.fragileMissiles, this.fragileMissiles);
                missile.xSpeed += this.getMissileSpeed();
                missile.ySpeed += this.getMissileOtherSpeed();
            break;
            case Direction.LEFT:
                missile = new Instakiller(this.x - this.size, this.y, this.size, this.size, this.getMissileColor(), true, this.areNewMissilesAffectedByGravity(), this.fragileMissiles, this.fragileMissiles);
                missile.xSpeed -= this.getMissileSpeed();
                missile.ySpeed += this.getMissileOtherSpeed();
            break;
        }
        
        // Return it
        return missile;
    }
    
    // Else, return null
    return null;
};
