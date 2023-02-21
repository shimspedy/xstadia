////////////////////////////////////////////////////////////
// GAME v1.7
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

var selectBoardCon = true; //enable select boards page

//total players and assets
var players_arr = [
					'assets/icon_player1.png',
					'assets/icon_player2.png',
					'assets/icon_player3.png',
					'assets/icon_player4.png'
				];

var moveSpeed = .5; //player move speed
var extraMoveText = 'EXTRA MOVE!'; //extra move text display
var goodMove_arr = ['GOOD MOVE!','LUCKY MOVE!']; //go up text display
var badMove_arr = ['OPPSSS!','BAD MOVE!']; //go down text display
var winText = 'PLAYER [NUMBER] WIN!'; //players win text display
var userWinText = 'YOU WIN!'; //user win text display

var exitMessage = 'ARE YOUR SURE YOU\nWANT TO QUIT THE GAME?'; //go to main page message
var resultTitleWinText = 'CONGRATULATION'; //user won result title text
var resultTitleOverText = 'GAME OVER'; //user loss result title text


//Social share, [SCORE] will replace with game score
var shareEnable = true; //toggle share
var shareText = 'SHARE THIS GAME'; //social share message
var shareTitle = 'Build your own Snake and Ladders game.';//social share score title
var shareMessage = 'Join me to play this Snakes and Ladders Game! Try it now!'; //social share score message
				
/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */

$.editor = {enable:false};
var playerData = {win:false};
var gameData = {paused:true, boardNum:0, diceNum:0, players:2, player:0, turn:0, extraTurn:false, reverse:false, move:false};

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	if($.browser.mobile || isTablet){
		
	}else{
		var isInIframe = (window.location != window.parent.location) ? true : false;
		if(isInIframe){
			$(window).blur(function() {
				appendFocusFrame();
			});
			appendFocusFrame();
        }
	}

	buttonLocal.cursor = "pointer";
	buttonLocal.addEventListener("click", function(evt) {
		playSound('soundButton');
		socketData.online = false;
		goPage('level');
	});

	buttonOnline.cursor = "pointer";
	buttonOnline.addEventListener("click", function(evt) {
		playSound('soundButton');
		checkQuickGameMode();
	});

	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		playSound('soundButton');

		if ( typeof initSocket == 'function' && multiplayerSettings.enable) {
			if(multiplayerSettings.localPlay){
				toggleMainButton('local');
			}else{
				checkQuickGameMode();
			}
		}else{
			if(selectBoardCon){
				goPage('level');
			}else{
				goPage('mode');	
			}
		}
	});
	
	buttonSelectContinue.cursor = "pointer";
	buttonSelectContinue.addEventListener("click", function(evt) {
		playSound('soundClick');
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			postSocketUpdate('start');
		}else{
			goPage('mode');
		}
	});
	
	buttonLeft.cursor = "pointer";
	buttonLeft.addEventListener("mousedown", function(evt) {
		toggleSelect(false, true);
	});
	
	buttonRight.cursor = "pointer";
	buttonRight.addEventListener("mousedown", function(evt) {
		toggleSelect(true, true);
	});
	
	for(n=0;n<boards_arr.length;n++){
		$.thumbs['thumb_'+n].name = n;
		$.thumbs['thumb_'+n].cursor = "pointer";
		$.thumbs['thumb_'+n].addEventListener("mousedown", function(evt) {
			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				if(socketData.host){
					selectBoardThumbs(evt.target.name);
					postSocketUpdate('updatethumb', evt.target.name);
				}
			}else{
				selectBoardThumbs(evt.target.name);
			}
		});
	}
	
	buttonMin.cursor = "pointer";
	buttonMin.addEventListener("mousedown", function(evt) {
		togglePlayer(false);
	});
	
	buttonPlus.cursor = "pointer";
	buttonPlus.addEventListener("mousedown", function(evt) {
		togglePlayer(true);
	});
	
	buttonPlayer.cursor = "pointer";
	buttonPlayer.addEventListener("mousedown", function(evt) {
		playSound('soundClick');
		gameData.mode = 'player';
		goPage('game');
	});
	
	buttonComputer.cursor = "pointer";
	buttonComputer.addEventListener("mousedown", function(evt) {
		playSound('soundClick');
		gameData.mode = 'computer';
		goPage('game');
	});
	
	buttonContinue.cursor = "pointer";
	buttonContinue.addEventListener("click", function(evt) {
		playSound('soundClick');
		goPage('main');
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonWhatsapp.cursor = "pointer";
	buttonWhatsapp.addEventListener("click", function(evt) {
		share('whatsapp');
	});
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleGameMute(true);
		toggleOption();
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleGameMute(false);
		toggleOption();
	});
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
		toggleOption();
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		toggleConfirm(true);
		toggleOption();
	});
	
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		toggleConfirm(false);
		stopGame();
		goPage('main');

		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			exitSocketRoom();
		}
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		toggleConfirm(false);
	});
	
	buttonRoll.cursor = "pointer";
	buttonRoll.addEventListener("click", function(evt) {
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			if(socketData.turn){
				animateDice();
			}
		}else{
			animateDice();
		}
	});
}

function appendFocusFrame(){
	$('#mainHolder').prepend('<div id="focus" style="position:absolute; width:100%; height:100%; z-index:1000;"></div');
	$('#focus').click(function(){
		$('#focus').remove();
	});	
}

function toggleMainButton(con){
	if ( typeof initSocket == 'function' && multiplayerSettings.enable) {
		gameLogsTxt.visible = true;
		gameLogsTxt.text = '';
	}

	buttonStart.visible = false;
	buttonLocalContainer.visible = false;

	if(con == 'start'){
		buttonStart.visible = true;
	}else if(con == 'local'){
		buttonLocalContainer.visible = true;
	}
}

function checkQuickGameMode(){
	socketData.online = true;
	if(!multiplayerSettings.enterName){
		buttonStart.visible = false;
		buttonLocalContainer.visible = false;

		addSocketRandomUser();
	}else{
		goPage('name');
	}
}

/*!
 * 
 * SELECT BOARDS - This is the function that runs to display select boards
 * 
 */
var selectPageNum = 1;
var selectPageTotal = 1;
var maxThumbPerPage = 3;
function buildSelectPagination(){
	selectPageTotal=boards_arr.length/maxThumbPerPage;
	if (String(selectPageTotal).indexOf('.') > -1){
		selectPageTotal=Math.floor(selectPageTotal)+1;
	}
	toggleSelect(false, false);
}

function toggleSelect(con, update){
	if(con){
		selectPageNum++;
		selectPageNum = selectPageNum > selectPageTotal ? selectPageTotal : selectPageNum;
	}else{
		selectPageNum--;
		selectPageNum = selectPageNum < 1 ? 1 : selectPageNum;
	}
	selectPage(selectPageNum);

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		if(update){
			postSocketUpdate('updatelevel', selectPageNum);
		}
	}
}

function selectPage(num){
	selectPageNum = num;
	itemThumbSelect.visible = false;
	
	var startNum = (selectPageNum-1) * maxThumbPerPage;
	var endNum = startNum + (maxThumbPerPage-1);
	var thumbCount = 1;
	
	var thumbCount = 0;
	for(var n=0;n<boards_arr.length;n++){
		if(n >= startNum && n <= endNum){
			if(gameData.boardNum == n){
				itemThumbSelect.visible = true;
				itemThumbSelect.x = $.thumbs['thumb_'+n].x;
				itemThumbSelect.y = $.thumbs['thumb_'+n].y;
			}
			
			thumbCount++;
			$.thumbs['thumb_'+n].visible = true;
			$.thumbs['thumb_'+n].visible = true;
		}else{
			$.thumbs['thumb_'+n].visible = false;	
		}
	}
	
	var showLeftRightButton = false;
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		if(socketData.host){
			showLeftRightButton = true;
		}
	}else{
		showLeftRightButton = true;
	}

	if(showLeftRightButton){
		if(selectPageNum == 1){
			buttonLeft.visible = false;
		}else{
			buttonLeft.visible = true;	
		}
		
		if(selectPageNum == selectPageTotal || selectPageTotal == 1){
			buttonRight.visible = false;	
		}else{
			buttonRight.visible = true;	
		}
	}
}

function selectBoardThumbs(num){
	gameData.boardNum = num;
	itemThumbSelect.x = $.thumbs['thumb_'+num].x;
	itemThumbSelect.y = $.thumbs['thumb_'+num].y;
	itemThumbSelect.visible = true;
}

/*!
 * 
 * TOGGLE PLAYERS - This is the function that runs to toggle total players
 * 
 */
function togglePlayer(con){
	if(con){
		gameData.players++;
		gameData.players = gameData.players > players_arr.length ? players_arr.length : gameData.players;
	}else{
		gameData.players--;
		gameData.players = gameData.players < 2 ? 2 : gameData.players;
	}
	totalPlayerTxt.text = gameData.players;
}

/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;
	
	$('#roomWrapper').hide();
	$('#roomWrapper .innerContent').hide();
	gameLogsTxt.visible = false;

	mainContainer.visible = false;
	nameContainer.visible = false;
	roomContainer.visible = false;
	selectContainer.visible = false;
	modeContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	
	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;
			toggleMainButton('start');
		break;

		case 'name':
			targetContainer = nameContainer;
			$('#roomWrapper').show();
			$('#roomWrapper .nameContent').show();
			$('#roomWrapper .fontNameError').html('');
			$('#enterName').show();
		break;
			
		case 'room':
			targetContainer = roomContainer;
			$('#roomWrapper').show();
			$('#roomWrapper .roomContent').show();
			switchSocketRoomContent('lists');
		break;
			
		case 'level':
			targetContainer = selectContainer;
			
			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				buttonSelectContinue.visible = false;
				buttonLeft.visible = false;
				buttonRight.visible = false;

				if(socketData.host){
					buttonSelectContinue.visible = true;
				}
			}else{
				playerTurnTxt.text = '';
			}
		break;
			
		case 'mode':
			targetContainer = modeContainer;
		break;
		
		case 'game':
			targetContainer = gameContainer;
			startGame();
		break;
		
		case 'result':
			targetContainer = resultContainer;
			stopGame();
			
			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				if(socketData.turn){
					playerData.win = true;
					resultTitleTxt.text = userWinText;
					resultScoreTxt.text = resultTitleWinText;
				}else{
					resultTitleTxt.text = winText.replace('[NUMBER]', socketData.winner);
					resultScoreTxt.text = resultTitleOverText;
				}
				
				if(socketData.host){
					postSocketCloseRoom();
				}
			}else{
				if(gameData.mode == 'computer' && gameData.player == 0){
					playerData.win = true;
					resultTitleTxt.text = userWinText;
					resultScoreTxt.text = resultTitleWinText;
				}else{
					resultTitleTxt.text = winText.replace('[NUMBER]', gameData.player+1);
					resultScoreTxt.text = resultTitleOverText;
				}
			}

			saveGame(playerData.win);

		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

function toggleConfirm(con){
	confirmContainer.visible = con;
	
	if(con){
		TweenMax.pauseAll(true, true);
		gameData.paused = true;
	}else{
		TweenMax.resumeAll(true, true)
		gameData.paused = false;
	}
}

function resizeSocketLog(){
	gameLogsTxt.font = "30px groboldregular";
	gameLogsTxt.textAlign = "center";
	gameLogsTxt.color = "#fff";

	gameLogsTxt.x = canvasW/2;
	gameLogsTxt.y = canvasH/100 * 70;

	if(curPage == 'main'){
		gameLogsTxt.color = "#000";
	}else if(curPage == 'game'){
		gameLogsTxt.font = "15px groboldregular";
		gameLogsTxt.textAlign = "left";

		gameLogsTxt.x = canvasW/100 * 80;
		gameLogsTxt.y = canvasH/100 * 50;
	}
}

/*!
 * 
 * START GAME - This is the function that runs to start play game
 * 
 */

function startGame(){
	gameData.move = false;
	gameData.turn = 0;
	gameData.player = 0;
	statusContainer.alpha = 0;
	playerData.win = false;

	for(var n = 0; n<boards_arr.length; n++){
		$.boards[n].visible = false;
	}
	$.boards[gameData.boardNum].visible = true;
	
	runRandomNumber();
	preparePlayers();
	
	prepareArrow();
	playSound('soundStart');

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		if(socketData.host){
			postSocketUpdate('dice', gameData.diceNum);
		}
	}
}


 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	TweenMax.killAll();
}

/*!
 * 
 * SAVE GAME - This is the function that runs to save game
 * 
 */
function saveGame(score){
	if ( typeof toggleScoreboardSave == 'function' ) { 
		$.scoreData.score = score;
		if(typeof type != 'undefined'){
			$.scoreData.type = type;	
		}
		toggleScoreboardSave(true);
	}

	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

function updateGame(){
		
}

/*!
 * 
 * ANIMATE DICE - This is the function that runs to animate dice
 * 
 */
function animateDice(){
	if(gameData.move){
		return;	
	}

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		if(socketData.turn){
			postSocketUpdate('roll');
		}
	}
	
	playSound('soundDice');
	gameData.move = true;
	TweenMax.to(diceAnimate, 1, {overwrite:true, onUpdate:runRandomNumber, onComplete:animateDiceComplete});
}

function runRandomNumber(){
	gameData.diceNum = Math.floor(Math.random()*6);
	diceAnimate.gotoAndStop(gameData.diceNum);	
}

function animateDiceComplete(){
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		if(socketData.turn){
			postSocketUpdate('rollcomplete', gameData.diceNum);
		}
	}else{
		updateAnimateDiceComplete();
	}
}
function updateAnimateDiceComplete(){
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		TweenMax.killTweensOf(diceAnimate);
		diceAnimate.gotoAndStop(gameData.diceNum);
	}

	gameData.turn = gameData.diceNum+1;
	if(gameData.turn == 6){
		gameData.extraTurn = true;
	}
	gameData.reverse = false;
	movePlayer();	
}

/*!
 * 
 * PREPARE PLAYERS - This is the function that runs to setup players start position
 * 
 */
function preparePlayers(){
	var pathStartX = boards_arr[gameData.boardNum].startX;
	var pathStartY = boards_arr[gameData.boardNum].startY;
	var curPathStartX = pathStartX;
	var curPathStartY = pathStartY;
	
	for(var n = 0; n < gameData.players; n++){
		$.players[n].blockNum = -1;
		$.players[n].x = curPathStartX;
		$.players[n].y = curPathStartY;
		curPathStartX += 15;
		setZIndex($.players[n], 'back');
	}
}


/*!
 * 
 * MOVE PLAYERS - This is the function that runs to move players
 * 
 */
function movePlayer(){
	stopAnimateArrow(iconArrow);
	
	var newX;
	var newY;
	
	if(gameData.reverse){
		$.players[gameData.player].blockNum--;	
	}else{
		$.players[gameData.player].blockNum++;
	}
	
	if($.players[gameData.player].blockNum > boards_arr[gameData.boardNum].paths.length-1){
		gameData.reverse = true;
		$.players[gameData.player].blockNum--;
		$.players[gameData.player].blockNum--;
	}else if($.players[gameData.player].blockNum < 0){
		gameData.reverse = false;
		$.players[gameData.player].blockNum++;
		$.players[gameData.player].blockNum++;
	}
	var newPath = $.players[gameData.player].blockNum;
	
	newX = boards_arr[gameData.boardNum].paths[newPath].x;
	newY = boards_arr[gameData.boardNum].paths[newPath].y+.5;

	var moveNum = Math.floor(Math.random()*4)+1;
	playSound('soundMove'+moveNum);
	TweenMax.to($.players[gameData.player], moveSpeed, {x:newX, y:newY, overwrite:true, onComplete:movePlayerComplete});
}

function movePlayerComplete(){
	updatePlayersIndex();
	gameData.turn--;
	
	if(gameData.turn > 0){
		movePlayer();	
	}else{
		checkPathAction();
	}
}

/*!
 * 
 * CHECK PATH ACTION - This is the function that runs to check current square action
 * 
 */
function checkPathAction(){
	var curBlock = $.players[gameData.player].blockNum;
	if(boards_arr[gameData.boardNum].paths[curBlock].action.length > 0){
		
		if(boards_arr[gameData.boardNum].paths[curBlock].aOpt.type == 0){
			displayStatus('good');
		}else{
			displayStatus('bad');
		}
		
		TweenMax.to(playersContainer, .5, {overwrite:true, onComplete:function(){
			animateSlide($.players[gameData.player], boards_arr[gameData.boardNum].paths[curBlock].aOpt.speed, boards_arr[gameData.boardNum].paths[curBlock].action);	
		}});
	}else{
		checkNextMove();
	}
}

/*!
 * 
 * CHECK NEXT MOVE - This is the function that runs to check next move
 * 
 */
function checkNextMove(){
	if($.players[gameData.player].blockNum == boards_arr[gameData.boardNum].paths.length-1){
	    playSound('soundResult');
		
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			if(socketData.turn){
				displayStatus('userwin');
			}else{
				displayStatus('playerwin');
			}
		}else{
			if(gameData.mode == 'computer' && gameData.player == 0){
				displayStatus('userwin');
			}else{
				displayStatus('playerwin');
			}
		}
		
		TweenMax.to(playersContainer, 2.5, {overwrite:true, onComplete:function(){
			goPage('result');
		}});
	}else if(gameData.extraTurn){
		displayStatus('extra');
		
		TweenMax.to(playersContainer, .5, {overwrite:true, onComplete:function(){
			gameData.extraTurn = false;
			gameData.move = false;
			animateDice();
		}});
	}else{
		repositionPlayers();
		
		//next player
		gameData.player++;
		gameData.player = gameData.player > gameData.players-1 ? 0 : gameData.player;

		setZIndex($.players[gameData.player], 'front');

		TweenMax.to(playersContainer, .5, {overwrite:true, onComplete:function(){
			gameData.move = false;
			
			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				if(socketData.turn){
					setTimeout(function(){
						postSocketUpdate('movecomplete');
					}, 500);
				}
			}else{
				prepareArrow();
				if(gameData.mode == 'computer' && gameData.player != 0){
					animateDice();
				}
			}
		}});	
	}
}

/*!
 * 
 * REPOSITION PLAYERS - This is the function that runs to reposition players when in same square
 * 
 */
function repositionPlayers(){
	var posArray = [];
	for(var n = 0; n < gameData.players; n++){
		if($.players[n].blockNum >= 0){
			posArray.push({obj:$.players[n], block:$.players[n].blockNum, x:boards_arr[gameData.boardNum].paths[$.players[n].blockNum].x, y:boards_arr[gameData.boardNum].paths[$.players[n].blockNum].y});
		}
	}
	
	sortOnObject(posArray, 'block');
	
	var currentBlock = -1;
	var spaceArray = [{x:0, y:0},{x:10,y:-1},{x:-10,y:-1},{x:20,y:-2,},{x:-20,y:-2}];
	var posCount = 0;
	
	for(var n = 0; n < posArray.length; n++){
		if(currentBlock == posArray[n].block){
			posCount++;
		}else{
			currentBlock = posArray[n].block;
			posCount = 0;
		}
		
		var newX = posArray[n].x + spaceArray[posCount].x;
		var newY = posArray[n].y + spaceArray[posCount].y;

		TweenMax.to(posArray[n].obj, .1, {x:newX, y:newY, overwrite:true, onComplete:repositionComplete});
	}
}

/*!
 * 
 * SORT Z-INDEX - This is the function that runs to sort z-index
 * 
 */
function repositionComplete(){
	updatePlayersIndex();
}

function updatePlayersIndex(){
	playersContainer.sortChildren(sortFunction);
}

var sortFunction = function(obj1, obj2, options) {
	if (obj1.y > obj2.y) { return 1; }
	if (obj1.y < obj2.y) { return -1; }
	return 0;
}

function setZIndex(obj, con){
	if(con == 'back'){
		playersContainer.setChildIndex(obj, 0);
	}else{
		playersContainer.setChildIndex(obj, playersContainer.numChildren-1);
	}
}

/*!
 * 
 * DISPLAY ARROW - This is the function that runs to display arrow for turn
 * 
 */
function prepareArrow(){
	var distanceNum = 70;
	iconArrow.x = $.players[gameData.player].x;
	iconArrow.y = $.players[gameData.player].y-distanceNum;
	iconArrow.oriX = $.players[gameData.player].x;
	iconArrow.oriY = $.players[gameData.player].y-distanceNum;
	iconArrow.alpha = 1;
	
	startAnimateArrow(iconArrow);	
}

/*!
 * 
 * ANIMATE SLIDE - This is the function that runs to animate slide
 * 
 */
function animateSlide(obj, speed, array){
	TweenMax.to(obj, speed, {bezier:{type:"quadratic", values:array, autoRotate:false}, ease:Linear.easeNone, repeat:0, overwrite:true, onComplete:animateSlideComplete});
}

function animateSlideComplete(){
	if(!$.editor.enable){
		var nearestArray = [];
		for(n=0;n<boards_arr[gameData.boardNum].paths.length;n++){
			var dis = getDistanceByValue($.players[gameData.player].x, $.players[gameData.player].y, boards_arr[gameData.boardNum].paths[n].x, boards_arr[gameData.boardNum].paths[n].y);
			nearestArray.push({block:n, distance:dis});
		}
		
		sortOnObject(nearestArray, 'distance');
		$.players[gameData.player].blockNum = nearestArray[0].block;
		checkNextMove();	
	}
}

/*!
 * 
 * DISPLAY STATUS - This is the function that runs to display status
 * 
 */
function displayStatus(con){
	var statusText ='';
	if(con == 'extra'){
		playSound('soundExtra');
		statusText = extraMoveText;
	}else if(con == 'good'){
		playSound('soundLucky');
		var randomTextNum = Math.floor(Math.random()*goodMove_arr.length);
		statusText = goodMove_arr[randomTextNum];
	}else if(con == 'bad'){
		playSound('soundFail');
		var randomTextNum = Math.floor(Math.random()*badMove_arr.length);
		statusText = badMove_arr[randomTextNum];
	}else if(con == 'userwin'){
		statusText = userWinText;
	}else if(con == 'playerwin'){
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			statusText = winText.replace('[NUMBER]', socketData.winner);
		}else{
			statusText = winText.replace('[NUMBER]', gameData.player+1);
		}
	}
	
	statusShadowTxt.text = statusTxt.text = statusText;
	statusContainer.y = 100;
	statusContainer.alpha = 0;
	TweenMax.to(statusContainer, .6, {alpha:1, y:0, overwrite:true, ease:Expo.easeOut, onComplete:function(){
		TweenMax.to(statusContainer, .6, {alpha:0, y:-100, overwrite:true, ease:Expo.easeIn});
	}});
}

/*!
 * 
 * START ANIMATE BUTTON - This is the function that runs to play blinking animation
 * 
 */
function startAnimateArrow(obj){
	TweenMax.to(obj, .3, {y:obj.oriY-10, overwrite:true, onComplete:function(){
		TweenMax.to(obj, .3, {y:obj.oriY, overwrite:true, onComplete:function(){
			startAnimateArrow(obj);
		}});	
	}});
}

/*!
 * 
 * STOP ANIMATE BUTTON - This is the function that runs to stop blinking animation
 * 
 */
function stopAnimateArrow(obj){
	TweenMax.killTweensOf(obj);
	obj.alpha = 0;
}

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}

/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleGameMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}


/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	gtag('event','click',{'event_category':'share','event_label':action});
	
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	
	var title = shareTitle;
	var text = shareMessage;
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}else if( action == 'whatsapp' ){
		shareurl = "whatsapp://send?text=" + encodeURIComponent(text) + " - " + encodeURIComponent(loc);
	}
	
	window.open(shareurl);
}