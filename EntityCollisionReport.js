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

function EntityCollisionReport(){
    // Collision boolean, false by default
    this.collisionBoolean = false;
    
    // Collision with borders boolean, false by default
    this.collisionWithBordersBoolean = false;
    
    // Collision points minimum and maximum positions
    this.minimumXCollisionPoint = undefined;
    this.minimumYCollisionPoint = undefined;
    this.maximumXCollisionPoint = undefined;
    this.maximumYCollisionPoint = undefined;
    
    // List of entities we entered in collision with, empty by default
    this.entitiesList = new Array();
}

// Merge another collision report
EntityCollisionReport.prototype.merge = function(entityCollisionReport){
    // If the other collision report says there is a collision, then there is one
    if(entityCollisionReport.collisionBoolean)
        this.collisionBoolean = true;
        
    // If the other collision report says there is a collision with borders, then there is one
    if(entityCollisionReport.collisionWithBordersBoolean)
        this.collisionWithBordersBoolean = true;
        
    // Merge the other collision report collision points minimum and maximum positions
    if(entityCollisionReport.minimumXCollisionPoint !== undefined && (!this.minimumXCollisionPoint || entityCollisionReport.minimumXCollisionPoint < this.minimumXCollisionPoint))
        this.minimumXCollisionPoint = entityCollisionReport.minimumXCollisionPoint;
        
    if(entityCollisionReport.minimumYCollisionPoint !== undefined && (!this.minimumYCollisionPoint || entityCollisionReport.minimumYCollisionPoint < this.minimumYCollisionPoint))
        this.minimumYCollisionPoint = entityCollisionReport.minimumYCollisionPoint;
        
    if(entityCollisionReport.maximumXCollisionPoint !== undefined && (!this.maximumXCollisionPoint || entityCollisionReport.maximumXCollisionPoint > this.maximumXCollisionPoint))
        this.maximumXCollisionPoint = entityCollisionReport.maximumXCollisionPoint;
        
    if(entityCollisionReport.maximumYCollisionPoint !== undefined && (!this.maximumYCollisionPoint || entityCollisionReport.maximumYCollisionPoint > this.maximumYCollisionPoint))
        this.maximumYCollisionPoint = entityCollisionReport.maximumYCollisionPoint;
    
    // Merge the other collision report entities list
    var entitiesListWithDuplicates = this.entitiesList.concat(entityCollisionReport.entitiesList);
    
    // Remove duplicates from the resulting entities list
    entitiesListWithoutDuplicates = new Array();
    $.each(entitiesListWithDuplicates, function(i, element){
        if($.inArray(element, entitiesListWithoutDuplicates) === -1) entitiesListWithoutDuplicates.push(element);
    });
    
    this.entitiesList = entitiesListWithoutDuplicates;
};
