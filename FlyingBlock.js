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

function FlyingBlock(x, y, xFlyingSpeed, yFlyingSpeed, width, height, maxStep, color){
    // Call the Instakiller constructor
    Instakiller.call(this, x, y, width, height, (color !== undefined? color : "#D7017A"), false, false, false, false);
    
    // Set members from parameters
    this.xFlyingSpeed = xFlyingSpeed;
    this.yFlyingSpeed = yFlyingSpeed;
    this.maxStep = maxStep;
    
    // Direction (are we going from (x1, y1) to (x2, y2) or the other way?)
    this.direction = true;
    
    // The current step
    this.step = 0;
}

FlyingBlock.prototype = Object.create(Instakiller.prototype);

// Empty loop method
FlyingBlock.prototype.loop = function(){
    // Move depending on the direction
    this.xMovement = (this.direction? 1 : -1) * this.xFlyingSpeed;
    this.yMovement = (this.direction? 1 : -1) * this.yFlyingSpeed;
    
    // Increment step
    this.step++;
    
    // Possibly invert the direction
    if(this.step >= this.maxStep){
        this.step = 0;
        this.direction = !this.direction;
    }
    
    // Call Instakiller loop method
    Instakiller.prototype.loop.call(this);
}



