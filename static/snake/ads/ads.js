////////////////////////////////////////////////////////////
// ADS
////////////////////////////////////////////////////////////
var adsData = {callback:null, param:null};

 /*!
 * 
 * DOCUMENT READY
 * 
 */
$(function() {
	 initAds();
	 resizeAds();
	 
	 $(window).resize(function(){
		resizeAds();
	 });
});

/*!
 * 
 * ADS PLACEHOLDER - This is the function that runs to insert ads placeholder and events
 * 
 */
function toggleGameAds(con, callback, param){
	switch(con){
		case 'play':
			if($.isFunction(window[callback])) {
				adsData.callback = callback;
				adsData.param = param;
			}else{
				adsData.callback = null;
				adsData.param = null;
			}
			$('#adTakeoverHolder').fadeIn();
			toggleMute(true);
		break;
		
		case 'stop':
			if($.isFunction(window[adsData.callback])) {
				window[adsData.callback](adsData.param);
				adsData.callback = null;
				adsData.param = null;
			}
			$('#adTakeoverHolder').fadeOut();
			if(buttonSoundOff.visible){
				toggleMute(false);	
			}
		break;
	}
}

function resizeAds(){
	setTimeout(function() {
		$('#adTakeoverHolder, #adHolder').css('width', $('canvas').css('width'));
		$('#adTakeoverHolder, #adHolder').css('height', $('canvas').css('height'));
		$('#adTakeoverHolder, #adHolder').css('left', (offset.left/2));
		$('#adTakeoverHolder, #adHolder').css('top', (offset.top/2));

		$('#adTakeoverContent').css('width', contentW*scalePercent);
		$('#adTakeoverContent').css('height', contentH*scalePercent);
		$('#adTakeoverContent').css('top', ((canvasH-contentH)/2) * scalePercent);
		$('#adTakeoverContent').css('left', ((canvasW-contentW)/2) * scalePercent);

		$('#adLeft').css('width', ((canvasW-contentW)/2) * scalePercent);
		$('#adLeft').css('height', (contentH) * scalePercent);
		$('#adLeft').css('top', ((canvasH-contentH)/2) * scalePercent);

		$('#adRight').css('width', ((canvasW-contentW)/2) * scalePercent);
		$('#adRight').css('height', (contentH) * scalePercent);
		$('#adRight').css('top', ((canvasH-contentH)/2) * scalePercent);
		$('#adRight').css('left', (((canvasW-contentW)/2)+contentW) * scalePercent);

		$('#adBottom').css('width', (contentW) * scalePercent);
		$('#adBottom').css('height', ((canvasH-contentH)/2) * scalePercent);
		$('#adBottom').css('top', (((canvasH-contentH)/2)+contentH) * scalePercent);
		$('#adBottom').css('left', ((canvasW-contentW)/2) * scalePercent);

		$('#adSideLeft, #adSideRight').css('top', ((canvasH-contentH)/2) * scalePercent);
	}, 300);
}


/*!
 * 
 * START INSERT ADS BELOW - This is the function that runs to display your ads
 * 
 */

function initAds(){
	//ad close button
	$('#adTakeoverClose').off().on('click', function(e) {
		 toggleGameAds('stop');
		// toggleGameAds('play');
	});	
	
	//place your ad events
	
	
}