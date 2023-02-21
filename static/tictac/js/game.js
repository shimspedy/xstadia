////////////////////////////////////////////////////////////
// GAME v1.5
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

//icons array
var iconsArr = [
	{o:'assets/icon_o_1.png', x:'assets/icon_x_1.png', oShadow:'assets/icon_o_1_shadow.png', xShadow:'assets/icon_x_1_shadow.png'},
	{o:'assets/icon_o_2.png', x:'assets/icon_x_2.png', oShadow:'assets/icon_o_1_shadow.png', xShadow:'assets/icon_x_1_shadow.png'},
	{o:'assets/icon_o_3.png', x:'assets/icon_x_3.png', oShadow:'assets/icon_o_1_shadow.png', xShadow:'assets/icon_o_1_shadow.png'},
	{o:'assets/icon_o_4.png', x:'assets/icon_x_4.png', oShadow:'assets/icon_o_1_shadow.png', xShadow:'assets/icon_o_1_shadow.png'},
	{o:'assets/icon_o_6.png', x:'assets/icon_x_6.png', oShadow:'assets/icon_o_6_shadow.png', xShadow:'assets/icon_x_6_shadow.png'},
	{o:'assets/icon_5.png', x:'assets/icon_5.png', oShadow:'assets/icon_o_1_shadow.png', xShadow:'assets/icon_o_1_shadow.png'},
]

//classic settings
var defaultSettings = {
	twoPlayer:true,
	size:3,
	win:3,
	levelMax:4,
	timeMax: 1000
};

//custom settings
var customSettings = {
	enable:true,
	twoPlayer:true,
	sizeMin:3,
	sizeMax:8,
	winMin:3,
	winMax:5,
	levelMax:4,
	timeMax: 1000
};

//board settings
var boardSettings = {
	width:100,
	margin:20,
	radius:15,
	shadowX:5,
	shadowY:10,
	size:5,
	win:5,
	color:'#012465',
	winColor:'#e2bf30',
	boardColor:'#0068c6',
	tweenSpeed:.3,
	tweenScale:2,
	tweenOffset:1.5,
	strokeEnable:true,
	strokeNumber:10,
	strokeColor:'#fff',
	timer:180000
};

//game text display
var textDisplay = {
					customTitle:'Custom Board',
					customSize:'[NUMBER] x [NUMBER] size',
					customWin:'[NUMBER] win',
					vs:'VS',
					player1:'Player 1',
					player2:'Player 2',
					computer:'SENGOV',
					userTurn:'Your turn',
					playerTurn:'[NAME] turn',
					computerTurn:'Thinking...',
					gameWin:'[NUMBER] win',
					draw:'Draw',
					timeUp:'Time\'s Up',
					exitTitle:'Exit Game',
					exitMessage:'Are you sure you want\nto quit game?',
					share:'Share your score:',
					resultTitle:'Game Over',
					resultDesc:'you won [NUMBER] round',
				}

//Social share, [SCORE] will replace with game score
var shareEnable = true; //toggle share
var shareTitle = 'Highscore on Tic Tac Toe is [SCORE]pts';//social share score title
var shareMessage = '[SCORE]pts is my new highscore on Tic Tac Toe game! Try it now!'; //social share score message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
$.editor = {enable:false};
var playerData = {score:0, opponentScore:0};
var gameData = {paused:true, moving:false, icon:0, iconSwitch:false, icons:['o','x'], type:'classic', custom:{size:0, win:0}, settings:{size:0, win:0, level:0, timer:0}, turn:0, player:0, ai:false, aiMove:false, complete:false};
var timeData = {enable:false, startDate:null, nowDate:null, timer:0, oldTimer:0};
var strokeData = {x:0, y:0};
var tweenData = {score:0, tweenScore:0};

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	buttonClassic.cursor = "pointer";
	buttonClassic.addEventListener("click", function(evt) {
		playSound('soundButton');
		gameData.type = 'classic';
		toggleMainButton('players');
	});

	buttonCustom.cursor = "pointer";
	buttonCustom.addEventListener("click", function(evt) {
		playSound('soundButton');
		gameData.type = 'custom';
		toggleMainButton('players');
	});

	buttonOnePlayer.cursor = "pointer";
	buttonOnePlayer.addEventListener("click", function(evt) {
		playSound('soundButton');
		checkGameType(true);
	});

	buttonTwoPlayer.cursor = "pointer";
	buttonTwoPlayer.addEventListener("click", function(evt) {
		playSound('soundButton');
		checkGameType(false);
	});

	buttonLocal.cursor = "pointer";
	buttonLocal.addEventListener("click", function(evt) {
		playSound('soundButton');
		socketData.online = false;
		toggleMainButton('default');
	});

	buttonOnline.cursor = "pointer";
	buttonOnline.addEventListener("click", function(evt) {
		playSound('soundButton');
		checkQuickGameMode();
	});

	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		playSound('soundButton');
		gameData.type = 'custom';
		if(multiplayerSettings.localPlay){
			toggleMainButton('local');
		}else{
			checkQuickGameMode();
		}
	});

	buttonSizeL.cursor = "pointer";
	buttonSizeL.addEventListener("click", function(evt) {
		playSound('soundButton2');
		toggleCustomSize(false);
	});

	buttonSizeR.cursor = "pointer";
	buttonSizeR.addEventListener("click", function(evt) {
		playSound('soundButton2');
		toggleCustomSize(true);
	});

	buttonWinL.cursor = "pointer";
	buttonWinL.addEventListener("click", function(evt) {
		playSound('soundButton2');
		toggleCustomWin(false);
	});

	buttonWinR.cursor = "pointer";
	buttonWinR.addEventListener("click", function(evt) {
		playSound('soundButton2');
		toggleCustomWin(true);
	});

	buttonCustomStart.cursor = "pointer";
	buttonCustomStart.addEventListener("click", function(evt) {
		playSound('soundButton');
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			postSocketUpdate('players');
		}else{
			goPage('players');
		}
	});

	buttonPlayersIcon.cursor = "pointer";
	buttonPlayersIcon.addEventListener("click", function(evt) {
		playSound('soundButton2');
		toggleGameIcon();
	});

	buttonPlayersSwitch.cursor = "pointer";
	buttonPlayersSwitch.addEventListener("click", function(evt) {
		playSound('soundButton2');
		toggleGameIconSide();
	});

	buttonPlayersStart.cursor = "pointer";
	buttonPlayersStart.addEventListener("click", function(evt) {
		playSound('soundButton');
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			postSocketUpdate('start');
		}else{
			goPage('game');
		}
	});
	
	itemExit.addEventListener("click", function(evt) {
	});
	
	buttonContinue.cursor = "pointer";
	buttonContinue.addEventListener("click", function(evt) {
		playSound('soundButton');
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
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleGameMute(false);
	});
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		togglePop(true);
		toggleOption();
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});
	
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
		
		stopAudio();
		stopGame();
		goPage('main');

		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			exitSocketRoom();
		}
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
	});

	gameData.custom.size = customSettings.sizeMin;
	gameData.custom.win = customSettings.winMin;
	checkCustomSettings();
	displayPlayerIcon();
}

/*!
 * 
 * TOGGLE GAME TYPE - This is the function that runs to toggle game type
 * 
 */
function toggleMainButton(con){
	if ( typeof initSocket == 'function' && multiplayerSettings.enable) {
		gameLogsTxt.visible = true;
		gameLogsTxt.text = '';
	}

	buttonStart.visible = false;
	buttonTypeContainer.visible = false;
	buttonPlayerContainer.visible = false;
	buttonLocalContainer.visible = false;

	if(con == 'default'){
		buttonTypeContainer.visible = true;
	}else if(con == 'start'){
		buttonStart.visible = true;
	}else if(con == 'local'){
		buttonLocalContainer.visible = true;
	}else if(con == 'players'){
		if(gameData.type == 'classic'){
			if(!defaultSettings.twoPlayer){
				goPage('category');
				return;
			}
		}else{
			if(!customSettings.twoPlayer){
				goPage('category');
				return;
			}
		}

		buttonPlayerContainer.visible = true;
	}
}

function checkGameType(con){
	gameData.ai = con;
	if(gameData.type == 'classic'){
		goPage('players');
	}else{
		goPage('custom');
	}
}

function checkQuickGameMode(){
	socketData.online = true;
	if(!multiplayerSettings.enterName){
		buttonStart.visible = false;
		buttonTypeContainer.visible = false;
		buttonPlayerContainer.visible = false;
		buttonLocalContainer.visible = false;

		addSocketRandomUser();
	}else{
		goPage('name');
	}
}

function toggleCustomSize(con){
	if(con){
		gameData.custom.size++;
		gameData.custom.size = gameData.custom.size > customSettings.sizeMax ? customSettings.sizeMax : gameData.custom.size;
	}else{
		gameData.custom.size--;
		gameData.custom.size = gameData.custom.size < customSettings.sizeMin ? customSettings.sizeMin : gameData.custom.size;
	}

	gameData.custom.win = gameData.custom.win > gameData.custom.size ? gameData.custom.size : gameData.custom.win;
	gameData.custom.win = gameData.custom.win < customSettings.sizeMin ? customSettings.sizeMin : gameData.custom.win;

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		postSocketUpdate('updatecustom', {size:gameData.custom.size, win:gameData.custom.win});
	}else{
		checkCustomSettings();
	}
}

function toggleCustomWin(con){
	if(con){
		gameData.custom.win++;
		gameData.custom.win = gameData.custom.win > gameData.custom.size ? gameData.custom.size : gameData.custom.win;
		gameData.custom.win = gameData.custom.win > customSettings.winMax ? customSettings.winMax : gameData.custom.win;
	}else{
		gameData.custom.win--;
		gameData.custom.win = gameData.custom.win < customSettings.winMin ? customSettings.winMin : gameData.custom.win;
	}

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		postSocketUpdate('updatecustom', {size:gameData.custom.size, win:gameData.custom.win});
	}else{
		checkCustomSettings();
	}
}

function checkCustomSettings(){
	var customSize = textDisplay.customSize.replace('[NUMBER]', gameData.custom.size);
	customSize = customSize.replace('[NUMBER]', gameData.custom.size);

	sizeTxt.text = customSize;
	winTxt.text = textDisplay.customWin.replace('[NUMBER]', gameData.custom.win);
}

function toggleGameIcon(){
	gameData.icon++;
	gameData.icon = gameData.icon > iconsArr.length-1 ? 0 : gameData.icon;

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		postSocketUpdate('updateplayers', {icon:gameData.icon, switch:gameData.iconSwitch, icons:gameData.icons});
	}else{
		displayPlayerIcon();
	}
}

function toggleGameIconSide(){
	gameData.iconSwitch = gameData.iconSwitch == true ? false : true;
	if(gameData.iconSwitch){
		gameData.icons = ['x','o'];
	}else{
		gameData.icons = ['o','x'];
	}

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		postSocketUpdate('updateplayers', {icon:gameData.icon, switch:gameData.iconSwitch, icons:gameData.icons});
	}else{
		displayPlayerIcon();
	}
}

function displayPlayerIcon(){
	for(var n=0; n<2; n++){
		$.players['playerIconContainer'+ n].removeAllChildren();
		
		var iconID = 'icon'+gameData.icon+gameData.icons[n];
		$.players['playerIcon'+ n] = new createjs.Bitmap(loader.getResult(iconID));
		centerReg($.players['playerIcon'+ n]);

		$.players['playerIconShadow'+ n] = new createjs.Bitmap(loader.getResult(iconID+'Shadow'));
		centerReg($.players['playerIconShadow'+ n]);

		$.players['playerIcon'+ n].y = -20;
		$.players['playerIconShadow'+ n].x = $.players['playerIcon'+ n].x + boardSettings.shadowX;
		$.players['playerIconShadow'+ n].y = $.players['playerIcon'+ n].y + boardSettings.shadowY;

		$.players['playerIconContainer'+ n].addChild($.players['playerIconShadow'+ n], $.players['playerIcon'+ n]);
	}
}

function resizeSocketLog(){
	gameLogsTxt.font = "30px bpreplaybold";
	gameLogsTxt.textAlign = "center";
	gameLogsTxt.color = "#ccc";

	if(curPage == 'main'){
		if(viewport.isLandscape){
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 75;
		}else{
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 75;
		}
	}else if(curPage == 'custom'){
		if(viewport.isLandscape){
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 67;
		}else{
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 65;
		}
	}
}

/*!
 * 
 * TOGGLE POP - This is the function that runs to toggle popup overlay
 * 
 */
function togglePop(con){
	confirmContainer.visible = con;
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
	customContainer.visible = false;
	playersContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	
	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;
			if ( typeof initSocket == 'function' && multiplayerSettings.enable) {
				toggleMainButton('start');
			}else{
				toggleMainButton('default');
			}
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

		case 'custom':
			targetContainer = customContainer;

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				buttonCustomStart.visible = false;
				buttonSizeL.visible = buttonSizeR.visible = false;
				buttonWinL.visible = buttonWinR.visible = false;

				if(socketData.host){
					buttonCustomStart.visible = true;
					buttonSizeL.visible = buttonSizeR.visible = true;
					buttonWinL.visible = buttonWinR.visible = true;
				}
			}
		break;

		case 'players':
			targetContainer = playersContainer;

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				buttonPlayersStart.visible = false;
				buttonPlayersIcon.visible = false;
				buttonPlayersSwitch.visible = false;

				if(socketData.host){
					buttonPlayersStart.visible = true;
					buttonPlayersIcon.visible = true;
					buttonPlayersSwitch.visible = true;
				}
			}else{
				if(gameData.ai){
					$.players['player'+ 1].text = textDisplay.computer;
				}else{
					$.players['player'+ 1].text = textDisplay.player2;
				}
			}
		break;
		
		case 'game':
			targetContainer = gameContainer;
			
			startGame();
		break;
		
		case 'result':
			targetContainer = resultContainer;
			stopGame();
			togglePop(false);
			
			playSound('soundResult');

			tweenData.tweenScore = 0;
			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				var playerScore = playerData.score;
				if(!socketData.host){
					playerScore = playerData.opponentScore;
				}
				TweenMax.to(tweenData, .5, {tweenScore:playerScore, overwrite:true, onUpdate:function(){
					resultDescTxt.text = textDisplay.resultDesc.replace('[NUMBER]', Math.floor(tweenData.tweenScore));
				}});
				
				if(socketData.host){
					postSocketCloseRoom();
				}

				saveGame(playerScore);
			}else{
				TweenMax.to(tweenData, .5, {tweenScore:playerData.score, overwrite:true, onUpdate:function(){
					resultDescTxt.text = textDisplay.resultDesc.replace('[NUMBER]', Math.floor(tweenData.tweenScore));
				}});

				saveGame(playerData.score);
			}
		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

/*!
 * 
 * START GAME - This is the function that runs to start game
 * 
 */
function startGame(){
	gameData.paused = false;
	gameData.complete = false;
	gameData.turn = 0;
	gameData.player = 0;
	gameData.moving = false;

	buildPlayers();

	if(gameData.type == 'classic'){
		gameData.settings = {
			size:defaultSettings.size,
			win:defaultSettings.win,
			level:defaultSettings.levelMax,
			timer:defaultSettings.timeMax
		};
	}else{
		gameData.settings = {
			size:gameData.custom.size,
			win:gameData.custom.win,
			level:customSettings.levelMax,
			timer:customSettings.timeMax
		};
	}

	timeData.oldTimer = -1;
	timeData.countdown = boardSettings.timer;
	timerTxt.text = timerRedTxt.text = millisecondsToTimeGame(timeData.countdown);
	timerRedTxt.alpha = 0;

	statusContainer.alpha = 0;

	buildBoard();
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		if(socketData.host){
			toggleGameTimer(true);
		}
	}else{
		toggleGameTimer(true);
	}
}

/*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	boardDesignContainer.removeAllChildren();
	boardIconContainer.removeAllChildren();

	gameData.paused = true;
	TweenMax.killAll(false, true, false);
}

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

/*!
 * 
 * BUILD PLAYERS - This is the function that runs to build players
 * 
 */
function buildPlayers(){
	for(var n=0; n<2; n++){
		$.players['gameIconContainer'+ n].removeAllChildren();

		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {

		}else{
			if(n == 1){
				if(gameData.ai){
					$.players['gamePlayer'+ 1].text = textDisplay.computer;
				}else{
					$.players['gamePlayer'+ 1].text = textDisplay.player2;
				}
			}
		}

		$.players['gameTurn'+ n].text = '';

		var iconID = 'icon'+gameData.icon+gameData.icons[n];
		$.players['gameIcon'+ n] = new createjs.Bitmap(loader.getResult(iconID));
		centerReg($.players['gameIcon'+ n]);
		$.players['gameIconShadow'+ n] = new createjs.Bitmap(loader.getResult(iconID+'Shadow'));
		centerReg($.players['gameIconShadow'+ n]);

		$.players['gameIcon'+ n].y = -35;
		$.players['gameIconShadow'+ n].x = $.players['gameIcon'+ n].x + boardSettings.shadowX;
		$.players['gameIconShadow'+ n].y = $.players['gameIcon'+ n].y + boardSettings.shadowY;

		$.players['gameIconContainer'+ n].addChild($.players['gameIconShadow'+ n], $.players['gameIcon'+ n]);
	}

	playerData.score = 0;
	playerData.opponentScore = 0;
	displayPlayerScore();
}

/*!
 * 
 * BUILD BOARD - This is the function that runs to build board
 * 
 */
function buildBoard(){
	playSound('soundStart');
	statusContainer.alpha = 0;

	boardDesignContainer.removeAllChildren();
	boardIconContainer.removeAllChildren();
	boardStroke.graphics.clear();

	gameData.complete = false;
	gameData.aiMove = false;
	gameData.board = [];

	var bgWidth = (boardSettings.width + (boardSettings.margin/2)) * gameData.settings.size;
	var bgHeight = (boardSettings.width + (boardSettings.margin/2)) * gameData.settings.size;
	bgWidth += boardSettings.margin/2;
	bgHeight += boardSettings.margin/2;
	var bgBoard = new createjs.Shape();
	bgBoard.graphics.beginFill(boardSettings.boardColor).drawRoundRectComplex(-(bgWidth/2), -(bgHeight/2), bgWidth, bgHeight, boardSettings.radius, boardSettings.radius, boardSettings.radius, boardSettings.radius);
	boardDesignContainer.addChild(bgBoard);

	var positionData = {x:0, y:0, sX:0, sY:0};
	positionData.sX = -(((boardSettings.width + (boardSettings.margin/2)) * (gameData.settings.size-1))/2);
	positionData.sY = -(((boardSettings.width + (boardSettings.margin/2)) * (gameData.settings.size-1))/2);
	positionData.x = positionData.sX;
	positionData.y = positionData.sY;

	var totalCount = 0;
	for(var r=0; r<gameData.settings.size; r++){
		gameData.board.push([]);
		for(var c=0; c<gameData.settings.size; c++){
			var bgWin = new createjs.Shape();
			bgWin.graphics.beginFill(boardSettings.winColor).drawRoundRectComplex(-(boardSettings.width/2), -(boardSettings.width/2), boardSettings.width, boardSettings.width, boardSettings.radius, boardSettings.radius, boardSettings.radius, boardSettings.radius);
			bgWin.alpha = 0;
			
			gameData.board[r][c] = new createjs.Shape();
			gameData.board[r][c].graphics.beginFill(boardSettings.color).drawRoundRectComplex(-(boardSettings.width/2), -(boardSettings.width/2), boardSettings.width, boardSettings.width, boardSettings.radius, boardSettings.radius, boardSettings.radius, boardSettings.radius);
			gameData.board[r][c].hitArea = new createjs.Shape(new createjs.Graphics().beginFill('#000').drawRect(-(boardSettings.width/2), -(boardSettings.width/2), boardSettings.width, boardSettings.width));	
			gameData.board[r][c].bgWin = bgWin;
			boardDesignContainer.addChild(gameData.board[r][c], bgWin);

			gameData.board[r][c].x = bgWin.x = positionData.x;
			gameData.board[r][c].y = bgWin.y = positionData.y;
			positionData.x += boardSettings.width + (boardSettings.margin/2);

			gameData.board[r][c].row = r;
			gameData.board[r][c].column = c;
			gameData.board[r][c].id = totalCount;
			gameData.board[r][c].player = -1;

			gameData.board[r][c].cursor = "pointer";
			gameData.board[r][c].addEventListener("click", function(evt) {
				if(gameData.paused){
					return;
				}
				
				if(gameData.complete){
					return;
				}
			
				if(gameData.moving){
					return;
				}

				if(gameData.ai){
					if(gameData.player == 1){
						return;
					}

					gameData.aiMove = true;
				}

				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					if(!socketData.turn){
						return;
					}
				}

				if(evt.target.player == -1){
					if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
						postSocketUpdate('updateicon', {row:evt.target.row, column:evt.target.column, player:gameData.player});
					}else{
						placeIcon(evt.target.row, evt.target.column, gameData.player);
					}
				}
			});
			totalCount++;
		}

		positionData.x = positionData.sX;
		positionData.y += boardSettings.width + (boardSettings.margin/2);
	}

	statusContainer.y = (bgHeight/2) + 10;
	
	boardContainer.scaleX = boardContainer.scaleY = 1;
	var minBoardHeight = 500;
	if(bgHeight > minBoardHeight){
		var boardScale = minBoardHeight/bgHeight;
		boardContainer.scaleX = boardContainer.scaleY = boardScale;
	}

	if(gameData.player == 1 && gameData.ai){
		moveAI();
	}

	displayPlayerTurn();
}

/*!
 * 
 * DISPLAY PLAYER TURN - This is the function that runs to display playter turn
 * 
 */
function displayPlayerTurn(){
	for(var n=0; n<2; n++){
		var userTurn = '';
		if(n == gameData.player && !gameData.complete){
			userTurn = textDisplay.userTurn;

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				if(socketData.host){
					userTurn = n == 1 ? textDisplay.playerTurn.replace('[NAME]', $.players['gamePlayer'+ n].text) : userTurn;
				}else{
					userTurn = n == 0 ? textDisplay.playerTurn.replace('[NAME]', $.players['gamePlayer'+ n].text) : userTurn;
				}
			}else{
				if(n == 1 && gameData.ai){
					userTurn = textDisplay.computerTurn;
				}
			}
		}

		$.players['gameTurn'+ n].text = userTurn;

		TweenMax.killTweensOf($.players['gameTurn'+ n]);
		if(userTurn != ''){
			animatePlayerTurn($.players['gameTurn'+ n]);
		}
	}
}

function animatePlayerTurn(obj){
	obj.alpha = .3;
	var tweenSpeed = .2;
	TweenMax.to(obj, tweenSpeed, {alpha:1, overwrite:true, onComplete:function(){
		TweenMax.to(obj, tweenSpeed, {alpha:.3, overwrite:true, onComplete:animatePlayerTurn, onCompleteParams:[obj]});
	}});
}

/*!
 * 
 * ANIMATE TIMER - This is the function that runs to animate countdown
 * 
 */
function animateTimer(){
	timerRedTxt.alpha = 0;
	TweenMax.to(timerRedTxt, .5, {alpha:1, overwrite:true});
}

/*!
 * 
 * GAME STATUS - This is the function that runs to show game status
 * 
 */
function showGameStatus(con){
	if(con == 'timer'){
		statusTxt.text = textDisplay.timeUp;
	}else{
		statusTxt.text = textDisplay.draw;
	}

	statusContainer.alpha = 0;
	TweenMax.to(statusContainer, .5, {alpha:1, overwrite:true});
}

/*!
 * 
 * DISPLAY PLAYER SCORE - This is the function that runs to display player score
 * 
 */
function displayPlayerScore(){
	for(var n=0; n<2; n++){
		if(n == 0){
			$.players['gameWin'+ n].text = textDisplay.gameWin.replace('[NUMBER]', playerData.score);
		}else{
			$.players['gameWin'+ n].text = textDisplay.gameWin.replace('[NUMBER]', playerData.opponentScore);
		}
	}
}

/*!
 * 
 * PLACE ICON - This is the function that runs to display icon
 * 
 */
function placeIcon(r, c, player){
	gameData.moving = true;

	var randomSound = Math.floor(Math.random()*3);
	playSound('soundDrop'+(randomSound+1));

	var iconID = player == 0 ? 'icon'+gameData.icon+gameData.icons[0] : 'icon'+gameData.icon+gameData.icons[1];
	var newIcon = new createjs.Bitmap(loader.getResult(iconID));
	centerReg(newIcon);
	var newIconShadow = new createjs.Bitmap(loader.getResult(iconID+'Shadow'));
	centerReg(newIconShadow);

	gameData.board[r][c].player = player;
	gameData.board[r][c].icon = newIcon;

	newIcon.x = gameData.board[r][c].x * boardSettings.tweenOffset;
	newIcon.y = gameData.board[r][c].y * boardSettings.tweenOffset;
	newIconShadow.x = gameData.board[r][c].x + boardSettings.shadowX;
	newIconShadow.y = gameData.board[r][c].y + boardSettings.shadowY;
	newIcon.scaleX = newIcon.scaleY = boardSettings.tweenScale;

	boardIconContainer.addChild(newIconShadow, newIcon);

	newIconShadow.alpha = 0;
	TweenMax.to(newIconShadow, boardSettings.tweenSpeed, {alpha:1, scaleX:1, scaleY:1, ease:Expo.easeOut, overwrite:true});

	TweenMax.to(newIcon, boardSettings.tweenSpeed, {scaleX:1, scaleY:1, x:gameData.board[r][c].x, y:gameData.board[r][c].y, ease:Expo.easeOut, overwrite:true, onComplete:function(){
		togglePlayer();
		checkAnyPlayersWin(r, c, player);
		displayPlayerTurn();

		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			if(socketData.turn){
				setTimeout(function(){
					postSocketUpdate('updatemovecomplete');
				}, 500);
			}
		}else{
			gameData.moving = false;
		}
	}});
}

/*!
 * 
 * TOGGLE PLAYER - This is the function that runs to toggle player
 * 
 */
function togglePlayer(){
	gameData.player = gameData.player == 0 ? 1 : 0;
}

/*!
 * 
 * CHECK PLAYERS WIN - This is the function that runs to check player win
 * 
 */
function checkAnyPlayersWin(r, c, player){
	var tweenTimer = 2.5;
	var line = winLine(bdSimple(), r, c, player)
	if (line.length > 0) {
		gameData.complete = true;

		if(player == 0){
			playerData.score++;
		}else{
			playerData.opponentScore++;
		}
		displayPlayerScore();
		animateWinBoard(line);
		playSound('soundComplete');
	} else {
		if (gameOverQ(bdSimple())) {
			tweenTimer = 1.5;
			gameData.complete = true;
			showGameStatus('draw');
			playSound('soundDraw');
		} else {
			if(gameData.aiMove){
				gameData.aiMove = false;
				moveAI();
			}
		}
	}

	if(gameData.complete){
		gameData.turn = gameData.turn == 1 ? 0 : 1;
		gameData.player = gameData.turn;
		TweenMax.to(gameContainer, tweenTimer, {overwrite:true, onComplete:function(){
			buildBoard();

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				if(socketData.turn){
					postSocketUpdate('updateroundcomplete');
				}
			}
		}});
	}
}

/*!
 * 
 * ANIMATE WIN BOARD - This is the function that runs to animate win board
 * 
 */
function animateWinBoard(line){
	if(boardSettings.strokeEnable){
		boardStroke.graphics.setStrokeStyle(boardSettings.strokeNumber,"round").beginStroke(boardSettings.strokeColor);
		boardStroke.rotation = setRotation(gameData.board[line[0][0]][line[0][1]].x, gameData.board[line[0][0]][line[0][1]].y, gameData.board[line[line.length-1][0]][line[line.length-1][1]].x, gameData.board[line[line.length-1][0]][line[line.length-1][1]].y);
		
		var rotateArray = [0, 90, 180, 270];
		var strokeW = boardSettings.width * gameData.settings.win;
		var centerPos = getCenterPosition(gameData.board[line[0][0]][line[0][1]].x, gameData.board[line[0][0]][line[0][1]].y, gameData.board[line[line.length-1][0]][line[line.length-1][1]].x, gameData.board[line[line.length-1][0]][line[line.length-1][1]].y);
		boardStroke.x = centerPos.x;
		boardStroke.y = centerPos.y;

		if(rotateArray.indexOf(Math.abs(boardStroke.rotation)) == -1){
			strokeW += (boardSettings.width * 1.2);
		}

		boardStroke.graphics.mt(-(strokeW/2), 0);
		strokeData.x = -(strokeW/2);
		strokeData.y = 0;

		TweenMax.to(strokeData, .5, {x:strokeW/2, y:0, overwrite:true, onUpdate:function(){
			boardStroke.graphics.lt(strokeData.x, strokeData.y);
		}});
	}

	for(var n=0; n<line.length; n++){
		var targetBgWin = gameData.board[line[n][0]][line[n][1]].bgWin;
		var targetIcon = gameData.board[line[n][0]][line[n][1]].icon;
		TweenMax.to(targetBgWin, .5, {alpha:1, overwrite:true});
		animateWinIcon(targetIcon);
	}
}

/*!
 * 
 * ANIMATE WIN ICONS - This is the function that runs to animate win icons
 * 
 */
function animateWinIcon(obj){
	TweenMax.to(obj, .5, {scaleX:1.2, scaleY:1.2, ease:Expo.easeIn, overwrite:true, onComplete:function(){
		TweenMax.to(obj, .5, {scaleX:1, scaleY:1, ease:Expo.easeOut, overwrite:true});
	}});
}

/*!
 * 
 * AI MOVE - This is the function that runs to move AI
 * 
 */
function moveAI() {
	gameData.moving = true;

	TweenMax.to(gameContainer, .5, {overwrite:true, onComplete:function(){
		var move = moveAIBest(bdSimple(), 1);
		TweenMax.to(gameContainer, .5, {overwrite:true, onComplete:function(){
			if(move.length > 0){
				placeIcon(move[0], move[1], 1);
			}else{
				var randomR = randomIntFromInterval(0, gameData.settings.size-1);
				var randomC = randomIntFromInterval(0, gameData.settings.size-1);
				placeIcon(randomR, randomC, 1);
			}
		}});
	}});
}

function moveAIBest(bd, player){
	gameData.settings.choice = []
	gameData.settings.aiplayer = player;

	gameData.settings.stt = performance.now();
	alphaBetaMinimax(bd, 0, [0, 0], player, -Infinity, +Infinity);
	return gameData.settings.choice;
}

function bdSimple() {
	var bd = []
	for(var r=0; r<gameData.settings.size; r++){
		bd[r] = []
		for(var c=0; c<gameData.settings.size; c++){
			bd[r][c] = gameData.board[r][c].player;
		}
	}
	return bd
}

function alphaBetaMinimax(bd, depth, move, player, alpha, beta) {
	var playerPrev = 1 - player;
	var line = winLine(bd, move[0], move[1], playerPrev);
	if (line.length > 0) {
		if (playerPrev == gameData.settings.aiplayer) {
			return 20 - depth;
		} else {
			return depth - 20;
		}
	}
	if (depth > gameData.settings.level) return randomIntFromInterval(-5, 5)
	var elapsed = performance.now() - gameData.settings.stt;
	if (depth > 3 && elapsed > gameData.settings.timer) return 0
	depth += 1;
	var availableMoves = getAvailableMoves(bd);
	if (availableMoves.length == 0) {
		return randomIntFromInterval(-5, 5)
	}
	var move, result;
	if (player === gameData.settings.aiplayer) {
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			bd[move[0]][move[1]] = player
			result = alphaBetaMinimax(bd, depth, move, 1 - player, alpha, beta);
			bd[move[0]][move[1]] = -1
			if (result > alpha) {
				alpha = result;
				if (depth == 1) {
					gameData.settings.choice = move;
				}
			} else if (alpha >= beta) {
				return alpha;
			}
		}
		return alpha;
	} else {
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			bd[move[0]][move[1]] = player
			result = alphaBetaMinimax(bd, depth, move, 1 - player, alpha, beta);
			bd[move[0]][move[1]] = -1
			if (result < beta) {
				beta = result;
				if (depth == 1) {
					gameData.settings.choice = move;
				}
			} else if (beta <= alpha) {
				return beta;
			}
		}
		return beta;
	}
}

function getAvailableMoves(bd) {
	var moves = [];
	if (gameData.settings.size <= 5) {
		for(var r=0; r<gameData.settings.size; r++){
			for(var c=0; c<gameData.settings.size; c++){
				if (bd[r][c] == -1) moves.push([r, c]);
			}
		}
	} else {
		for(var r=0; r<gameData.settings.size; r++){
			for(var c=0; c<gameData.settings.size; c++){
				if (bd[r][c] == -1) {
					if (bdNear(bd, r, c, 2)) {
						moves.push([r, c])
					}
				}
			}
		}
	}
	return moves
}

function bdNear(bd, r, c, n) {
	var dirs = [
		[0, -1],
		[1, -1],
		[1, 0],
		[1, 1],
		[0, 1],
		[-1, 1],
		[-1, 0],
		[-1, -1]
	];
	for (var k = 0; k < dirs.length; k++) {
		var dir = dirs[k];
		for (var m = 1; m <= n; m++) {
			if (bdPlayer(bd, r + dir[0] * m, c + dir[1] * m) != -1) return true
		}
	}
	return false
}

function winLine(bd, r, c, player) {
	var dirs = [
		[1, 0],
		[0, 1],
		[1, 1],
		[1, -1]
	];
	for (var i = 0; i < dirs.length; i++) {
		var dir = dirs[i]
		for (var j = 1 - gameData.settings.win; j < gameData.settings.win; j++) {
			var sttr = r + dir[0] * j
			var sttrc = c + dir[1] * j
			var winQ = true
			var line = [];
			for (var k = 0; k < gameData.settings.win; k++) {
				var ri = sttr + dir[0] * k
				var ci = sttrc + dir[1] * k
				line.push([ri, ci])
				if (bdPlayer(bd, ri, ci) != player) {
					winQ = false
					continue
				}
			}
			if (winQ) {
				return line
			}
		}
	}
	return [];
}

function bdPlayer(bd, r, c) {
	if (r < 0) return -1
	if (c < 0) return -1
	if (r >= gameData.settings.size) return -1
	if (c >= gameData.settings.size) return -1
	return bd[r][c]
}

function gameOverQ(bd) {
	for(var r=0; r<gameData.settings.size; r++){
		for(var c=0; c<gameData.settings.size; c++){
			if (bdPlayer(bd, r, c) == -1) return false
		}
	}
	return true
}


/*!
 * 
 * GAME TIMER - This is the function that runs for game timer
 * 
 */
function toggleGameTimer(con){
	if(con){
		timeData.startDate = new Date();
	}else{
		
	}
	timeData.enable = con;
}

/*!
 * 
 * UPDATE GAME - This is the function that runs to loop game update
 * 
 */
function updateGame(){
	if(!gameData.paused){
		if(timeData.enable){
			timeData.nowDate = new Date();
			timeData.elapsedTime = Math.floor((timeData.nowDate.getTime() - timeData.startDate.getTime()));
			timeData.timer = Math.floor((timeData.countdown) - (timeData.elapsedTime));

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				postSocketUpdate('updatetimer', timeData.timer);
			}else{
				updateTimer();
			}
		}
	}
}

function updateTimer(){
	if(timeData.oldTimer == -1){
		timeData.oldTimer = timeData.timer;
	}

	if(timeData.timer <= 0){
		//stop
		showGameStatus('timer');
		endGame();
	}else{
		if((timeData.oldTimer - timeData.timer) > 1000){
			if(timeData.timer < 1000){
				animateTimer()
				playSound('soundCountdownEnd');
			}else if(timeData.timer < 6000){
				animateTimer()
				playSound('soundCountdown');
			}
			timeData.oldTimer = timeData.timer;
		}
		
		timerTxt.text = timerRedTxt.text = millisecondsToTimeGame(timeData.timer);
	}
}


/*!
 * 
 * END GAME - This is the function that runs for game end
 * 
 */
function endGame(){
	gameData.paused = true;

	toggleGameTimer(false);
	TweenMax.to(gameContainer, 2, {overwrite:true, onComplete:function(){
		goPage('result')
	}});
}

/*!
 * 
 * MILLISECONDS CONVERT - This is the function that runs to convert milliseconds to time
 * 
 */
function millisecondsToTimeGame(milli) {
	var milliseconds = milli % 1000;
	var seconds = Math.floor((milli / 1000) % 60);
	var minutes = Math.floor((milli / (60 * 1000)) % 60);
	
	if(seconds<10){
		seconds = '0'+seconds;  
	}
	
	if(minutes<10){
		minutes = '0'+minutes;  
	}
	
	return minutes+':'+seconds;
}

/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

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
	
	var title = '';
	var text = '';
	
	title = shareTitle.replace("[SCORE]", playerData.score);
	text = shareMessage.replace("[SCORE]", playerData.score);
	
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