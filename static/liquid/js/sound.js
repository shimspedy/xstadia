////////////////////////////////////////////////////////////
// SOUND
////////////////////////////////////////////////////////////
var enableMobileSound = true;
var soundOn;

function playSound(target, loop){
	if(soundOn){
		var isLoop;
		if(loop){
			isLoop = -1;
			createjs.Sound.stop();
			var props = new createjs.PlayPropsConfig().set({interrupt: createjs.Sound.INTERRUPT_NONE, loop: isLoop})
			musicLoop = createjs.Sound.play(target, props);
			if (musicLoop == null || musicLoop.playState == createjs.Sound.PLAY_FAILED) {
				return;
			}else{
				musicLoop.removeAllEventListeners();
				musicLoop.addEventListener ("complete", function(musicLoop) {
					
				});
			}
		}else{
			isLoop = 0;
			createjs.Sound.play(target);
		}
	}
}

function stopSound(){
	createjs.Sound.stop();
}


/*!
 * 
 * PLAY MUSIC - This is the function that runs to play and stop music
 * 
 */
$.sound = {};
function playSoundLoop(sound){
	if(soundOn){
		if($.sound[sound]==null){
			$.sound[sound] = createjs.Sound.play(sound);
			$.sound[sound].removeAllEventListeners();
			$.sound[sound].addEventListener ("complete", function() {
				$.sound[sound].play();
			});
		}
	}
}

function toggleSoundLoop(sound, con){
	if($.sound[sound]!=null){
		if(con){
			$.sound[sound].play();
		}else{
			$.sound[sound].paused = true;
		}
	}
}

function stopSoundLoop(sound){
	if(soundOn){
		if($.sound[sound]!=null){
			$.sound[sound].stop();
			$.sound[sound]=null;
		}
	}
}

function setSoundVolume(sound, vol){
	if(soundOn){
		if($.sound[sound]!=null){
			$.sound[sound].volume = vol;
		}
	}
}

/*!
 * 
 * TOGGLE MUTE - This is the function that runs to toggle mute
 * 
 */
function toggleMute(con){
	createjs.Sound.muted = con;	
}

/*!
 * 
 * PLAY AUDIO - This is the function that runs to play questiona and answer audio
 * 
 */
var audioQuestion = null;
function playAudio(audio){
	if(audioQuestion==null){
		audioQuestion = createjs.Sound.play(audio);
		audioQuestion.removeAllEventListeners();
		audioQuestion.addEventListener ("complete", function(event) {
			audioQuestion = null;
			playAudioComplete();
		});
	}
}

function stopAudio(){
	if(audioQuestion != null){
		audioQuestion.stop();
		audioQuestion = null;
	}
}