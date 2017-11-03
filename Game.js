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

var Game = {
    // Kinetic specific variables
    kineticStage : undefined,
    kineticMainLayer : undefined,
    
    // Frame number
    frameNumber : undefined,
    
    // Viewport x offset
    viewportXOffset : 0,
    
    // Physical constants
    gravityForce : 1,
    
    // Entities list
    entitiesList : undefined,
    
    // The player
    player : undefined,
    
    // Game state
    gameState : undefined,
    
    // Game loop interval ID
    gameLoopIntervalID : undefined,
    
    // Easy part text
    easyPartText : undefined,
    
    // Hardcore zone
    hardcoreZone : undefined,
    
    // Special button
    specialButton : undefined,
    
    // The destroyable wall
    destroyableWall : undefined,
    
    // Number of deaths
    numberOfDeaths : 0,
    
    // Title
    title : "You won't make it.    Don't even bother. Let me tell you a little story... it's the story of a man who was incredibly skilled at platform games. No game could resist his skill. Then he tried this one. And...     he didn't make it. Just like you won't.       Did you know you already died 291 times? Was it worth it?                         Did you at least make it till the elephant boss? Until this boss it should be pretty easy.     Maybe you should take a little break? Like, go outside, eat a snack, then come back, fresh, ready, and continue not making it again?       Well. You're a bit stubborn. I'll give you a hint. Just press 'Y' to become immune to all damage. You might have to press it a few times for it to work. If it still doesn't work, try rebooting your computer? I don't know. It could work. And we could have this whole conversation over again.                                                                                                                                                 You won't make it.                                                                                                                                                                                                                                                                                                                      LOL",

    // Called when the game is loaded
    onload : function(){
        // Create the kinetic stage
        this.kineticStage = new Kinetic.Stage({
            container: 'container',
            height: main.gameHeight
        });
        
        // Restart the game
        this.restart();
        
        // Call the top bar onload method
        TopBar.onload();
    },
    
    // Called when the window is resized
    onresize : function(){
        // Reset the kinetic stage width
        this.resetKineticStageWidth();
        
        // Call the top bar on resize method
        TopBar.onresize();
    },
    
    // Reset the kinetic stage width
    resetKineticStageWidth : function(){
        // If the kinetic stage width is different from the window width
        if(this.kineticStage.getWidth() != window.innerWidth){
            // Set it from the window width
            this.kineticStage.setWidth(window.innerWidth);
            
            // Also recalculate the viewport x offset
            this.calculateViewportXOffset();
        }
    },
    
    // Calculate the viewport x offset
    calculateViewportXOffset : function(){
        // The viewport x offset is calculated so that the character stays at 2/8 of the screen
        this.viewportXOffset = (this.player !== undefined? this.player.x : 0) - Math.floor((2/8) * this.kineticStage.getWidth());
        
        // Correct the viewport so that it doesn't go outside the game bounds
        if(this.viewportXOffset < 0)
            this.viewportXOffset = 0;
            
        if(this.viewportXOffset > main.gameWidth - this.kineticStage.getWidth()){
            this.viewportXOffset = main.gameWidth - this.kineticStage.getWidth();
        }
    },
    
    // Add an antity
    addEntity : function(entity){
        // Add the entity to the entities list
         this.entitiesList.push(entity);
        
        // Add the entity to the main layer
        Game.kineticMainLayer.add(entity.kineticRectangle);
    },
    
    // Get a collision report for an entity with other entities and game borders
    getEntityFullCollisionReport : function(entity){
        // Create the entity collision report
        var entityCollisionReport = new EntityCollisionReport();
        
        // Test the collision with all other entities
        for(var i = 0; i < this.entitiesList.length; i++){
            // If it isn't the entity itself
            if(this.entitiesList[i] != entity){
                // Merge the entity collision report
                entityCollisionReport.merge(entity.getCollisionReportWithAnEntity(this.entitiesList[i]));
            }
        }
            
        // Merge the entity collision report with game borders
        entityCollisionReport.merge(this.getEntityCollisionReportWithBorders(entity));
        
        // Return the entity collision report
        return entityCollisionReport;
    },
    
    // Get a collision report for an entity with game borders
    getEntityCollisionReportWithBorders : function(entity){
        // Create the entity collision report
        var entityCollisionReport = new EntityCollisionReport();
        
        // Test the collision with the game borders
        if(entity.x < 0){
            entityCollisionReport.collisionBoolean = true;
            entityCollisionReport.collisionWithBordersBoolean = true;
            entityCollisionReport.maximumXCollisionPoint = 0;
        }
            
        if(entity.y < main.topBarHeight){
            entityCollisionReport.collisionBoolean = true;
            entityCollisionReport.collisionWithBordersBoolean = true;
            entityCollisionReport.maximumYCollisionPoint = main.topBarHeight;
        }
            
        if(entity.x + entity.kineticRectangle.width() > main.gameWidth){
            entityCollisionReport.collisionBoolean = true;
            entityCollisionReport.collisionWithBordersBoolean = true;
            entityCollisionReport.minimumXCollisionPoint = main.gameWidth;
        }
            
        if(entity.y + entity.kineticRectangle.height() > main.gameHeight){
            entityCollisionReport.collisionBoolean = true;
            entityCollisionReport.collisionWithBordersBoolean = true;
            entityCollisionReport.minimumYCollisionPoint = main.gameHeight;
        }
        
        // Return the entity collision report
        return entityCollisionReport;
    },
    
    // The game loop
    loop : function(){
        // Call each entity loop method on a newly copied list (because the stored list will be modified by entities)
        var copiedEntitiesList = this.entitiesList.slice();
        for(var i = 0; i < copiedEntitiesList.length; i++){
            copiedEntitiesList[i].loop();
        }
        
        // Recalculate the viewport x offset
        this.calculateViewportXOffset();
        
        // Iterate over entities
        for(var i = 0; i < this.entitiesList.length; i++){
            // Apply the new position on the kinetic rectangle, taking into account the viewport offset
            this.entitiesList[i].kineticRectangle.x(this.entitiesList[i].x - this.viewportXOffset);
            this.entitiesList[i].kineticRectangle.y(this.entitiesList[i].y);
        }
        
        // We won?!
        if(Game.gameState == GameState.WON){
            for(var i = 0; i < this.entitiesList.length; i++){
                if((this.frameNumber % 4) == 0){
                    // Possibly randomly change the color
                    this.entitiesList[i].kineticRectangle.fill("rgba(" + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ", " + (0.3 + Math.random() * 0.5) + ")");
                }
            }
        }
        
        // Set the easy part text position
        this.easyPartText.x(3200 - this.viewportXOffset);
        this.easyPartText.y(50);
        
        // Set the hardcore zone stuff position
        this.hardcoreZone.safeZoneKineticRectangle.x(this.hardcoreZone.safeZones[this.hardcoreZone.safeZoneIndex].x - this.viewportXOffset);
        this.hardcoreZone.safeZoneKineticRectangle.y(this.hardcoreZone.safeZones[this.hardcoreZone.safeZoneIndex].y);
        this.hardcoreZone.safeZoneText.x(this.hardcoreZone.safeZones[this.hardcoreZone.safeZoneIndex].x - this.viewportXOffset + 4 + Math.floor((this.hardcoreZone.safeZones[this.hardcoreZone.safeZoneIndex].width - 50)/2));
        this.hardcoreZone.safeZoneText.y(this.hardcoreZone.safeZones[this.hardcoreZone.safeZoneIndex].y + 5 + Math.floor((this.hardcoreZone.safeZones[this.hardcoreZone.safeZoneIndex].height - 90)/2));
        
        // Set the special button timer test position
        this.specialButton.timerText.x(this.specialButton.x - this.viewportXOffset + 5);
        this.specialButton.timerText.y(this.specialButton.y + 20);
               
        // Re draw the main layer
        this.kineticMainLayer.draw();
        
        // Remove dead entities
        for(var i = 0; i < this.entitiesList.length; i++){
            if(this.entitiesList[i].dead){
                this.entitiesList.splice(i, 1);
                i--;
            }
        }
        
        // Increase the frame number
        this.frameNumber += 1;
    },
    
    // Initialize the game
    initialize : function(){
        // Set the frame number
        this.frameNumber = 0;
        
        // If we didn't won yet
        if(this.gameState != GameState.WON){
            // Add the player
            this.player = new Player(50, 228);
            this.addEntity(this.player);
        }
        
        // Add the lava wall
        this.addEntity(new LavaWall(-500, 30));
        
        // Add the 3 first walls
        this.addEntity(new SimpleWall(0, 320, 230, 180, "#354868", true));
        this.addEntity(new SimpleWall(470, 260, 300, 240, "#354868", true));
        this.addEntity(new SimpleWall(960, 30, 400, 313, "#354868", true));
        
        // Add the 3 first missile launchers
        this.addEntity(new ModuloMissileLauncher(960, 130, 20, Direction.LEFT, 30, 70, 0, true));
        this.addEntity(new ModuloMissileLauncher(960, 220, 20, Direction.LEFT, 60, 70, 0, true));
        this.addEntity(new ModuloMissileLauncher(750, 480, 20, Direction.RIGHT, 12, 20, 80, true));
        
        // Add 3 other missile launchers
        this.addEntity(new ModuloMissileLauncher(1340, 50, 20, Direction.RIGHT, 43, 50, 150, true));
        this.addEntity(new ModuloMissileLauncher(1340, 130, 20, Direction.RIGHT, 33, 50, 150, true));
        this.addEntity(new ModuloMissileLauncher(1340, 210, 20, Direction.RIGHT, 23, 50, 150, true));
        this.addEntity(new ModuloMissileLauncher(1340, 290, 20, Direction.RIGHT, 13, 50, 150, true));
        
        // Add the stairs
        this.addEntity(new SimpleWall(1600, 350, 400, 150, "#354868", true));
        this.addEntity(new SimpleWall(1800, 200, 200, 150, "#354868", true));
        
        // Add the roof
        this.addEntity(new SimpleWall(2300, 30, 510, 50, "#354868", true));
        
        // Add missile launchers on the roof
        this.addEntity(new MultipleModuloMissileLauncher(2350, 60, 20, Direction.BOTTOM, [0, 10, 20, 30], 50, 250, true));
        this.addEntity(new MultipleModuloMissileLauncher(2475, 60, 20, Direction.BOTTOM, [0, 10, 30, 40], 50, 250, true));
        
        // Add missile launchers
        this.addEntity(new ModuloMissileLauncher(1980, 410, 20, Direction.RIGHT, 10, 42, 210, true));
        this.addEntity(new ModuloMissileLauncher(1980, 440, 20, Direction.RIGHT, 15, 42, 210, true));
        this.addEntity(new ModuloMissileLauncher(1980, 470, 20, Direction.RIGHT, 20, 42, 210, true));
        
        // Add another wall to land on after the roof missiles
        this.addEntity(new SimpleWall(2510, 400, 300, 100, "#354868", true));
        
        // Add floating walls and their missiles
        this.addEntity(new SimpleWall(2750, 220, 70, 70, "#354868", true));
        this.addEntity(new ModuloMissileLauncher(2775, 220, 20, Direction.TOP, 13, 21, 315, true));
        this.addEntity(new ModuloMissileLauncher(2800, 245, 20, Direction.RIGHT, 5, 21, 315, true));
        this.addEntity(new ModuloMissileLauncher(2775, 270, 20, Direction.BOTTOM, 20, 21, 315, true));
        
        this.addEntity(new SimpleWall(3000, 338, 70, 70, "#354868", true));
        this.addEntity(new ModuloMissileLauncher(3000, 363, 20, Direction.LEFT, 13, 21, 336, true));
        this.addEntity(new ModuloMissileLauncher(3025, 338, 20, Direction.TOP, 13, 21, 336, true));
        this.addEntity(new ModuloMissileLauncher(3050, 363, 20, Direction.RIGHT, 5, 21, 336, true));
        this.addEntity(new ModuloMissileLauncher(3025, 388, 20, Direction.BOTTOM, 8, 21, 336, true));
        
        // Add the exit walls
        this.addEntity(new SimpleWall(3175, 30, 170, 240, "#354868", true));
        this.addEntity(new SimpleWall(3175, 380, 170, 120, "#354868", true));
        
        // Add the easy part text
        this.easyPartText = new Kinetic.Text({
            text: "\
That was the\n\
easy part ;)\n\
\n\
You can take\n\
your time for\n\
the rest.\n\
\n\
By the way\n\
there's no\n\
checkpoint.\n\
\n\
Good luck!",
            fontSize: 15,
            fontFamily: "monospace",
            fill: "white"
        });
        this.easyPartText.hide();
        this.kineticMainLayer.add(this.easyPartText);
        this.easyPartText.moveToTop();
        
        // Add flying blocks
        this.addEntity(new FlyingBlock(3520, 380, 9, 0, 20, 20, 25));
        this.addEntity(new FlyingBlock(3520, 203, 15, 0, 20, 20, 20));
        this.addEntity(new FlyingBlock(3560, 203, 12, 0, 20, 20, 18));
        this.addEntity(new FlyingBlock(3600, 480, 5, -8, 20, 20, 40));
        this.addEntity(new FlyingBlock(3620, 480, 5, -8, 20, 20, 41));
        this.addEntity(new FlyingBlock(3590, 430, 9, 0, 20, 20, 15));
        this.addEntity(new FlyingBlock(3690, 460, -3, -15, 40, 40, 22));
        
        // Add the exit walls
        this.addEntity(new SimpleWall(4000, 30, 170, 240, "#354868", true));
        this.addEntity(new SimpleWall(4000, 380, 170, 120, "#354868", true));
        
        // Add missile launcher
        this.addEntity(new MultipleModuloMissileLauncher(4000, 485, 15, Direction.LEFT, [15, 20, 25, 30, 35], 100, 600, true));
        
        // Add the hardcore zone
        this.hardcoreZone = new HardcoreZone(4170, 30);
        this.addEntity(this.hardcoreZone);
        this.hardcoreZone.kineticRectangle.moveToBottom();
        
        // Add flying blocks to the hardcore zone (clearly it was way too easy without them)
        this.addEntity(new FlyingBlock(4180, 485, 25, 0, 15, 15, 120));
        this.addEntity(new FlyingBlock(4170, 315, 15, 0, 40, 40, 200));
        this.addEntity(new FlyingBlock(6000, 460, 10, -10, 40, 40, 40));
        this.addEntity(new FlyingBlock(6200, 460, 10, -10, 40, 40, 38));
        this.addEntity(new FlyingBlock(6400, 460, 10, -10, 40, 40, 32));
        this.addEntity(new FlyingBlock(6600, 460, 10, -10, 40, 40, 40));
        
        // Add flying blocks to form a train
        this.addEntity(new FlyingBlock(7466, 320, 5, 0, 20, 20, 100));
        this.addEntity(new FlyingBlock(7466, 380, 5, 0, 20, 20, 100));
        this.addEntity(new FlyingBlock(7466, 440, 5, 0, 20, 20, 100));
        this.addEntity(new FlyingBlock(7542, 320, 5, 0, 20, 20, 100));
        this.addEntity(new FlyingBlock(7542, 380, 5, 0, 20, 20, 100));
        this.addEntity(new FlyingBlock(7542, 440, 5, 0, 20, 20, 100));
        
        // Give a roof to the train
        this.addEntity(new FlyingBlock(7542, 280, 1, 0, 391, 20, 40));
        
        // Add the second swarm of flying blocks
        this.addEntity(new FlyingBlock(8240, 30, 0, 8, 3, 70, 50));
        this.addEntity(new FlyingBlock(8260, 30, 0, 16, 3, 62, 25));
        this.addEntity(new FlyingBlock(8290, 30, 0, 8, 3, 5, 58));
        this.addEntity(new FlyingBlock(8300, 30, 0, 12, 3, 5, 38));
        this.addEntity(new FlyingBlock(8310, 30, 0, 16, 3, 5, 29));
        this.addEntity(new FlyingBlock(8350, 30, 0, 16, 3, 5, 29));
        this.addEntity(new FlyingBlock(8355, 30, 0, 12, 3, 5, 38));
        this.addEntity(new FlyingBlock(8360, 30, 0, 16, 3, 5, 29));
        this.addEntity(new FlyingBlock(8360, 30, 0, 16, 3, 5, 29));
        
        // Add the exit walls
        this.addEntity(new SimpleWall(8500, 30, 80, 240, "#354868", true));
        this.addEntity(new BuildableWall(8500, 370, 80, 130, "#354868", true, 8590, 100));
        
        // Add the special missile launchers
        this.addEntity(new SpecialMissileLauncher(8560, 40, 20, Direction.RIGHT, 0));
        this.addEntity(new SpecialMissileLauncher(8560, 90, 20, Direction.RIGHT, 1));
        this.addEntity(new SpecialMissileLauncher(8560, 140, 20, Direction.RIGHT, 2));
        this.addEntity(new SpecialMissileLauncher(8560, 190, 20, Direction.RIGHT, 3));
        this.addEntity(new SpecialMissileLauncher(8560, 240, 20, Direction.RIGHT, 4));
        this.addEntity(new SpecialMissileLauncher(8560, 380, 20, Direction.RIGHT, 5));
        this.addEntity(new SpecialMissileLauncher(8560, 425, 20, Direction.RIGHT, 6));
        this.addEntity(new SpecialMissileLauncher(8560, 470, 20, Direction.RIGHT, 7));
        
        // Add the exit walls
        this.addEntity(new SimpleWall(9500, 30, 80, 240, "#354868", true));
        this.destroyableWall = new DestroyableWall(9500, 270, 80, 230, "#354868", true, 100);
        this.addEntity(this.destroyableWall);
        
        // Add the special button
        this.specialButton = new SpecialButton(9005, 430, 70, 70, 100);
        this.addEntity(this.specialButton);
    },
    
    // Game over method, called when the player is killed
    gameOver : function(){
        // If we were playing
        if(this.gameState === GameState.PLAYING){
            console.log("Frame game over : " + this.frameNumber + ". Player (" + this.player.x + ", " + this.player.y + ")");
            // Change the game state
            this.gameState = GameState.GAMEOVER;
            
            // Call the top bar gameover method
            TopBar.gameOver();
            
            // Increase number of deaths
            this.numberOfDeaths++;
            
            // Update title
            this.updateTitle();
            
            // Clear the game loop interval
            window.clearInterval(this.gameLoopIntervalID);
            
            // Set the timeout to start playing again
            window.setTimeout(this.restart.bind(this), 1000);
        }
    },
    
    // Update title
    updateTitle : function(){
        // Set the title string
        $("#gameTitle").html(this.title.slice(0, (this.numberOfDeaths > this.title.length? this.title.length : this.numberOfDeaths)));
    },
    
    // Restart method, called shortly after a game over
    restart : function(){
        // Change the game state
        this.gameState = GameState.PLAYING;

        // Remove all children from the main layer and clear it
        if(this.kineticMainLayer !== undefined){
            this.kineticMainLayer.destroyChildren();
        }
        
        // Initialize the entities list
        this.entitiesList = new Array();
        
        // Reset the kinetic stage width
        this.resetKineticStageWidth();
        
        // Create the kinetic main layer
        if(this.kineticMainLayer === undefined){
            this.kineticMainLayer = new Kinetic.Layer();
            this.kineticStage.add(this.kineticMainLayer);
            this.kineticMainLayer.moveToBottom();
            this.kineticMainLayer.hitGraphEnabled(false);
        }
        
        // Initialize the game
        this.initialize();
        
        // Top bar restart method
        TopBar.restart();
        
        // Launch the game loop
        this.gameLoopIntervalID = window.setInterval(this.loop.bind(this), 33);
    },
    
    // Get current score
    getCurrentScore : function(){
        return this.player.x + this.player.kineticRectangle.width();
    },
    
    // Won
    won : function(){
        // Change the game state
        this.gameState = GameState.WON;
        
        // Recall initialize
        this.initialize();
        
        for(var i = 0; i < 20; i++){
            this.addEntity(new Player(55, 228));
        }
    }
};
