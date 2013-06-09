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
			this._audio.addEventListener("ended", function(){
				setTimeout(function() {
					thisSP._audio.currentTime = 0;
					thisSP.sketch.reset();
				}, 2500);
			})
			this._hasAudio = true;
			} 
		catch(e) {
			this._hasAudio = false;
			console.log(this.id + " has no audio."); 
			} ;
			
			
		this.isPaused = true;
		
		// Pause it right out of the gate
		this.sketch.noLoop();
		if(this._hasAudio) {
			this._audio.pause();
			this._mute();
		}
				
	}
	SketchPlayer.prototype.pause = function() {
		console.log("PAUSING!!! " + this.id);
		var thisSP = this;
		if(this._hasAudio)
			this.turnDown(function(){
				thisSP.sketch.noLoop();
			});
		else
			this.sketch.noLoop();
	}
	SketchPlayer.prototype.play = function(callback) {
		console.log("PLAYING!!! " + this.id);
		this.sketch.loop();
		if(!gallery.control.isZoomedOut) {
			// Turn up the volume if there's audio
			if(this._hasAudio)
				this._turnUp();	
			// Move to next slide
			if(callback) callback();
		}
	}
	
	SketchPlayer.prototype._reset = function() { 
		this.sketch.reset(); 
	}
	
	SketchPlayer.prototype._mute = function() {
		this._audio.volume = 0;
		this._audio.pause();
	}
	
	SketchPlayer.prototype.turnDown = function(callback) { 
		console.log("TURNING DOWN!!! " + this.id);

		this._isTurningDown = true;
		var thisSP = this;
		var turnDown = function() {
			//If playing, don't keep turning down the volume
			if(!thisSP._isTurningDown)
				return;
			//console.log("TURNING DOWN!!! " + this.id);
			thisSP._audio.volume-=.005; 	
			if(thisSP._audio.volume > 0)
				setTimeout(function() { turnDown(); }, 100);
			else {
				if(callback)
					callback();
				thisSP._audio.pause();
				}
			}
		turnDown();
	}
	
	SketchPlayer.prototype._turnUp = function() { 
		this._isTurningDown = false;
		var thisSP = this;
		var turnUp = function() {
			//If paused, don't keep turning up the volume
			if(thisSP._isTurningDown)
				return;
			//console.log("TURNING UP!!! " + this.id);
			thisSP._audio.play();
			thisSP._audio.volume+=.005; 	
			if(thisSP._audio.volume < .5)
				setTimeout(function() { turnUp(); }, 100);
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
		
		video.addEvent('ready', ready);
		this._video = video;
		this._mute();
		function ready(player_id){
			this._video = $f(player_id),
			this._video.api("getVolume", function(value, id){
				console.log("WUT");
				console.log(value);
			});			
		}
	}
	
	VimeoPlayer.prototype.pause = function() {
		console.log("PAUSING!!! " + this.id);
		var thisVP = this;
		this.turnDown(function(){
			thisVP._video.api("pause");
		});
	}
	VimeoPlayer.prototype.play = function(callback) { 
		console.log("PLAYING!!! " + this.id);		
		this._video.api("play");
		if(!gallery.control.isZoomedOut) {
			this._turnUp();
			// Move to next slide when video is finished playing
			if(callback)
				this._video.addEvent("finish", callback);
		}
	}
	
	VimeoPlayer.prototype._mute = function() {
		this._video.api("setVolume", 0);
	}
	
	VimeoPlayer.prototype.turnDown = function(callback) { 
		this._isTurningDown = true;
		var thisVP = this;
		var turnDown = function() {
			if(!thisVP._isTurningDown)
				return;
			console.log("TURNING DOWN VIDEO: " + thisVP.id);
			thisVP._video.api("getVolume", function(volume){
				var newVolume = volume - .01;
				thisVP._video.api("setVolume", newVolume); 
				console.log(newVolume);
				if(newVolume > 0)
					setTimeout(function() { turnDown(); }, 100);
				else if(callback)
					callback();
				});
			}
		turnDown();
		}
	VimeoPlayer.prototype._turnUp = function() { 
		this._isTurningDown = false;
		var thisVP = this;

		var turnUp = function() {
			if(thisVP._isTurningDown)
				return;
			//console.log("TURNING UP VIDEO: " + thisVP.id);
			//thisVP._video.api("setVolume", .5);
			thisVP._video.api("getVolume", function(volume){
				var newVolume = parseFloat(volume) +.01;
				thisVP._video.api("setVolume", newVolume); 
				console.log("HELLO");
				console.log(newVolume);
				if(newVolume < .5)
					setTimeout(function() { turnUp(); }, 100);
				});
			}
		turnUp();
	}
		
	gallery.vimeoPlayer = VimeoPlayer;

}());