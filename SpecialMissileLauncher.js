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

function SpecialMissileLauncher(x, y, size, defaultLaunchingDirection, launcherID){
    // Call the MissileLauncher constructor
    MissileLauncher.call(this, x, y, size, defaultLaunchingDirection, true);
    
    // Set members from parameters
    this.launcherID = launcherID;
};

SpecialMissileLauncher.prototype = Object.create(MissileLauncher.prototype);

// Should we launch a missile?
SpecialMissileLauncher.prototype.shouldLaunchMissile = function(){
    // If the special button says we can fire return true
    return Game.specialButton.canFire;
};

// Get the missile speed
MissileLauncher.prototype.getMissileSpeed = function(){
    if(Game.specialButton.canFire){
        switch(Game.destroyableWall.currentBuildingSize){
            case 25: return 30; break;
            case 50: return 30; break;
            case 75:
                if(this.launcherID <= 4) return 45;
                else return 24;
            break;
        }
    }
    
    // Return 10 by default
    return 10;
};

// Get the missile other speed
SpecialMissileLauncher.prototype.getMissileOtherSpeed = function(){
    if(Game.specialButton.canFire){
        switch(Game.destroyableWall.currentBuildingSize){
            case 25:
                return 15;
            break;
            case 50:
                switch(this.launcherID){
                    case 0: return 2; break;
                    case 1: return 2; break;
                    case 2: return 2; break;
                    case 4: return 10; break;
                    case 5: return -2; break;
                    case 6: return -2; break;
                    case 7: return -2; break;
                }
            break;
            case 75:
                if(this.launcherID <= 4) return 12;
            break;
        }
    }
    
    // Return 0 by default
    return 0;
};

