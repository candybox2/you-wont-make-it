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

function HardcoreZone(x, y){
    // Call the Entity constructor
    Entity.call(this, x, y, 3040, 470, "rgb(221, 221, 221)", false, false, false, true);
    
    // Safe zone text
    this.safeZoneText = new Kinetic.Text({
        fontSize: 12,
        fontFamily: "monospace",
        fill: "black"
    });
    Game.kineticMainLayer.add(this.safeZoneText);
    this.safeZoneText.moveToTop();
    this.safeZoneText.hide();
    
    // Safe zone kinetic rectangle
    this.safeZoneKineticRectangle = new Kinetic.Rect({
        fill: "#C4B2B2"
    });
    Game.kineticMainLayer.add(this.safeZoneKineticRectangle);
    this.safeZoneKineticRectangle.moveToBottom();
    this.safeZoneKineticRectangle.hide();
    
    // Safe zones
    this.safeZones = [
        {x : 4300, y : 370, timer : 100, width : 180, height : 130},
        {x : 4500, y : 385, timer : 70, width : 120, height : 115},
        {x : 4700, y : 400, timer : 40, width : 60, height : 100},
        {x : 4817, y : 309, timer : 40, width : 45, height : 92},
        {x : 5062, y : 229, timer : 40, width : 45, height : 92},
        {x : 5048, y : 394, timer : 14, width : 45, height : 92},
        {x : 5139, y : 300, timer : 25, width : 45, height : 92},
        {x : 4754, y : 408, timer : 60, width : 45, height : 92},
        {x : 5041, y : 408, timer : 60, width : 45, height : 92},
        {x : 5223, y : 251, timer : 34, width : 45, height : 92},
        {x : 5223, y : 261, timer : 3, width : 45, height : 92},
        {x : 5223, y : 287, timer : 3, width : 45, height : 92},
        {x : 5223, y : 329, timer : 3, width : 45, height : 92},
        {x : 5223, y : 387, timer : 3, width : 45, height : 92},
        {x : 5223, y : 408, timer : 20, width : 45, height : 92},
        {x : 5342, y : 408, timer : 20, width : 45, height : 92},
        {x : 5468, y : 408, timer : 20, width : 45, height : 92},
        {x : 5615, y : 408, timer : 20, width : 45, height : 92},
        {x : 5727, y : 408, timer : 15, width : 45, height : 92},
        {x : 5804, y : 408, timer : 10, width : 45, height : 92},
        {x : 5846, y : 408, timer : 5, width : 45, height : 92},
        {x : 5804, y : 408, timer : 5, width : 45, height : 92},
        {x : 5727, y : 408, timer : 10, width : 45, height : 92},
        {x : 5615, y : 408, timer : 15, width : 45, height : 92},
        {x : 7064, y : 408, timer : 300, width : 45, height : 92}
    ];
    
    // Current safe zone index
    this.safeZoneIndex = 0;
    
    // Current safe zone timer
    this.safeZoneTimer = this.safeZones[this.safeZoneIndex].timer;
    
    // Is the hardcore zone shown already?
    this.shown = false;
}

HardcoreZone.prototype = Object.create(Entity.prototype);

// Loop method, inherited from Entity
HardcoreZone.prototype.loop = function(){
    // Possibly show the hardcore zone
    if(!this.shown && Game.player.x > 4058){
        this.shown = true;
        this.safeZoneText.show();
        this.safeZoneKineticRectangle.show();
    }
    
    // If the hardcore zone is shown
    if(this.shown){
        // Decrease the safe zone timer
        this.safeZoneTimer--;
        
        // If we're playing
        if(Game.gameState == GameState.PLAYING){
            // Possibly skip to the next safe zone
            if(this.safeZoneTimer < 0){
                this.safeZoneIndex++;
                if(this.safeZoneIndex >= this.safeZones.length) this.safeZoneIndex = 0;
                this.safeZoneTimer = this.safeZones[this.safeZoneIndex].timer;
            }
        }
        
        // Change the safe zone kinetic rectangle size and safe zone text
        this.safeZoneKineticRectangle.width(this.safeZones[this.safeZoneIndex].width);
        this.safeZoneKineticRectangle.height(this.safeZones[this.safeZoneIndex].height);
        this.safeZoneText.text("\
 This\n\
 will\n\
be the\n\
 only\n\
 safe\n\
 zone\n\
in " + (this.safeZoneTimer + 1));

        // Change the kinetic rectangle color
        this.kineticRectangle.fill("rgb(221, " + Math.floor(78 + 143 * (this.safeZoneTimer / this.safeZones[this.safeZoneIndex].timer)) + ", " + Math.floor(78 + 143 * (this.safeZoneTimer / this.safeZones[this.safeZoneIndex].timer)) + ")");
    }
}

// Hit method, inherited from Entity
HardcoreZone.prototype.hit = function(entity){
    // If the entity we are hitting is the player
    if(entity === Game.player){
        // If the timer is at 0 and player is out of the safe zone
        if(this.safeZoneTimer == 0 && this.playerOutOfSafeZone()){
            Game.gameOver();
            Game.player.die();
        }
    }
};

// Player out of safe zone?
HardcoreZone.prototype.playerOutOfSafeZone = function(){
    // Return false if the player is in the safe zone
    if(Game.player.x >= this.safeZones[this.safeZoneIndex].x &&
       Game.player.x + Game.player.kineticRectangle.width() <= this.safeZones[this.safeZoneIndex].x + this.safeZones[this.safeZoneIndex].width &&
       Game.player.y >= this.safeZones[this.safeZoneIndex].y &&
       Game.player.y + Game.player.kineticRectangle.height() <= this.safeZones[this.safeZoneIndex].y + this.safeZones[this.safeZoneIndex].height)
        return false;
    
    // Else return true
    return true;
};
