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

function MultipleModuloMissileLauncher(x, y, size, defaultLaunchingDirection, shiftList, modulo, doNotStartBefore, fragileMissiles){
    // Call the MissileLauncher constructor
    MissileLauncher.call(this, x, y, size, defaultLaunchingDirection, fragileMissiles);
    
    // Set members from parameters
    this.shiftList = shiftList;
    this.modulo = modulo;
    this.doNotStartBefore = doNotStartBefore;
};

MultipleModuloMissileLauncher.prototype = Object.create(MissileLauncher.prototype);

// Should we launch a missile?
MultipleModuloMissileLauncher.prototype.shouldLaunchMissile = function(){
    // If we won
    if(Game.gameState == GameState.WON){
        return ((Game.frameNumber % 8) == 0)
    }
    
    if(Game.frameNumber >= this.doNotStartBefore){
        // We launch a missile if one of the shift is satisfied
        for(var i = 0; i < this.shiftList.length; i++){
            if(Game.frameNumber % this.modulo == this.shiftList[i])
                return true;
        }
    }
    
    return false;
};


