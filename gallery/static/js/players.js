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
				//console.log("AUDIO ENDED FOR: " + thisSP.id);
				setTimeout(function() {
					thisSP._audio.currentTime = 0;
					thisSP._audio.paused = true;
					thisSP.sketch.reset();
				}, 2500);
			})
			this._hasAudio = true;
			} 
		catch(e) {
			this._hasAudio = false;
			//console.log(this.id + " has no audio."); 
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
		var thisSP = this;
		var turnDown = function() {
			//If playing, don't keep turning down the volume
			if(!thisSP._isTurningDown || thisSP._audio.volume < .05)
				return;
			thisSP._audio.volume-=.05; 	
			if(thisSP._audio.volume > 0)
				setTimeout(function() { turnDown(); }, 500);
			else {
				if(callback)
					callback();
				}
			}
		turnDown();
	}
	
	SketchPlayer.prototype._turnUp = function() { 
		this._isTurningDown = false;
		var thisSP = this;
		var turnUp = function() {
			//If paused, don't keep turning up the volume
			if(thisSP._isTurningDown || thisSP._audio.volume >= .5)
				return;
			thisSP._audio.play();
			thisSP._audio.volume+=.02; 	
			if(thisSP._audio.volume < .5)
				setTimeout(function() { turnUp(); }, 500);
			}
		turnUp();
	}
		
	gallery.sketchPlayer = SketchPlayer;

}());

gallery.vimeoPlayer = null;

(function(){

	var VimeoPlayer = function VimeoPlayer(id, video) {
		this.id = id;
		this.type = "vimeo";
		this._video = video;		
		this._mute();

		video.addEvent('ready', ready);

		// Reload the froogaloop player when it's ready
		function ready(player_id){
			this._video = $f(player_id);
			//console.log("READY!!!");

			this._video.api("getVolume", function(volume){
				//console.log("VOLUME FOR: " + this.id + " is " + volume);
			});
			// Listen for video's finish event
			this._video.addEvent("finish", this.finish);
			this._video.addEvent("pause", function(){
				("PAUSED VIDEO!!!");
			});
		}
		
	}
	
	VimeoPlayer.prototype.finish = function() {
		this._callback();
	}
	
	VimeoPlayer.prototype.pause = function() {
		//console.log("PAUSING!!! " + this.id);
		// Cancel out any callbacks
		this._callback = null;
		var thisVP = this;
		this._turnDown(function(){
			thisVP._video.api("pause");
		});
	}
	VimeoPlayer.prototype.play = function(callback) { 
		//console.log("PLAYING!!! " + this.id);		
		this._video.api("play");
		if(!gallery.control.isZoomedOut) {
			this._turnUp();
			// Move to next slide when video is finished playing
			if(callback)
				this._callback = callback;
		}
	}
	
	VimeoPlayer.prototype._mute = function() {
		this._video.api("setVolume", 0);
	}
	
	VimeoPlayer.prototype._turnDown = function(callback) { 
		//console.log("TURNING DOWN!!! " + this.id);
		
		this._isTurningDown = true;
		var thisVP = this;
		var turnDown = function() {
			if(!thisVP._isTurningDown)
				return;
			thisVP._video.api("getVolume", function(volume){
				var newVolume = volume - .01;
				thisVP._video.api("setVolume", newVolume); 
				if(newVolume > 0)
					setTimeout(function() { turnDown(); }, 500);
				else if(callback)
					callback();
				});
			}
		turnDown();
		}
	VimeoPlayer.prototype._turnUp = function() { 
		//console.log("TURNING UP!!! " + this.id);
		this._isTurningDown = false;
		var thisVP = this;

		var turnUp = function() {
			if(thisVP._isTurningDown)
				return;
			thisVP._video.api("getVolume", function(volume){
				if(thisVP.id == "beluga-live")
					//console.log("TURNING UP!!! " + thisVP.id);
				var newVolume = parseFloat(volume) +.02;
				thisVP._video.api("setVolume", newVolume); 
				if(newVolume < .5)
					setTimeout(function() { turnUp(); }, 500);
				});
			}
		turnUp();
	}
		
	gallery.vimeoPlayer = VimeoPlayer;

}());