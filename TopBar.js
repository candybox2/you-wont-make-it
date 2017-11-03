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

var TopBar = {
    // Kinetic top bar layer
    kineticTopBarLayer : undefined,
    
    // Background
    background : undefined,
    
    // Left text
    leftText : undefined,
    
    // Left text size
    leftTextSize : 240,
    
    // Best score
    bestScore : undefined,
    
    // Best score text
    bestScoreText : undefined,
    
    // Best score text size
    bestScoreTextSize : 200,
    
    // Instructions background
    instructionsBackground : undefined,
    
    // Instructions text
    instructionsText : undefined,
    
    // Are instructions shown?
    instructionsShown : false,
    
    // Score bar background
    scoreBarBackground : undefined,
    
    // Current score
    currentScore : undefined,
    
    // Score bar
    scoreBar : undefined,
    
    // Score bar text
    scoreBarText : undefined,
    
    // Score bar text size,
    scoreBarTextSize : 250,
    
    // Called when the game is loaded
    onload : function(){
        // Create the kinetic top bar layer
        this.kineticTopBarLayer = new Kinetic.Layer();
        Game.kineticStage.add(this.kineticTopBarLayer);
        this.kineticTopBarLayer.hitGraphEnabled(false);
        
        // Create the background
        this.background = new Kinetic.Rect({
            x: 0,
            y: 0,
            height: main.topBarHeight,
            fill: "black"
        });
        
        // Add the background to the game kinetic top bar layer
        this.kineticTopBarLayer.add(this.background);
        
        // Create the left text
        this.leftText = new Kinetic.Text({
            x: 3,
            y: 7,
            text: "Press 'i' for instructions.",
            fontSize: 15,
            fontFamily: "monospace",
            fill: "white"
        });
        
        // Add the left text to the game kinetic top bar layer
        this.kineticTopBarLayer.add(this.leftText);
        
        // Create the best score text
        this.bestScoreText = new Kinetic.Text({
            y: 7,
            fontSize: 15,
            fontFamily: "monospace",
            fill: "white"
        });
        this.bestScoreText.hide();
        
        // Add the best score text to the game kinetic top bar layer
        this.kineticTopBarLayer.add(this.bestScoreText);
        
        // Create the instructions background and text
        this.instructionsBackground = new Kinetic.Rect({
            y: main.topBarHeight,
            width: 460,
            height: 340,
            fill: "black"
        });
        this.instructionsBackground.hide();
        
        this.instructionsText = new Kinetic.Text({
            x: 0,
            y: 32,
            text:
"This game is really, really hard. Winning the game\n\
as a human is possible in theory, but it is so\n\
difficult it can be considered impossible.\n\
\n\
The goal is to reach the right of the level.\n\
The game is played with the arrow keys.\n\
\n\
Cheating does not count as winning.\n\
Cheating includes:\n\
   - Any kind of modification of the game.\n\
   - Use of additional hardware or software other\n\
than a standard browser and a standard keyboard.\n\
   - Running the game below the normal frame rate.\n\
\n\
Looking at and analysing the source code does not\n\
count as cheating.\n\
\n\
\n\
                  Good luck!\n\
\n\
\n\
            (press 'i' again to hide instructions)",
            fontSize: 15,
            fontFamily: "monospace",
            fill: "white"
        });
        this.instructionsText.hide();
        
        // Add the instructions background and text to the game kinetic top bar layer
        this.kineticTopBarLayer.add(this.instructionsBackground);
        this.kineticTopBarLayer.add(this.instructionsText);
        
        // Create the score bar background
        this.scoreBarBackground = new Kinetic.Rect({
            y: 7,
            height: 15,
            fill: "#1E1E1E"
        });
        
        // Add the score bar background to the game kinetic top bar layer
        this.kineticTopBarLayer.add(this.scoreBarBackground);
        
        // Create the score bar
        this.scoreBar = new Kinetic.Rect({
            y: 7,
            height: 15,
            fill: "#838383"
        });
        
        // Add the score bar to the game kinetic top bar layer
        this.kineticTopBarLayer.add(this.scoreBar);
        
        // Create the score bar text
        this.scoreBarText = new Kinetic.Text({
            y: 7,
            fontSize: 15,
            fontFamily: "monospace",
            fill: "white"
        });
        
        // Add the score bar text to the game kinetic top bar layer
        this.kineticTopBarLayer.add(this.scoreBarText);
        
        // Adapt to the size
        this.adaptToSize();
        
        // Draw the top bar layer
        this.kineticTopBarLayer.draw();
        
        // Add a key callback
        KeyboardJS.on("i", this.toggleInstructions.bind(this));
    },
    
    // Called when the window is resized
    onresize : function(){
        // Adapt o the size
        this.adaptToSize();
    },
    
    // Adapt to the size
    adaptToSize : function(){
        // Adapt the background width
        this.background.setWidth(Game.kineticStage.getWidth());
        
        // Adapt the best score text x position
        this.bestScoreText.x(Game.kineticStage.getWidth() - this.bestScoreTextSize);
        
        // Adapt the instructions background and instructions text x position
        this.instructionsBackground.x(Game.kineticStage.getWidth() - this.instructionsBackground.getWidth());
        this.instructionsText.x(Game.kineticStage.getWidth() - this.instructionsBackground.getWidth() + 5);
        
        // Adapt the score bar background, score bar, and score bar text x position and size
        this.scoreBarBackground.x(this.leftTextSize + 20);
        this.scoreBar.x(this.leftTextSize + 20);
        this.scoreBarText.x(this.leftTextSize + 20 + Math.floor((Game.kineticStage.getWidth() - this.leftTextSize - this.bestScoreTextSize - 40)/2) - Math.floor(this.scoreBarTextSize/2));
        
        this.scoreBarBackground.setWidth(Game.kineticStage.getWidth() - this.leftTextSize - this.bestScoreTextSize - 40);
        this.updateScoreBarSize();
        
        // Draw the top bar layer
        this.kineticTopBarLayer.draw();
    },
    
    // Toggle instructions
    toggleInstructions : function(){
        if(this.instructionsShown){
            // Hide instructions
            this.instructionsShown = false;
            this.instructionsBackground.hide();
            this.instructionsText.hide();
            
            // Draw the top bar layer
            this.kineticTopBarLayer.draw();
        }
        else{
            // Show instructions
            this.instructionsShown = true;
            this.instructionsBackground.show();
            this.instructionsText.show();
                
            // Draw the top bar layer
            this.kineticTopBarLayer.draw();
        }
    },
    
    // Game over
    gameOver : function(){
        // If there is a new bext score
        if(this.bestScore === undefined || this.currentScore > this.bestScore){
            // Store it
            this.bestScore = this.currentScore;
            
            // Show the best score text and update its text
            this.bestScoreText.show();
            this.bestScoreText.setText("Best score : " + this.bestScore);
            
            // Draw the top bar layer
            this.kineticTopBarLayer.draw();
        }
    },
    
    // Restart
    restart : function(){
        // Reset the current score
        this.currentScore = 0;
    },
    
    // Set current score
    updateCurrentScore : function(){
        // If this score is better
        if(this.currentScore === undefined || Game.getCurrentScore() > this.currentScore){
            // Store it
            this.currentScore = Game.getCurrentScore();
            
            // Show the best score text and update its text
            this.scoreBarText.setText("Current score : " + this.currentScore);
            
            // Update the socre bar size
            this.updateScoreBarSize();
            
            // Draw the top bar layer
            this.kineticTopBarLayer.draw();
        }
    },
    
    // Update score bar size
    updateScoreBarSize : function(){
        this.scoreBar.setWidth(Math.floor((Game.kineticStage.getWidth() - this.leftTextSize - this.bestScoreTextSize - 40) * (this.currentScore / main.gameWidth)));
    }
};

