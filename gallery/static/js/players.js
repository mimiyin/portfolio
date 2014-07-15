var gallery = gallery || {};
gallery.sketchPlayer = null;

(function(){

	var delta = 0.01;

	var SketchPlayer = function SketchPlayer(id, sketch) {
		this.id = id;
		this.type = "sketch";
		this.sketch = sketch;
		var thisSP = this;
		try { 
			this._audio = this.sketch.getAudio(); 
			console.log("AUDIO FOR: " + this.id, this._audio);

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
						
		// Reset
		this._reset();				
	}

	SketchPlayer.prototype.pause = function() {
		//console.log("PAUSING!!! " + this.id);
		// Cancel out any callbacks
		this._callback = null;
		var thisSP = this;
		if(this._hasAudio) {
			this._turnDown(function(){
				thisSP._reset();
			});
		}
		else {
			this.sketch.noLoop();
		}
	}

	SketchPlayer.prototype.play = function(callback) {
		//console.log("PLAYING!!! " + this.id);
		this.sketch.loop();
		// Turn up the volume if there's audio
		if(this._hasAudio) {
			this._turnUp();	
		}
	}
	
	SketchPlayer.prototype._reset = function() { 
		this.sketch.noLoop();
		// And mute the sound
		if(this._hasAudio) {
			this._mute();
		}
	}
	
	SketchPlayer.prototype._mute = function() {
		this._audio.volume = 0;
	}
	
	SketchPlayer.prototype._turnDown = function(callback) { 
		this._isTurningDown = true;
		turnDown(this);

		var thisSP = this;
		function turnDown(thisSP) {
			console.log("TURNING DOWN!!! " + thisSP.id + "\tVOL: " + thisSP._audio.volume);

			//If playing, don't keep turning down the volume
			if(!thisSP._isTurningDown) {
				return;
			}
			if(thisSP._audio.volume > delta){
				thisSP._audio.volume -= .01; 	
				setTimeout(function() { turnDown(thisSP); }, 100);
			}
			else if(callback) {
				callback();
			}
		}
	}
	
	SketchPlayer.prototype._turnUp = function() { 
		//console.log("TURNING UP!!! " + this.id);
		this._isTurningDown = false;
		this._audio.play();
		turnUp(this);

		var thisSP = this;
		function turnUp(thisSP) {
			console.log("TURNING UP!!! " + thisSP.id + "\tVOL: " + thisSP._audio.volume);
			//If paused, don't keep turning up the volume
			if(thisSP._isTurningDown) {
				return;
			}
			if(thisSP._audio.volume < .5) {
				thisSP._audio.volume += .01; 	
				setTimeout(function() { turnUp(thisSP); }, 250);
			}
		}
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

		// Set volume to 0
		this._video.addEvent("ready", function(){
			thisVP._video.api("setVolume", 0);
		});

		// Listen for finish
		this._video.addEvent("finish", function(){ 
			console.log("FINISHED VIDEO!!!");
			thisVP._video.api("setVolume", 0);
			if(thisVP._callback) {
				thisVP._callback();
			}
		});		
	}	
	VimeoPlayer.prototype._toggle = function() {
		if(this._isPlaying)
			thisVP._video.api("pause");
		else
			this._video.api("play");
	}
	
	VimeoPlayer.prototype.pause = function() {
		console.log("PAUSING!!! " + this.id);
		// Cancel out any callbacks
		this._callback = null;

		var thisVP = this;
		this._turnDown(function(){
			thisVP._video.api("pause");
			thisVP._isPlaying = false;
		});
	}
			
	VimeoPlayer.prototype.play = function(callback) { 
		console.log("PLAYING!!! " + this.id);
		this._video.api("play");
		this._isPlaying = true;
		
		this._turnUp();
		// Move to next slide when video is finished playing
		if(callback){ 
			this._callback = callback;
		}
	}
	
	VimeoPlayer.prototype._mute = function() {
		this._video.api("setVolume", 0);
	}
	
	VimeoPlayer.prototype._turnDown = function(callback) { 
		this._isTurningDown = true;
		turnDown(this);
		function turnDown(thisVP) {
			if(!thisVP._isTurningDown)
				return;
			thisVP._video.api("getVolume", function(volume){
				console.log("TURNING DOWN!!! " + this.id + "\tVOL: " + volume);
				var newVolume = parseFloat(volume) - .01;
				thisVP._video.api("setVolume", newVolume); 
				if(newVolume > delta)
					setTimeout(function() { turnDown(thisVP); }, 100);
				else if(callback)
					callback();
				});
			}		
		}
	VimeoPlayer.prototype._turnUp = function() { ;
		this._isTurningDown = false;
		turnUp(this);

		function turnUp(thisVP) {
			if(thisVP._isTurningDown) {
				return;
			}
			thisVP._video.api("getVolume", function(volume){
				if(newVolume < .5) {
					console.log("TURNING UP!!! " + this.id + "\tVOL: " + volume);
					var newVolume = parseFloat(volume) + .01;
					thisVP._video.api("setVolume", newVolume); 
					setTimeout(function() { turnUp(thisVP); }, 250);
				}
			});
		}
	}
		
	gallery.vimeoPlayer = VimeoPlayer;

}());