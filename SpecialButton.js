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

function SpecialButton(x, y, width, height, maxTimer){
    // Call the Entity constructor
    Entity.call(this, x, y, width, height, "#00B05B", true, false, false);
    
    // Set members from parameters
    this.maxTimer = maxTimer;
    
    // Set the timer
    this.timer = 0;
    
    // Set the can fire boolean
    this.canFire = false;
    
    // Timer text
    this.timerText = new Kinetic.Text({
        fontSize: 12,
        fontFamily: "monospace",
        fill: "black"
    });
    Game.kineticMainLayer.add(this.timerText);
}

SpecialButton.prototype = Object.create(Entity.prototype);

// Loop method, inherited from Entity
SpecialButton.prototype.loop = function(){
    // Call Entity loop method
    Entity.prototype.loop.call(this);
    
    // Decrease the timer
    if(this.timer > 0){
        this.timer--;
    }
    
    // Move the text to the top and set its text
    this.timerText.moveToTop();
    this.timerText.text("\
Touch to\n\
activate" + (this.timer > 0? ("\n in " + this.timer) : ""));
    
    // We can't fire by default
    this.canFire = false;
};

// Hit method, inherited from Entity
SpecialButton.prototype.hit = function(entity){
    // If the entity we are hitting is the player and the timer is ready
    if(entity === Game.player && this.timer == 0){
        // We can fire special missiles
        this.canFire = true;
        
        // Reset the timer
        this.timer = this.maxTimer;
    }
};
