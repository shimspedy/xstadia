////////////////////////////////////////////////////////////
// GAME v1.2
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

//icons array
var iconsArr = [
	{white:'assets/icon_white_1.png', black:'assets/icon_black_1.png', shadow:'assets/icon_shadow_1.png', whiteH:'assets/icon_whiteh_1.png', blackH:'assets/icon_blackh_1.png'},
	{white:'assets/icon_white_2.png', black:'assets/icon_black_2.png', shadow:'assets/icon_shadow_1.png', whiteH:'assets/icon_whiteh_1.png', blackH:'assets/icon_blackh_1.png'},
	{white:'assets/icon_white_3.png', black:'assets/icon_black_3.png', shadow:'assets/icon_shadow_1.png', whiteH:'assets/icon_whiteh_1.png', blackH:'assets/icon_blackh_1.png'},
	{white:'assets/icon_white_4.png', black:'assets/icon_black_4.png', shadow:'assets/icon_shadow_1.png', whiteH:'assets/icon_whiteh_1.png', blackH:'assets/icon_blackh_1.png'},
	{white:'assets/icon_white_5.png', black:'assets/icon_black_5.png', shadow:'assets/icon_shadow_1.png', whiteH:'assets/icon_whiteh_1.png', blackH:'assets/icon_blackh_1.png'},
	{white:'assets/icon_white_6.png', black:'assets/icon_black_6.png', shadow:'assets/icon_shadow_1.png', whiteH:'assets/icon_whiteh_1.png', blackH:'assets/icon_blackh_1.png'}
]

//classic settings
var defaultSettings = {
	twoPlayer:true,
	size:8
};

//custom settings
var customSettings = {
	enable:true,
	twoPlayer:true,
	sizeMin:4,
	sizeMax:16
};

//board settings
var boardSettings = {
	width:60,
	dotSize:8,
	border:3,
	radius:5,
	outerBorder:4,
	outerRadius:5,
	shadowX:2,
	shadowY:5,
	moveColor:'#fff',
	boardColor:['#068646','#046233'],
	borderColor:'#000',
	tweenPlaceSpeed:.3,
	tweenPlaceScale:2,
	tweenPlaceOffset:1.5,
	showPlayerMove:true, 
	showPlayerMoveMouseover:false,
	tweenFlipSpeed:.2,
};

//game text display
var textDisplay = {
					customTitle:'CUSTOM BOARD',
					customSize:'[NUMBER] x [NUMBER] SQUARE',
					vs:'VS',
					player1:'PLAYER 1',
					player2:'PLAYER 2',
					computer:'SENGOV',
					userTurn:'YOUR TURN',
					playerTurn:'[NAME] TURN',
					computerTurn:'THINKING...',
					playerTotal:'[NUMBER] TILES',
					userNoMove:'NO MORE MOVE!',
					playerNoMove:'NO MORE MOVE!',
					gameWin:'[PLAYER] WON!',
					draw:'GAME DRAW!',
					exitTitle:'EXIT GAME',
					exitMessage:'Are you sure you want\nto quit game?',
					share:'SHARE YOUR SCORE:',
					resultTitle:'GAME OVER',
					resultDesc:'SCORE : [NUMBER] TILES',
				}

//Social share, [SCORE] will replace with game score
var shareEnable = true; //toggle share
var shareTitle = 'Highscore on Play Reversi is [SCORE] tiles';//social share score title
var shareMessage = '[SCORE] tiles is my new highscore on Play Reversi game! Try it now!'; //social share score message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
$.editor = {enable:false};
var playerData = {score:0, opponentScore:0};
var gameData = {paused:true, moving:false, icon:0, iconSwitch:false, icons:['white','black'], type:'classic', custom:{size:0}, settings:{size:0}, player:0, ai:false, aiMove:false, complete:false};
var timeData = {enable:false, startDate:null, nowDate:null, timer:0, oldTimer:0, playerTimer:0, opponentTimer:0, playerAccumulate:0, opponentAccumulate:0};
var tweenData = {score:0, tweenScore:0};

var badMoves = [
	{r: 1, c: 1},
	{r: 6, c: 6},
	{r: 1, c: 6},
	{r: 6, c: 1}
];

var preferedMoves = [
	{r: 0, c: 0},
	{r: 7, c: 7},
	{r: 0, c: 7},
	{r: 7, c: 0}
]

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

	if(!isEven(gameData.custom.size)){
		toggleCustomSize(con);
		return;
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
		gameData.icons = ['black','white'];
	}else{
		gameData.icons = ['white','black'];
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

		$.players['playerIconShadow'+ n] = new createjs.Bitmap(loader.getResult('icon'+gameData.icon+'shadow'));
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

				if(socketData.host){
					buttonCustomStart.visible = true;
					buttonSizeL.visible = buttonSizeR.visible = true;
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
	gameData.player = randomBoolean() == true ? 0 : 1;
	gameData.moving = false;

	timeData.playerAccumulate = 0;
	timeData.opponentAccumulate = 0;
	timeData.playerTimer = 0;
	timeData.opponentTimer = 0;

	buildPlayers();
	if(gameData.type == 'classic'){
		gameData.settings = {
			size:defaultSettings.size
		};
	}else{
		gameData.settings = {
			size:gameData.custom.size
		};
	}

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
		$.players['gameTimer'+ n].text = millisecondsToTimeGame(0);

		var iconID = 'icon'+gameData.icon+gameData.icons[n];
		$.players['gameIcon'+ n] = new createjs.Bitmap(loader.getResult(iconID));
		centerReg($.players['gameIcon'+ n]);
		$.players['gameIconShadow'+ n] = new createjs.Bitmap(loader.getResult('icon'+gameData.icon+'shadow'));
		centerReg($.players['gameIconShadow'+ n]);

		$.players['gameIcon'+ n].y = -45;
		$.players['gameIconShadow'+ n].x = $.players['gameIcon'+ n].x + boardSettings.shadowX;
		$.players['gameIconShadow'+ n].y = $.players['gameIcon'+ n].y + boardSettings.shadowY;

		$.players['gameIconContainer'+ n].addChild($.players['gameIconShadow'+ n], $.players['gameIcon'+ n]);
	}

	playerData.score = 2;
	playerData.opponentScore = 2;
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

	gameData.complete = false;
	gameData.aiMove = false;
	gameData.board = [];

	var bgWidth = (boardSettings.width + (boardSettings.outerBorder/2)) * gameData.settings.size;
	var bgHeight = (boardSettings.width + (boardSettings.outerBorder/2)) * gameData.settings.size;
	bgWidth += boardSettings.outerBorder/2;
	bgHeight += boardSettings.outerBorder/2;
	var bgBoard = new createjs.Shape();
	bgBoard.graphics.beginFill(boardSettings.borderColor).drawRoundRectComplex(-(bgWidth/2), -(bgHeight/2), bgWidth, bgHeight, boardSettings.outerRadius, boardSettings.outerRadius, boardSettings.outerRadius, boardSettings.outerRadius);
	boardDesignContainer.addChild(bgBoard);

	var positionData = {x:0, y:0, sX:0, sY:0};
	positionData.sX = -((boardSettings.width * (gameData.settings.size-1))/2);
	positionData.sY = -((boardSettings.width * (gameData.settings.size-1))/2);
	positionData.x = positionData.sX;
	positionData.y = positionData.sY;

	var totalCount = 0;
	for(var r=0; r<gameData.settings.size; r++){
		gameData.board.push([]);
		for(var c=0; c<gameData.settings.size; c++){
			var bgMoveA = new createjs.Bitmap(loader.getResult('icon'+gameData.icon+gameData.icons[0]+'h'));
			centerReg(bgMoveA);
			var bgMoveB = new createjs.Bitmap(loader.getResult('icon'+gameData.icon+gameData.icons[1]+'h'));
			centerReg(bgMoveB);
			bgMoveA.visible = bgMoveB.visible = false;

			var bgColor = 0;
			if ((r + c) % 2 == 0) {
				bgColor = 1;
			}
			
			gameData.board[r][c] = new createjs.Shape();
			gameData.board[r][c].graphics.setStrokeStyle(boardSettings.border).beginStroke(boardSettings.borderColor).beginFill(boardSettings.boardColor[bgColor]).drawRoundRectComplex(-(boardSettings.width/2), -(boardSettings.width/2), boardSettings.width, boardSettings.width, boardSettings.radius, boardSettings.radius, boardSettings.radius, boardSettings.radius);
			gameData.board[r][c].bgMoveA = bgMoveA;
			gameData.board[r][c].bgMoveB = bgMoveB;
			boardDesignContainer.addChild(gameData.board[r][c], bgMoveA, bgMoveB);

			gameData.board[r][c].x = bgMoveA.x = bgMoveB.x = positionData.x;
			gameData.board[r][c].y = bgMoveA.y = bgMoveB.y = positionData.y;
			positionData.x += boardSettings.width;

			gameData.board[r][c].row = r;
			gameData.board[r][c].column = c;
			gameData.board[r][c].id = totalCount;
			gameData.board[r][c].player = 0;
			gameData.board[r][c].move = false;
			gameData.board[r][c].icon = null;
			gameData.board[r][c].iconShadow = null;

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

				if(evt.target.player == 0){
					var targetMove = gameData.player == 0 ? gameData.board[evt.target.row][evt.target.column].bgMoveA : gameData.board[evt.target.row][evt.target.column].bgMoveB;
					if(targetMove.visible){
						if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
							postSocketUpdate('makemove', {row:evt.target.row, column:evt.target.column, player:gameData.player, animate:true});
						}else{
							makeMove(evt.target.row, evt.target.column, gameData.player, true);
						}
					}
				}
			});

			gameData.board[r][c].addEventListener("mouseover", function(evt) {
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

				var socketMove = true;
				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					if(!socketData.turn){
						socketMove = false;
					}
				}
				
				if(boardSettings.showPlayerMove && boardSettings.showPlayerMoveMouseover){
					var player = gameData.player == 0 ? 1 : -1;
					if(isValidMove(evt.target.row,evt.target.column,gameData.board,player) && socketMove){
						gameData.board[evt.target.row][evt.target.column].move = true;
						var targetMove = gameData.player == 0 ? gameData.board[evt.target.row][evt.target.column].bgMoveA : gameData.board[evt.target.row][evt.target.column].bgMoveB;
						targetMove.visible = true;
						animatePlayerMove(targetMove);
					}
				}
			});

			gameData.board[r][c].addEventListener("mouseout", function(evt) {
				if(boardSettings.showPlayerMove && boardSettings.showPlayerMoveMouseover && gameData.board[evt.target.row][evt.target.column].move){
					resetValidMove(evt.target.row, evt.target.column);
				}
			});
			totalCount++;
		}

		positionData.x = positionData.sX;
		positionData.y += boardSettings.width;
	}
	
	if(gameData.settings.size == 8){
		var dotArr = [
						[1,1],
						[1,5],
						[5,1],
						[5,5],
		];
		for (var n=0; n<dotArr.length; n++) {
			var newDot = new createjs.Shape();
			newDot.graphics.beginFill(boardSettings.borderColor).drawCircle(0, 0, boardSettings.dotSize);
			newDot.x = positionData.sX + (dotArr[n][0] * boardSettings.width) + (boardSettings.width/2);
			newDot.y = positionData.sY + (dotArr[n][1] * boardSettings.width) + (boardSettings.width/2);
			boardDesignContainer.addChild(newDot);
		}
	}

	statusContainer.y = (bgHeight/2) + 10;
	boardContainer.scaleX = boardContainer.scaleY = 1;
	var minBoardHeight = 520;
	if(bgHeight > minBoardHeight){
		var boardScale = minBoardHeight/bgHeight;
		boardContainer.scaleX = boardContainer.scaleY = boardScale;
	}
	
	var centerX = gameData.settings.size/2;
	var centerY = gameData.settings.size/2;
	makeMove(centerX-1, centerY-1, 0);
	makeMove(centerX, centerY, 0);
	makeMove(centerX-1, centerY, 1);
	makeMove(centerX, centerY-1, 1);

	if(gameData.player == 1 && gameData.ai){
		TweenMax.to(boardContainer, 1, {overwrite:true, onComplete:function(){
			moveAI();
		}});
	}
	displayPlayerTurn();
}

/*!
 * 
 * DISPLAY PLAYER TURN - This is the function that runs to display playter turn
 * 
 */
function displayPlayerTurn(){
	var isUser = true;
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
					isUser = false;
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

	togglePlayerTimer();
	findValidMove(isUser, true);
}

function displayPlayerNoMove(index){
	var userNoMove = textDisplay.userNoMove;
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		if(socketData.host){
			userNoMove = index == 1 ? textDisplay.playerNoMove.replace('[NAME]', $.players['gamePlayer'+ index].text) : userNoMove;
		}else{
			userNoMove = index == 0 ? textDisplay.playerNoMove.replace('[NAME]', $.players['gamePlayer'+ index].text) : userNoMove;
		}
	}
	$.players['gameTurn'+ index].text = userNoMove;

	TweenMax.killTweensOf($.players['gameTurn'+ index]);
	animatePlayerTurn($.players['gameTurn'+ index]);
}

function hidePlayerTurn(){
	for(var n=0; n<2; n++){
		$.players['gameTurn'+ n].text = "";
		TweenMax.killTweensOf($.players['gameTurn'+ n]);
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
 * GAME STATUS - This is the function that runs to show game status
 * 
 */
function showGameStatus(con, player){
	if(con == 'win'){
		statusTxt.text = textDisplay.gameWin.replace("[PLAYER]", player);
	}else{
		statusTxt.text = textDisplay.draw;
	}

	var statusShape = {color:"#fff", stroke:"#000", space:80, strokeNum:7, radius:25, w:0, h:50};
	statusShape.w = statusTxt.getMeasuredWidth() + statusShape.space;
	itemStatus.graphics.clear().setStrokeStyle(statusShape.strokeNum).beginStroke(statusShape.stroke).beginFill(statusShape.color).drawRoundRectComplex(-(statusShape.w/2), -(statusShape.h/2), statusShape.w, statusShape.h, statusShape.radius, statusShape.radius, statusShape.radius, statusShape.radius);

	

	statusContainer.alpha = 0;
	TweenMax.to(statusContainer, .5, {alpha:1, overwrite:true, onComplete:function(){
		TweenMax.to(statusContainer, .5, {delay:3, alpha:0, overwrite:true});
	}});
}

/*!
 * 
 * DISPLAY PLAYER SCORE - This is the function that runs to display player score
 * 
 */
function displayPlayerScore(){
	for(var n=0; n<2; n++){
		if(n == 0){
			$.players['gamePlayerWin'+ n].text = textDisplay.playerTotal.replace('[NUMBER]', playerData.score);
		}else{
			$.players['gamePlayerWin'+ n].text = textDisplay.playerTotal.replace('[NUMBER]', playerData.opponentScore);
		}
	}
}

/*!
 * 
 * MAKE MOVE - This is the function that runs to make move
 * 
 */
function makeMove(r, c, player, check){
	gameData.moving = true;
	findValidMove(false, false);
	hidePlayerTurn();

	var iconAID = 'icon'+gameData.icon+gameData.icons[0];
	var iconBID = 'icon'+gameData.icon+gameData.icons[1];
	var iconA = new createjs.Bitmap(loader.getResult(iconAID));
	centerReg(iconA);
	var iconB = new createjs.Bitmap(loader.getResult(iconBID));
	centerReg(iconB);
	var iconShadow = new createjs.Bitmap(loader.getResult('icon'+gameData.icon+'shadow'));
	centerReg(iconShadow);

	gameData.board[r][c].player = player == 0 ? 1 : -1;

	iconA.x = iconB.x = gameData.board[r][c].x * boardSettings.tweenPlaceOffset;
	iconA.y = iconB.y = gameData.board[r][c].y * boardSettings.tweenPlaceOffset;
	iconShadow.x = gameData.board[r][c].x + boardSettings.shadowX;
	iconShadow.y = gameData.board[r][c].y + boardSettings.shadowY;
	iconA.scaleX = iconA.scaleY = iconB.scaleX = iconB.scaleY = boardSettings.tweenPlaceScale;

	gameData.board[r][c].icon = [iconA, iconB];
	gameData.board[r][c].iconShadow = iconShadow;
	boardIconContainer.addChild(iconShadow, iconA, iconB);

	var targetIcon = iconA;
	if(player == 0){
		iconB.visible = false;
	}else{
		targetIcon = iconB;
		iconA.visible = false;
	}

	if(!check){
		gameData.moving = false;
		targetIcon.x = gameData.board[r][c].x;
		targetIcon.y = gameData.board[r][c].y;
		targetIcon.scaleX = targetIcon.scaleY = 1;
		iconShadow.scaleX = iconShadow.scaleY = 1;
	}else{
		var randomSound = Math.floor(Math.random()*3);
		playSound('soundDrop'+(randomSound+1));

		iconShadow.alpha = 0;
		TweenMax.to(iconShadow, boardSettings.tweenPlaceSpeed, {alpha:1, scaleX:1, scaleY:1, ease:Expo.easeOut, overwrite:true});
		TweenMax.to(targetIcon, boardSettings.tweenPlaceSpeed, {scaleX:1, scaleY:1, x:gameData.board[r][c].x, y:gameData.board[r][c].y, ease:Expo.easeOut, overwrite:true, onComplete:function(){
			flipOpposite(r, c);
		}});
	}
}

function flipOpposite(r, c){
	gameData.totalFlip = 0;
	gameData.totalFlipCount = 0;
	var player = gameData.player == 0 ? 1 : -1;
	var delay = 0;
	var count;
	for (var k = -1; k < 2; k++) {
		for (var l = -1; l < 2;l++) {
		count = 1;
		while (withinBounds(r + count * k, c + count * l)) {
			if (gameData.board[r + count * k][c + count * l].player == -1 * player) {
				count++;
			} else {
				break;
			}
		}
		if (withinBounds(r + count * k, c + count * l)) {
			if (count > 1 & gameData.board[r + count * k][c + count * l].player == player) {
				count = 1;
				while (gameData.board[r + count * k][c + count * l].player == -1 * player) {
					gameData.totalFlip++;
					flipIcon(r + count * k, c + count * l, player, delay);
					delay+=.2;
					count++;
				}
			}
		}
		}
	}
}

/*!
 * 
 * BOARD RESULT - This is the function that runs for game board result
 * 
 */
function checkBoardResult(){
	playerData.score = playerData.opponentScore = 0;
	for(var r=0; r<gameData.settings.size; r++){
		for(var c=0; c<gameData.settings.size; c++){
			if(gameData.board[r][c].player == 1){
				playerData.score++;
			}else if(gameData.board[r][c].player == -1){
				playerData.opponentScore++;
			}
		}
	}
	displayPlayerScore();

	togglePlayer();
	displayPlayerTurn();

	var updateSocketMove = false;
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		if(socketData.turn){
			updateSocketMove = true;
		}
	}

	var moves = movesAvailable();
	if(moves.length == 0){
		togglePlayer();
		if(gameData.ai){
			if(gameData.player == 1){
				gameData.aiMove = true;
			}
		}
		
		moves = movesAvailable();
		if (moves.length == 0) {
			hidePlayerTurn();
			gameData.complete = true;
			if (playerData.score > playerData.opponentScore){
				playSound('soundComplete');
				showGameStatus('win', $.players['gamePlayer'+ 0].text);
			}else if (playerData.score < playerData.opponentScore){
				playSound('soundComplete');
				showGameStatus('win', $.players['gamePlayer'+ 1].text);
			}else{
				showGameStatus('draw');
				playSound('soundDraw');
			}

			endGame();
			return;
		}else{
			var oppPlayer = gameData.player == 0 ? 1 : 0;
			displayPlayerNoMove(oppPlayer);
			TweenMax.to(boardContainer, 1.5, {overwrite:true, onComplete:function(){
				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					if(updateSocketMove)
						postSocketUpdate('updatemovecomplete', {index:gameData.player});
				}else{
					gameData.moving = false;
					displayPlayerTurn();
					checkMoveAI();
				}
			}});
		}
	}else{
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			if(updateSocketMove)
				postSocketUpdate('updatemovecomplete', {index:gameData.player});
		}else{
			gameData.moving = false;
			checkMoveAI();
		}
	}
}

function checkMoveAI(){
	if(gameData.aiMove){
		gameData.aiMove = false;
		TweenMax.to(boardContainer, 1, {overwrite:true, onComplete:function(){
			moveAI();
		}});
	}
}

function checkAnyMoreMove(){
	var moves = movesAvailable();
	if (moves.length == 0) {
		togglePlayer();
		if(gameData.ai){
			if(gameData.player == 1){
				gameData.aiMove = true;
			}
		}

		moves = movesAvailable();
		if (moves.length == 0) {
			gameData.complete = true;
			if (playerData.score > playerData.opponentScore){
				playSound('soundComplete');
				showGameStatus('win', $.players['gamePlayer'+ 0].text);
			}else if (playerData.score < playerData.opponentScore){
				playSound('soundComplete');
				showGameStatus('win', $.players['gamePlayer'+ 1].text);
			}else{
				showGameStatus('draw');
				playSound('soundDraw');
			}

			endGame();
			return;
		}
	}
}

/*!
 * 
 * FLIP ANIMATION - This is the function that runs for flip animation
 * 
 */
function flipIcon(r,c,player,delay){
	gameData.board[r][c].player = player;

	var flipTop = gameData.board[r][c].icon[0];
	var flipBottom = gameData.board[r][c].icon[1];
	var flipShadow = gameData.board[r][c].iconShadow;

	if(gameData.player == 1){
		flipTop = gameData.board[r][c].icon[1];
		flipBottom = gameData.board[r][c].icon[0];
	}
	
	flipTop.scaleX = flipTop.scaleY = 1;
	flipBottom.scaleX = flipBottom.scaleY = 1;
	flipTop.x = flipBottom.x = gameData.board[r][c].x;
	flipTop.y = flipBottom.y = gameData.board[r][c].y;

	TweenMax.to(flipShadow, boardSettings.tweenFlipSpeed, {delay:delay, alpha:0, overwrite:true});
	TweenMax.to(flipBottom, boardSettings.tweenFlipSpeed, {delay:delay, scaleX:0, overwrite:true});
	TweenMax.to(flipTop, boardSettings.tweenFlipSpeed, {delay:delay, scaleX:0, overwrite:true, onStart:function(){
		playSound("soundFlip");
	}, onComplete:function(){
		flipTop.visible = true;
		flipBottom.visible = false;

		TweenMax.to(flipShadow, boardSettings.tweenFlipSpeed, {alpha:1, overwrite:true});
		TweenMax.to(flipBottom, boardSettings.tweenFlipSpeed, {scaleX:1, overwrite:true});
		TweenMax.to(flipTop, boardSettings.tweenFlipSpeed, {scaleX:1, overwrite:true, onComplete:function(){
			gameData.totalFlipCount++;
			if(gameData.totalFlipCount == gameData.totalFlip){
				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					postSocketUpdate('checkboardresult', socketData.gameIndex);
				}else{
					checkBoardResult();
				}
			}
		}});
	}});
}

/*!
 * 
 * FIND VALID MOVE - This is the function that runs for valid move
 * 
 */
function findValidMove(isUser, animate){
	var socketMove = true;
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		if(!socketData.turn){
			socketMove = false;
		}
	}

	for(var r=0; r<gameData.settings.size; r++){
		for(var c=0; c<gameData.settings.size; c++){
			resetValidMove(r,c);

			var player = gameData.player == 0 ? 1 : -1;
			if(isValidMove(r,c,gameData.board,player) && isUser && animate && boardSettings.showPlayerMove && !boardSettings.showPlayerMoveMouseover && socketMove){
				gameData.board[r][c].move = true;
				var targetMove = gameData.player == 0 ? gameData.board[r][c].bgMoveA : gameData.board[r][c].bgMoveB;
				targetMove.visible = true;
				animatePlayerMove(targetMove);
			}
		}
	}
}

function resetValidMove(r,c){
	gameData.board[r][c].move = true;
	gameData.board[r][c].bgMoveA.visible = false;
	gameData.board[r][c].bgMoveB.visible = false;
	TweenMax.killTweensOf(gameData.board[r][c].bgMoveA);
	TweenMax.killTweensOf(gameData.board[r][c].bgMoveB);
}

function animatePlayerMove(obj){
	obj.alpha = 0;
	var tweenSpeed = .5;
	TweenMax.to(obj, tweenSpeed, {alpha:.5, overwrite:true, onComplete:function(){
		TweenMax.to(obj, tweenSpeed, {alpha:0, overwrite:true, onComplete:animatePlayerMove, onCompleteParams:[obj]});
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
 * AI MOVE - This is the function that runs to move AI
 * 
 */
function moveAI() {
	gameData.moving = true;
	
	var moves = movesAvailable(),
		player = gameData.player == 0 ? 1 : -1,
        enemy = -1 * player,
        model,
        count;

    for (var k = 0; k < moves.length; k++) {
        model = copyBoard(gameData.board);
        makeFakeMove(model, player, moves[k].r, moves[k].c);
        var opponentMoves = movesAvailable(model, enemy);
        var modelNext,
            movesNext,
            minMoves = gameData.settings.size * gameData.settings.size;
        for (var l = 0; l < opponentMoves.length; l++) {
            modelNext = copyBoard(model);
			makeFakeMove(modelNext, enemy, opponentMoves[l].r, opponentMoves[l].c);
            movesNext = movesAvailable(modelNext, player);
            minMoves = gameData.settings.size * gameData.settings.size;
            count = movesNext.length;
            for (var m = 0; m < movesNext.length; m++) {
                if (checkMoveType(movesNext[m].r, movesNext[m].c, badMoves))
                    count = count - 2;
                if (checkMoveType(movesNext[m].r, movesNext[m].c, preferedMoves))
                    count += 10;
            }
            if (minMoves > count)
                minMoves = count;
            if (checkMoveType(opponentMoves[l].r, opponentMoves[l].c, preferedMoves))
                moves[k].disaster = true;
        }
        moves[k].enemyMoves = minMoves;
    }

    moves.sort(moveSort);
    for (var k = 0; k < moves.length; k++) {
        if (checkMoveType(moves[k].r, moves[k].c, preferedMoves)) {
            makeMove(moves[k].r, moves[k].c, gameData.player, true);
            return;
        }
    }
    for (count = 0; count < (moves.length - 1); count++) {
        if (!moves[count].disaster & !checkMoveType(moves[count].r, moves[count].c, badMoves))
            break;
    }
    makeMove(moves[count].r, moves[count].c, gameData.player, true);
}

/*!
 * 
 * BOARD FUNC - This is the function that runs for board func
 * 
 */
function isValidMove(r,c,board,player){
	if(board[r][c].player != 0){
		return false;
	}

	var count;
	for (var k = -1; k < 2; k++) {
		for (var l = -1; l < 2;l++) {
		count = 1;
		while (withinBounds(r + count * k, c + count * l)) {
			if (board[r + count * k][c + count * l].player == -1 * player) {
			count++;
			} else
			break;
		}
		if (withinBounds(r + count * k, c + count * l)) {
			if (count > 1 & board[r + count * k][c + count * l].player == player)
			return true;
		}
		}
	}

	return false;
}

function withinBounds(r, c) {
	return r >= 0 & c >= 0 & r < gameData.settings.size & c < gameData.settings.size;
}

function movesAvailable(board, player){
	if (board == undefined)
		board = gameData.board;
	if (player == undefined)
		player = gameData.player == 0 ? 1 : -1;
		
	var moves = [];
	for(var r=0; r<gameData.settings.size; r++){
		for(var c=0; c<gameData.settings.size; c++){
			if (isValidMove(r,c,board,player)) {
				moves.push({r:r, c:c, enemyMoves: -1, disaster: false});
			}
	  	}
	}
	return moves;
}

function copyBoard(board) {
	var model = new Array(gameData.settings.size);
	for (var r = 0; r < gameData.settings.size; r++) {
		model[r] = new Array(gameData.settings.size);
		for (var c = 0; c < gameData.settings.size; c++) {
			model[r][c] = {player: board[r][c].player};
		}
	}
	return model;
}

function makeFakeMove(board, player, r, c) {
    var count;
    for (var k = -1; k < 2; k++) {
        for (var l = -1; l < 2; l++) {
            count = 1;
            while (withinBounds(r + count * k, c + count * l)) {
                if (board[r + count * k][c + count * l].player == -1 * player) {
                    count++;
                } else {
                    break;
				}
            }
            if (withinBounds(r + count * k, c + count * l)) {
                if (count > 1 & board[r + count * k][c + count * l].player == player) {
                    count = 1;
                    while (board[r + count * k][c + count * l].player == -1 * player) {
                        board[r + count * k][c + count * l].player = player;
                        count++;
                    }
                }
            }
        }
    }
	board[r][c].player = player;
}

function checkMoveType(r,c,array){
	for (var k = 0; k < array.length; k++) {
		if (array[k].r == r & array[k].c == c)
		  	return true;
	}
	return false;
}

function moveSort(a, b) {
    if (a.enemyMoves < b.enemyMoves)
        return 1;
    else if (a.enemyMoves > b.enemyMoves)
        return -1;
    else {
        if (a.r < b.r)
            return -1;
        if (a.r > b.r)
            return 1;
        else {
            if (a.c < b.c)
                return -1;
            if (a.c > b.c)
                return 1;
            else
                return 0;
        }
    }
}


/*!
 * 
 * GAME TIMER - This is the function that runs for game timer
 * 
 */
function toggleGameTimer(con){
	if(con){
		timeData.startDate = new Date();
	}
	timeData.enable = con;
}

function togglePlayerTimer(){
	timeData.startDate = new Date();
	if(gameData.player == 0){
		timeData.opponentAccumulate = timeData.opponentTimer;
	}else{
		timeData.playerAccumulate = timeData.playerTimer;
	}
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

			if(gameData.player == 0){
				timeData.playerTimer = Math.floor(timeData.elapsedTime + timeData.playerAccumulate);
			}else{
				timeData.opponentTimer = Math.floor(timeData.elapsedTime + timeData.opponentAccumulate);	
			}

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				postSocketUpdate('updatetimer', {playerTimer:timeData.playerTimer, opponentTimer:timeData.opponentTimer});
			}else{
				updateTimer();
			}
		}
	}
}

function updateTimer(){
	//timerTxt.text = millisecondsToTimeGame(timeData.timer);
	$.players['gameTimer'+ 0].text = millisecondsToTimeGame(timeData.playerTimer);
	$.players['gameTimer'+ 1].text = millisecondsToTimeGame(timeData.opponentTimer);
}


/*!
 * 
 * END GAME - This is the function that runs for game end
 * 
 */
function endGame(){
	gameData.paused = true;
	toggleGameTimer(false);

	TweenMax.to(gameContainer, 3, {overwrite:true, onComplete:function(){
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