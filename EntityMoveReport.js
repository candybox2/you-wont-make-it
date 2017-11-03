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

function EntityMoveReport(){
    // Entity collision report
    this.entityCollisionReport = undefined;
    
    // Collision booleans for the different sides
    this.leftCollision = false;
    this.rightCollision = false;
    this.topCollision = false;
    this.bottomCollision = false;
}

// Merge another move report
EntityMoveReport.prototype.merge = function(entityMoveReport){
    // If both move reports have collision reports
    if(this.entityCollisionReport && entityMoveReport.entityCollisionReport){
        // Merge the collision reports
        this.entityCollisionReport.merge(entityMoveReport.entityCollisionReport);
    }
    // Else, if we don't have a collision report, take the other one
    else if(!this.entityCollisionReport){
        this.entityCollisionReport = entityMoveReport.entityCollisionReport;
    }
    
    // Merge collision booleans for the different sides
    if(entityMoveReport.leftCollision)
        this.leftCollision = true;
        
    if(entityMoveReport.rightCollision)
        this.rightCollision = true;
        
    if(entityMoveReport.topCollision)
        this.topCollision = true;
        
    if(entityMoveReport.bottomCollision)
        this.bottomCollision = true;
};
