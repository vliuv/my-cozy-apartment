//bg music
let bgMusic = new Audio("sounds/bgmusic.mp3");
bgMusic.loop = true;

let resultMusic = new Audio("sounds/resultmusic.wav");
resultMusic.loop = true;

let curMusic = "bg";

let startBtn = document.getElementById("start-btn"); //start game btn
let intro = document.getElementById("intro"); //intro block
let main = document.getElementById("main"); //main game block

let collapse = document.getElementById("collapse"); //collapse btn
let menu = document.getElementById("menu"); //whole menu container
let menuRect = menu.getBoundingClientRect(); //to get dimensions of menu
menu.style.left = "calc(-" + menuRect.width + "px)"; //set starting menu position

let tabs = document.querySelectorAll(".tab"); //menu tabs
let sections = document.querySelectorAll(".menu-section"); //menu sections holding items

//sound controls
let soundControls = document.getElementById("sound-controls");
let musicBtn = document.getElementById("music");
let musicOn = true;
let sfxBtn = document.getElementById("sfx");
let sfxOn = true;

//start game
startBtn.addEventListener("click", function(e){
    intro.classList.add("hidden");
    main.classList.remove("no-opac");
    soundControls.classList.remove("hidden");
    bgMusic.currentTime = 0;
    bgMusic.volume = 1;
    if(musicOn){
        bgMusic.play();      
    }
});

//toggle music
musicBtn.addEventListener("click", function(){
    if(musicOn){
        musicOn = false;
        musicBtn.style.backgroundImage = "url('images/musicoff.png')";
        if(curMusic == "bg"){
            bgMusic.pause();
        }else{
            resultMusic.pause();
        }

    }else{
        musicOn = true;
        musicBtn.style.backgroundImage = "url('images/musicon.png')";
        if(curMusic == "bg"){
            bgMusic.play();
        }else{
            resultMusic.play();
        }
    }
});

//toggle sfx
sfxBtn.addEventListener("click", function(){
    if(sfxOn){
        sfxOn = false;
        sfxBtn.style.backgroundImage = "url('images/sfxoff.png')";
    }else{
        sfxOn = true;
        sfxBtn.style.backgroundImage = "url('images/sfxon.png')";
    }
});

function playSound(sound){
    if(sfxOn){
        sound.currentTime = 0;
        sound.play();
    }
}

//when click collapse change arrow direction and menu position
collapse.addEventListener("click", function(e){
    menuRect = menu.getBoundingClientRect();
    if(collapse.firstElementChild.classList.contains("right-arrow")){
        collapse.firstElementChild.classList.remove("right-arrow");
        collapse.firstElementChild.classList.add("left-arrow");
        menu.style.left = "0px";
    }else{
        collapse.firstElementChild.classList.remove("left-arrow");
        collapse.firstElementChild.classList.add("right-arrow");
        menu.style.left = "calc(-" + menuRect.width + "px)";
    }
});

//set click event for each tab to change the menu section shown and highlight tab
for(let i=0; i<tabs.length; i++){
    tabs[i].onclick = function(e){
        for(let j=0; j<sections.length; j++){
            sections[j].classList.add("hidden");
            tabs[j].classList.remove("selected");
        }
        document.querySelector("#"+e.currentTarget.dataset.section).classList.remove("hidden");
        e.currentTarget.classList.add("selected");
    }
}

let grid1 = document.getElementById("grid1"); //room for grid boxes
let grid2 = document.getElementById("grid2"); //room for grid boxes
let grid3 = document.getElementById("grid3"); //room for grid boxes
let grid4 = document.getElementById("grid4"); //room for grid boxes

let gridContainer = document.getElementById("grid-container"); //big container of all rooms
let gridPos = gridContainer.getBoundingClientRect(); //overall grid position
let boxPos; //position of box being dropped into

let grid1Width = 10; //big room width
let grid2Width = 6; //small room width

let gridHeight = 4; //room height

let deleteBtn = document.getElementById("delete");

//create boxes and place into grid div
//room1
for(let i=0; i<gridHeight; i++){
    for(let j=0; j<grid1Width; j++){
        box = document.createElement("div");
        box.classList.add("box");
        box.classList.add("room1");
        box.dataset.x = j;
        box.dataset.y = i;
        box.dataset.empty = true;
        box.dataset.gridW = 10;
        box.dataset.room = 1;
        grid1.appendChild(box);
    }
}
//room2
for(let i=0; i<gridHeight; i++){
    for(let j=0; j<grid2Width; j++){
        box = document.createElement("div");
        box.classList.add("box");
        box.classList.add("room2");
        box.dataset.x = j;
        box.dataset.y = i;
        box.dataset.empty = true;
        box.dataset.gridW = 6;
        box.dataset.room = 2;
        grid2.appendChild(box);
    }
}
//room3
for(let i=0; i<gridHeight; i++){
    for(let j=0; j<grid2Width; j++){
        box = document.createElement("div");
        box.classList.add("box");
        box.classList.add("room3");
        box.dataset.x = j;
        box.dataset.y = i;
        box.dataset.empty = true;
        box.dataset.gridW = 6;
        box.dataset.room = 3;
        grid3.appendChild(box);
    }
}
//room4
for(let i=0; i<gridHeight; i++){
    for(let j=0; j<grid1Width; j++){
        box = document.createElement("div");
        box.classList.add("box");
        box.classList.add("room4");
        box.dataset.x = j;
        box.dataset.y = i;
        box.dataset.empty = true;
        box.dataset.gridW = 10;
        box.dataset.room = 4;
        grid4.appendChild(box);
    }
}

let boxes = document.querySelectorAll(".box"); //boxes in all rooms
let boxes1 = document.querySelectorAll(".room1"); //room 1 boxes
let boxes2 = document.querySelectorAll(".room2"); //room 2 boxes
let boxes3 = document.querySelectorAll(".room3"); //room 3 boxes
let boxes4 = document.querySelectorAll(".room4"); //room 4 boxes

//array of room arrays of boxes
let rooms = []
rooms.push(boxes1);
rooms.push(boxes2);
rooms.push(boxes3);
rooms.push(boxes4);

let menuItems = document.querySelectorAll(".menu-item"); //items in menu

let items = document.querySelectorAll(".item"); //placed items

let mode = "none"; //adding, moving, none

let newItem; //new item being added
let prevXPx; //save most recent item x px pos
let prevYPx; //save most recent item y px pos
let prevX; //save most recent item x grid pos
let prevY; //save most recent item y grid pos
let prevGridW; //save most recent grid w
let prevRoom; //save most recent room

let up = new Audio("sounds/up.mp3");
let down = new Audio("sounds/down.mp3");
let trash = new Audio("sounds/trash.mp3");

//set up all menu item move on mousedown event and images
for(let i=0; i<menuItems.length; i++){

    let img = document.createElement("img");
    img.src = "images/" + menuItems[i].dataset.id + ".png";
    img.loading = "lazy";
    img.style.width = parseInt(menuItems[i].dataset.w) * 40 + "px";
    img.style.height = parseInt(menuItems[i].dataset.h) * 40 + "px";

    menuItems[i].appendChild(img);

    menuItems[i].addEventListener("dragstart", function(e){
        e.preventDefault();
    });
    menuItems[i].addEventListener("mousedown", function(e){
        if(mode == "none"){
            
            playSound(up);

            //show the grid & delete after selecting menu item
            showGrid();

            //close menu
            menuRect = menu.getBoundingClientRect();
            collapse.firstElementChild.classList.remove("left-arrow");
            collapse.firstElementChild.classList.add("right-arrow");
            menu.style.left = "calc(-" + menuRect.width + "px)";

            //create and style item
            newItem = document.createElement("div");
            newItem.classList.add("item");
            newItem.dataset.id = e.currentTarget.dataset.id;
            newItem.style.backgroundImage = "url('images/" + newItem.dataset.id + ".png')";
            newItem.dataset.w = e.currentTarget.dataset.w;
            newItem.dataset.h = e.currentTarget.dataset.h;
            newItem.dataset.col = e.currentTarget.dataset.col;
            newItem.classList.add(e.currentTarget.dataset.d);
            newItem.classList.add("front");

            //add item and change mode
            gridContainer.appendChild(newItem);
            items = document.querySelectorAll(".item");
            mode = "adding";

            //position moving item
            movingItem(e);

            document.body.style.cursor = "grabbing";
            document.body.classList.add("prevent-select");
        }

        //moving an already placed item
        for(let j=0; j<items.length; j++){
            items[j].addEventListener("dragstart", function(e){
                e.preventDefault();
            });
            items[j].addEventListener("mousedown", function(e){
                if(mode == "none"){
                    playSound(up);

                    //set new item to current item
                    newItem = e.currentTarget;
                    newItem.classList.add("front");

                    //save now prev info
                    prevXPx = newItem.style.left;
                    prevYPx = newItem.style.top;
                    prevX = newItem.dataset.x;
                    prevY = newItem.dataset.y;
                    prevGridW = newItem.dataset.gridW;
                    prevRoom = newItem.dataset.room;

                    //show grid & delete while moving item
                    showGrid();

                    //close menu
                    menuRect = menu.getBoundingClientRect();
                    collapse.firstElementChild.classList.remove("left-arrow");
                    collapse.firstElementChild.classList.add("right-arrow");
                    menu.style.left = "calc(-" + menuRect.width + "px)";

                    //setting old box positions to empty
                    for(let l=0; l<newItem.dataset.h; l++){
                        for(let k=0; k<newItem.dataset.w; k++){
                            //go through for the h and w of the item and start from the top left and set the boxes it occupied to empty
                            rooms[parseInt(newItem.dataset.room)-1][(parseInt(newItem.dataset.x) + k) + (parseInt(newItem.dataset.y) + l) * parseInt(newItem.dataset.gridW)].dataset.empty = true;

                        }
                    }

                    mode = "moving";

                    //position moving item
                    movingItem(e);

                    document.body.style.cursor = "grabbing";
                    document.body.classList.add("prevent-select");

                } 
            });
        }
    });
}

//if let go of item not over a box
document.addEventListener("mouseup", function(e){
    //delete item if new
    if(mode == "adding"){
        gridContainer.removeChild(newItem);
        mode = "none";
        hideGrid();
        playSound(trash);
    //place item back into old place if moving
    }else if(mode == "moving"){
        //set back to previous position
        newItem.style.left = prevXPx;
        newItem.style.top = prevYPx;
        newItem.dataset.x = prevX;
        newItem.dataset.y = prevY;
        newItem.dataset.gridW = prevGridW;
        newItem.dataset.room = prevRoom;
        newItem.classList.remove("front");

        //set boxes item occupies as not empty
        for(let j=0; j<newItem.dataset.h; j++){
            for(let k=0; k<newItem.dataset.w; k++){
                //go through for the h and w of the item and start from the top left and set the boxes it will occupy to not empty
                rooms[parseInt(newItem.dataset.room)-1][(parseInt(newItem.dataset.x) + k) + (parseInt(newItem.dataset.y) + j) * parseInt(newItem.dataset.gridW)].dataset.empty = false;
            }
        }

        mode = "none"
        newItem.classList.remove("no-pointer-e");
        hideGrid();
        playSound(down);
    }
    document.body.style.cursor = "auto";
    document.body.classList.remove("prevent-select");
});

//let go over box to place item
for(let i=0; i<boxes.length; i++){
    boxes[i].addEventListener("mouseup", function(e){
        if(mode == "adding" || mode == "moving"){            
            //if within bounds (w/h of item + x/y pos in room is less than width of room)
            if(parseInt(newItem.dataset.w) + parseInt(e.currentTarget.dataset.x) <= boxes[i].dataset.gridW && parseInt(newItem.dataset.h) + parseInt(e.currentTarget.dataset.y) <= gridHeight){

                //remove front z-index
                newItem.classList.remove("front");

                //store room grid width
                newItem.dataset.gridW = e.currentTarget.dataset.gridW;

                //store the grid x,y pos identity
                newItem.dataset.x = e.currentTarget.dataset.x;
                newItem.dataset.y = e.currentTarget.dataset.y;

                //store which room it's in
                newItem.dataset.room = e.currentTarget.dataset.room;

                //if not overlapping with another item
                if(noOverlap(newItem, boxes[i].dataset.gridW)){
                    //place in box (px)
                    boxPos = boxes[i].getBoundingClientRect();
                    newItem.style.left = boxPos.x - gridPos.x + "px";
                    newItem.style.top = boxPos.y - gridPos.y + "px";

                    hideGrid();
                    playSound(down);

                    //set boxes item occupies as not empty
                    for(let j=0; j<newItem.dataset.h; j++){
                        for(let k=0; k<newItem.dataset.w; k++){
                            //go through for the h and w of the item and start from the top left and set the boxes it will occupy to not empty
                            rooms[parseInt(newItem.dataset.room)-1][(parseInt(newItem.dataset.x) + k) + (parseInt(newItem.dataset.y) + j) * parseInt(newItem.dataset.gridW)].dataset.empty = false;
                        }
                    }

                    newItem.classList.remove("no-pointer-e");
                    mode = "none";
                }
            }
        }
    });
}

//check if new item will overlap with any existing
function noOverlap(newItem, curGridW){
    for(let j=0; j<newItem.dataset.h; j++){
        for(let k=0; k<newItem.dataset.w; k++){
            //go through for the h and w of the item and start from the top left and see if any boxes are not empty
            if(rooms[parseInt(newItem.dataset.room)-1][(parseInt(newItem.dataset.x) + k) + (parseInt(newItem.dataset.y) + j) * curGridW].dataset.empty == "false"){
                return false;
            }
        }
    } 
    return true;
}

//delete current item
deleteBtn.addEventListener("mouseup", function(e){
    if(mode == "adding" || mode == "moving"){
        playSound(trash);

        if(mode == "moving"){

            //if moving, reset the boxes to empty
            for(let l=0; l<newItem.dataset.h; l++){
                for(let k=0; k<newItem.dataset.w; k++){
                    //go through for the h and w of the item and start from the top left and set the boxes it occupied to empty
                    rooms[parseInt(newItem.dataset.room)-1][(parseInt(newItem.dataset.x) + k) + (parseInt(newItem.dataset.y) + l) * parseInt(newItem.dataset.gridW)].dataset.empty = true;
                }
            }
        }

        //hide grid once deleted
        hideGrid();

        //delete
        gridContainer.removeChild(newItem);
        mode = "none";
    }
});

//hover over delete
deleteBtn.addEventListener("mouseenter", function(e){
    e.currentTarget.classList.remove("delete-default");
    e.currentTarget.classList.add("delete-active");
});

//stop hovering over delete
deleteBtn.addEventListener("mouseleave", function(e){
    e.currentTarget.classList.remove("delete-active");
    e.currentTarget.classList.add("delete-default");
});

//when mouse is moving, call movingItem
document.addEventListener("mousemove", function(e){
    if(mode == "adding" || mode == "moving"){
        movingItem(e);
        // document.body.style.cursor = "grabbing";
    }else{
        // document.body.style.cursor = "auto";
    }
});

//move the item with the cursor
function movingItem(e){
    gridPos = gridContainer.getBoundingClientRect();
    newItem.style.left = e.clientX - gridPos.x - 20 + "px";
    newItem.style.top = e.clientY - gridPos.y - 20 + "px";
    newItem.classList.add("no-pointer-e");
}

//hide grid
function hideGrid(){
    for(let i=0; i<boxes.length; i++){
        boxes[i].classList.remove("box-show");
    }
    deleteBtn.classList.add("hidden");
}

//show grid
function showGrid(){
    for(let i=0; i<boxes.length; i++){
        boxes[i].classList.add("box-show");
    }
    deleteBtn.classList.remove("hidden");
}

document.body.addEventListener("mousemove", function(e){
    if(mode == "adding" || mode == "moving"){
        e.preventDefault();
    }
});

//room background
let bgRooms = document.querySelectorAll(".bg-room");
let bgColors = document.querySelectorAll(".bg-color");
let bgPatterns = document.querySelectorAll(".bg-pattern");
let curBgRoom = "1";
let curBgPattern = "solid";
let colorIds = [0,0,0,0];

//room buttons
for(let i=0; i<bgRooms.length; i++){
    //click event
    bgRooms[i].addEventListener("click", function(e){

        //show selector on right room
        for(let j=0; j<bgRooms.length; j++){
            bgRooms[j].classList.remove("room-selected");
        }
        e.currentTarget.classList.add("room-selected");

        //get current properties of room
        curBgRoom = e.currentTarget.dataset.room;
        curBgPattern = document.getElementById("grid"+curBgRoom).dataset.pattern;

        //show selector on right color
        for(let j=0; j<bgColors.length; j++){
            bgColors[j].classList.remove("color-selected");
        }
        bgColors[colorIds[parseInt(curBgRoom)-1]].classList.add("color-selected");

        //show selector on right pattern
        for(let j=0; j<bgPatterns.length; j++){
            bgPatterns[j].classList.remove("pattern-selected");
        }
        document.getElementById(curBgPattern).classList.add("pattern-selected");

    });
}

//color buttons
for(let i=0; i<bgColors.length; i++){
    
    //set each button color
    bgColors[i].style.backgroundColor = bgColors[i].dataset.hex;

    //click event
    bgColors[i].addEventListener("click", function(e){

        //change color

        //get current color
        let curCol = e.currentTarget.style.backgroundColor;
        if(curCol == "rgb(255, 255, 255)"){
            curCol = "#ddd";
        }

        //get current room element
        let curRoom = document.getElementById("grid"+curBgRoom);

        displayPattern(curRoom, curBgPattern, curCol);

        //show selector on right color
        for(let j=0; j<bgColors.length; j++){
            bgColors[j].classList.remove("color-selected");
        }
        e.currentTarget.classList.add("color-selected");

        //store color id in array
        colorIds[parseInt(curBgRoom)-1] = i;
    });
}

//pattern buttons
for(let i=0; i<bgPatterns.length; i++){

    //change pattern

    //click event
    bgPatterns[i].addEventListener("click", function(e){

        //get current room element
        let curRoom = document.getElementById("grid"+curBgRoom);

        //remove current pattern
        curRoom.classList.remove("stripe");
        curRoom.classList.remove("dot");
        curRoom.classList.remove("checker");

        //set current pattern
        curBgPattern = e.currentTarget.dataset.pattern;
        curRoom.dataset.pattern = curBgPattern;
        curRoom.classList.add(curBgPattern);

        //get current color
        let curCol = bgColors[colorIds[parseInt(curBgRoom)-1]].style.backgroundColor;
        if(curCol == "rgb(255, 255, 255)"){
            curCol = "#ddd";
        }

        displayPattern(curRoom, curBgPattern, curCol);

        //show selector on right color
        for(let j=0; j<bgPatterns.length; j++){
            bgPatterns[j].classList.remove("pattern-selected");
        }
        e.currentTarget.classList.add("pattern-selected");

    });
}

function displayPattern(curRoom, curBgPattern, curCol){

    if(curBgPattern != "solid" && curCol != "#ddd"){
        curCol = curCol.replace(")",", 0.7)");
    }

    //solid
    if(curBgPattern == "solid"){
        if(curCol == "#ddd"){
            curRoom.style.backgroundColor = "#fff";
        }else{
            curRoom.style.backgroundColor = curCol;
        }

        curRoom.style.backgroundImage = "none";
    
    //stripe
    }else if(curBgPattern == "stripe"){
        
        curRoom.classList.add("stripe");

        curRoom.style.backgroundImage = "repeating-linear-gradient(to right," + curCol + ", " + curCol + " 50%, #fff 50%, #fff)";

        curRoom.style.backgroundColor = "#fff";
        
    //dot
    }else if(curBgPattern == "dot"){
        curRoom.classList.add("dot");

        curRoom.style.backgroundImage = "radial-gradient(#fff 20%, transparent 20%), radial-gradient(#fff 20%, transparent 20%)";

        curRoom.style.backgroundColor = curCol;

    //checker
    }else if(curBgPattern == "checker"){
        curRoom.classList.add("checker");

        curRoom.style.backgroundImage = "linear-gradient(45deg, " + curCol + " 25%, transparent 25%), linear-gradient(135deg, " + curCol + " 25%, transparent 25%), linear-gradient(45deg, transparent 75%, " + curCol + " 75%), linear-gradient(135deg, transparent 75%, " + curCol + " 75%)";

        curRoom.style.backgroundColor = "#fff";
    }
}

let doneBtn = document.getElementById("done-btn");
let resultsPage = document.getElementById("results-page");
let resultsContent = document.getElementById("results-content");

let mainHeading = document.getElementById("heading");
let backgroundSelect = document.getElementById("background-select");

let resultsBar = document.getElementById("results-bar");

let loading = document.getElementById("loading");
let progressBarOut = document.getElementById("progress-bar-out");

let playagainBtn = document.getElementById("playagain-btn");


doneBtn.addEventListener("click", function(e){

    //show loading and hide game
    loading.classList.remove("hidden");
    main.classList.add("no-pointer-e");
    main.classList.add("hidden");
    soundControls.classList.add("hidden");

    bgMusic.volume = 0.3;

    //progress bar
    let count = 0;
    let newProgBar = document.createElement("div");
    newProgBar.id = "progress-bar-in";
    newProgBar.classList.add("prog-bar");
    progressBarOut.appendChild(newProgBar);

    setInterval(function(){
        if(count < 100){
            count++;
        }
        newProgBar.style.width = count + "%";
    }, 26);

    //after finished "loading"
    setTimeout(function(){
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });

        newProgBar.remove();

        curMusic = "result";
        if(musicOn){
            resultMusic.currentTime = 0;
            resultMusic.play();
        }
        bgMusic.pause();
        
        loading.classList.add("hidden");
        main.classList.remove("hidden");
        soundControls.classList.remove("hidden");
        sfxBtn.classList.add("hidden");

        mainHeading.classList.add("hidden");
        backgroundSelect.classList.add("hidden");
        doneBtn.classList.add("hidden");
        menu.classList.add("hidden");
    
        resultsPage.classList.remove("hidden");
        playagainBtn.classList.remove("hidden");
    
        items = document.querySelectorAll(".item")
    
        //to count items of each color
        let colObj = {
            "pink": 0,
            "red": 0,
            "orange": 0,
            "yellow": 0,
            "green": 0,
            "blue": 0,
            "purple": 0,
            "white": 0,
            "black": 0,
            "brown": 0
        }
    
        let total = 0; //total number of items
    
        let bases = []; //used sentence bases
    
        //basic text for each color
        let colText = {
            "pink": "You like to use pink to create a soothing and peaceful environment after a long day. You are very kind, open to new experiences, and are optimistic about the future.",
    
            "red": "You use red to give you a boost of confidence and power. You are an enthusiastic person but can be careless or combative in situations with heightened emotions.",
    
            "orange": "You like orange because it reminds you of fall and energizes you when you are feeling low. People think you have a very warm and welcoming personality, but sometimes you are easily upset, though you try to hide it.",
    
            "yellow": "You use yellow to remind you of all the great things in life and because it enhances your creativity. You are sympathetic and are there to listen to the troubles of your loved ones.",
    
            "green": "You think the color green gives you inner peace and a sense of independence. People see you as a very stable person who is dependable and disciplined.",
    
            "blue": "You like to use blue because it helps you sleep peacefully at night. You like to spend time reflecting. You enjoy the company of close friends but can be reserved in large groups.",
    
            "purple": "You use purple to enhance your self-awareness and heighten your senses. Though sometimes you feel anxious and complicated, you are creative and have the gift of an active imagination.",
    
            "white": "You use white to refresh the apartment and make it welcoming to visitors. You are a hopeful person and excited by new beginnings, though some people might find you naive.",
    
            "black": "You like how using black in your apartment creates a luxurious and elegant environment for visitors. People admire your bold personality, and you aren’t afraid to say what’s on your mind.",
    
            "brown": "You like how brown creates an earthy feel and reminds you to stay grounded. You consider yourself very down-to-earth and value harmony. Some people think you are basic, but you find joy in the little things."
        }
    
        //hex vals for each color
        let colHex = {
            "pink": ["#ff5d78", "#ff7d93"],
            "red": ["#f13b3b", "#f55b5b"],
            "orange": ["#ff8a41", "#ff9e61"],
            "yellow": ["#fae929", "#f7ed81"],
            "green": ["#69c53b", "#8ed16d"],
            "blue": ["#34aecd", "#6cc9e0"],
            "purple": ["#ad5fc2", "#c88dd9"],
            "white": ["#fff", "#ebebeb"],
            "black": ["#222", "#333"],
            "brown": ["#82401f", "#916149"]
        }
    
        //add up items
        for(let i=0; i<items.length; i++){
            colObj[items[i].dataset.col] += 1;
            total += 1;
        }
    
        //add room bg
        for(let i=0; i<4; i++){
            colObj[bgColors[colorIds[i]].dataset.col] += 1;
            total += 1;
        }
    
        //colors sorted by most to least [0]: name, [1]: amount
        final = Object.entries(colObj).sort(function(a,b){
            return b[1]-a[1];
        });
    
    
        //show results
        for(let i=0; i<final.length; i++){
            
            //check that color was used
            if(final[i][1] != 0){
    
                //add percentage width in bar of each color
                let bar = document.createElement("div");
                bar.style.backgroundColor = colHex[final[i][0]][0];
                bar.style.width = final[i][1]/total*100 + "%";

                bar.innerText = ((final[i][1]/total)*100).toFixed(0) + "% ";
                if(final[i][0] == "black" || final[i][0] == "brown"){
                    bar.style.color = "white";
                }

                if(i == 0){
                    bar.classList.add("active-bar");
                }

                bar.dataset.control = final[i][0];
                resultsBar.appendChild(bar);
    
                //create div for this color
                let thisCol = document.createElement("div");
                thisCol.classList.add("color-result");
                if(i != 0){
                    thisCol.classList.add("hidden");
                }
                thisCol.id = final[i][0] + "-result";
                resultsContent.appendChild(thisCol);
    
                //percent text for each color
                let percent = document.createElement("div");
                percent.classList.add("percent-result");
    
                let percentSq = document.createElement("span");
                percentSq.classList.add("percent-sq");
                percentSq.style.backgroundColor = colHex[final[i][0]][0];
                
                let percentText = document.createElement("span");
    
                //percentage number & color name
                percentText.innerText = ((final[i][1]/total)*100).toFixed(2) + "% " + final[i][0].charAt(0).toUpperCase() + final[i][0].substring(1);
    
                
                thisCol.appendChild(percent);
                percent.appendChild(percentSq);
                percent.appendChild(percentText);
    
                //written part for each color
                let text = document.createElement("div");
                text.classList.add("color-text");
    
                //check all placed items
                for(let j=0; j<items.length; j++){
    
                    //if the current color final[i][0] is the same as the item's color
                    if(final[i][0] == items[j].dataset.col){
                        
                        let id = items[j].dataset.id; //get id of item
                        let type = ""; //set type of item
                        
                        //if the id ends in 0 (10th option of type), type is equal to first part of id excluding "-10"
                        if(id.charAt(id.length - 1) == 0){
                            type = id.slice(0,id.length-3)
    
                        //else, type is equal to first part of id excluding "-x"
                        }else{
                            type = id.slice(0,id.length-2)
                        }
                        
                        //for 10 options in this type
                        for(let k=0; k<10; k++){
    
                            //check if the id of the option is the same as the id of this item and that this sentence base hasn't been used yet
                            if(type in data){
                                if (data[type][k]["id"] == id && !bases.includes(data[type][k]["base"])){
                                    bases.push(data[type][k]["base"]); //store this sentence base
                                    colText[final[i][0]] += " " + data[type][k]["final"]; //add this sentence to this color's text
                                }
                            }
                        }
    
    
                    }
                }
                
                //get final text for color and show
                text.innerText = colText[final[i][0]];
                thisCol.appendChild(text);
    
            }
        }
    
        //get all bars and color results
        let bars = document.querySelectorAll("#results-bar div");
        let colResults = document.querySelectorAll(".color-result");
    
        for(let i=0; i<bars.length; i++){
            //click event to show the color results for the bar that is clicked on
            bars[i].addEventListener("click", function(e){
                for(let j=0; j<bars.length; j++){
                    colResults[j].classList.add("hidden");
                    bars[j].classList.remove("active-bar");
                }
                e.currentTarget.classList.add("active-bar");
                document.getElementById(bars[i].dataset.control+"-result").classList.remove("hidden");
            });

            //hover effect
            bars[i].addEventListener("mouseenter", function(e){
                e.currentTarget.style.backgroundColor = colHex[e.currentTarget.dataset.control][1];
            });
            bars[i].addEventListener("mouseleave", function(e){
                e.currentTarget.style.backgroundColor = colHex[e.currentTarget.dataset.control][0];
            });
        }


    }, 3000);

    

});


playagainBtn.addEventListener("click", function(e){
    //reset sounds
    curMusic = "bg";
    resultMusic.pause();

    intro.classList.remove("hidden");
    soundControls.classList.add("hidden");
    sfxBtn.classList.remove("hidden");
    
    //main game reset
    main.classList.add("no-opac");
    mainHeading.classList.remove("hidden");
    backgroundSelect.classList.remove("hidden");
    doneBtn.classList.remove("hidden");
    menu.classList.remove("hidden");
    main.classList.remove("no-pointer-e");

    menu.style.left = "calc(-" + menuRect.width + "px)";

    //remove all items
    let clearItems = document.querySelectorAll(".item");
    for(let i=0; i<clearItems.length; i++){
        clearItems[i].remove();
    }

    //set boxes to empty
    for(let i=0; i<boxes.length; i++){
        boxes[i].dataset.empty = true;
    } 

    //resetting background colors and patterns
    curBgRoom = "1";
    curBgPattern = "solid";
    colorIds = [0,0,0,0];

    //room menu selection reset
    for(let i=0; i<bgRooms.length; i++){
        bgRooms[i].classList.remove("room-selected");
    }
    bgRooms[0].classList.add("room-selected");

    for(let i=0; i<bgPatterns.length; i++){
        bgPatterns[i].classList.remove("pattern-selected");
    }
    bgPatterns[0].classList.add("pattern-selected");

    for(let i=0; i<bgColors.length; i++){
        bgColors[i].classList.remove("color-selected");
    }
    bgColors[0].classList.add("color-selected");

    //reset appearance
    for(let i=1; i<5; i++){
        let curRoom = document.getElementById("grid"+i);
        displayPattern(curRoom, "solid", "#ddd");
        curRoom.classList.remove("stripe");
        curRoom.classList.remove("dot");
        curRoom.classList.remove("checker");
        curRoom.classList.add("solid");
        curRoom.dataset.pattern = "solid";
    }

    //result reset
    resultsPage.classList.add("hidden");
    playagainBtn.classList.add("hidden");

    //remove all bars
    let clearBars = document.querySelectorAll("#results-bar div");
    for(let i=0; i<clearBars.length; i++){
        clearBars[i].remove();
    }

    //remove all color results
    let clearResults = document.querySelectorAll(".color-result");
    for(let i=0; i<clearResults.length; i++){
        clearResults[i].remove();
    }

});



