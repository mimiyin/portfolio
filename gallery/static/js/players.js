var gallery = gallery || {};
gallery.sketchPlayer = null;

(function(){

	var SketchPlayer = function SketchPlayer(id, sketch) {
		this.id = id;
		this.type = "sketch";
		this.sketch = sketch;
		var thisSP = this;
		try { 
			this._audio = this.sketch.getAudio(); 
			this._audio.addEventListener('ended', function(){
				console.log("AUDIO ENDED!");
				thisSP._audio.currentTime = 0;
				thisSP.sketch.reset();
			})
			this._hasAudio = true;
			} 
		catch(e) {
			this._hasAudio = false;
			console.log(this.id + " has no audio."); 
			} ;
						
		// Pause it right out of the gate
		this.sketch.noLoop();
		if(this._hasAudio) {
			this._mute();
		}
				
	}
	SketchPlayer.prototype.pause = function() {
		//console.log("PAUSING!!! " + this.id);
		// Cancel out any callbacks
		this._callback = null;
		var thisSP = this;
		if(this._hasAudio)
			this._turnDown(function(){
				thisSP.noLoop();
			});
		else
			this.sketch.noLoop();
	}
	SketchPlayer.prototype.play = function(callback) {
		//console.log("PLAYING!!! " + this.id);
		this.sketch.loop();
		if(!gallery.control.isZoomedOut) {
			// Turn up the volume if there's audio
			if(this._hasAudio)
				this._turnUp();	
			// Move to next slide
			if(callback) this._callback = callback();
		}
	}
	
	SketchPlayer.prototype._reset = function() { 
		this.sketch.reset(); 
	}
	
	SketchPlayer.prototype._mute = function() {
		this._audio.volume = 0;
	}
	
	SketchPlayer.prototype._turnDown = function(callback) { 
		//console.log("TURNING DOWN!!! " + this.id);
		this._isTurningDown = true;
		function turnDown(thisSP) {
			//If playing, don't keep turning down the volume
			if(!thisSP._isTurningDown || thisSP._audio.volume < .05)
				return;
			thisSP._audio.volume-=.05; 	
			if(thisSP._audio.volume > 0)
				setTimeout(function() { turnDown(thisSP); }, 500);
			else {
				if(callback)
					callback();
				}
			}
		turnDown(this);
	}
	
	SketchPlayer.prototype._turnUp = function() { 
		//console.log("TURNING UP!!! " + this.id);
		this._isTurningDown = false;
		function turnUp(thisSP) {
			//If paused, don't keep turning up the volume
			if(thisSP._isTurningDown || thisSP._audio.volume >= .5)
				return;
			thisSP._audio.play();
			thisSP._audio.volume+=.02; 	
			if(thisSP._audio.volume < .5)
				setTimeout(function() { turnUp(thisSP); }, 500);
			}
		turnUp(this);
	}
		
	gallery.sketchPlayer = SketchPlayer;

}());

gallery.vimeoPlayer = null;

(function(){

	var VimeoPlayer = function VimeoPlayer(id, video, videoEl) {
		this.id = id;
		this.type = "vimeo";
		this._video = video;
		this._isPlaying = false;
		
		var thisVP = this;
		
		this._video.addEvent("finish", function(){ 
			console.log("FINISHED VIDEO!!!");
			thisVP.onFinish();
			})
		
		this._mute();			
	}
	
	VimeoPlayer.prototype.onFinish = function() {
		var callback = this._getCallback();
		console.log(callback);
		if(callback) callback();
	}
	
	VimeoPlayer.prototype.reset = function() {
		this._video.api()
	}
	
	VimeoPlayer.prototype._toggle = function() {
		if(this._isPlaying)
			thisVP._video.api("pause");
		else
			this._video.api("play");
	}
	
	VimeoPlayer.prototype.pause = function() {
		//console.log("PAUSING!!! " + this.id);
		// Cancel out any callbacks
		this._callback = null;
		var thisVP = this;
		this._turnDown(function(){
			thisVP._video.api("pause");
			thisVP._isPlaying = false;
		});
	}
		
	VimeoPlayer.prototype._getCallback = function() {
		return this._callback;
	}
	
	VimeoPlayer.prototype.play = function(callback) { 

//		console.log("PLAYING!!! " + this.id);
//		console.log("IS ZOOMEDOUT: " + gallery.control.isZoomedOut);
		this._video.api("play");
		this._isPlaying = true;
		
		if(!gallery.control.isZoomedOut) {
			this._turnUp();
			// Move to next slide when video is finished playing
			if(callback){ 
				this._callback = callback;
			}
		}
	}
	
	VimeoPlayer.prototype._mute = function() {
		this._video.api("setVolume", 0);
	}
	
	VimeoPlayer.prototype._turnDown = function(callback) { 
		//console.log("TURNING DOWN!!! " + this.id);
		
		this._isTurningDown = true;
		function turnDown(thisVP) {
			if(!thisVP._isTurningDown)
				return;
			thisVP._video.api("getVolume", function(volume){
				var newVolume = volume - .01;
				thisVP._video.api("setVolume", newVolume); 
				if(newVolume > 0)
					setTimeout(function() { turnDown(thisVP); }, 500);
				else if(callback)
					callback();
				});
			}
		
		turnDown(this);
		}
	VimeoPlayer.prototype._turnUp = function() { 
		//console.log("TURNING UP!!! " + this.id);
		this._isTurningDown = false;
		
		function turnUp(thisVP) {
			if(thisVP._isTurningDown)
				return;
			thisVP._video.api("getVolume", function(volume){
				var newVolume = parseFloat(volume) +.02;
				thisVP._video.api("setVolume", newVolume); 
				if(newVolume < .5)
					setTimeout(function() { turnUp(thisVP); }, 500);
				});
			}
		turnUp(this);
	}
		
	gallery.vimeoPlayer = VimeoPlayer;

}());