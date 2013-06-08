var gallery = gallery || {};
gallery.sketchPlayer = null;

(function(){

	var SketchPlayer = function SketchPlayer(sketch) {
		this._sketch = sketch;
		this._audio = this._sketch.getAudio() || null;
		
		// Pause it right out of the gate
		this._sketch.noLoop();
		this._audio.pause();
		this._mute();
	}
	
	SketchPlayer.prototype._pause = function() { 
				this._turnDown();
			}
	SketchPlayer.prototype._play = function() { 
				this._sketch.loop();
				if(this._audio)
					if(gallery.control.isZoomedOut)
						this._mute();
					else
						this._turnUp();	
			}
	
	SketchPlayer.prototype._reset = function() { 
		this._sketch.reset(); 
		}
	
	SketchPlayer.prototype._mute = function() {
		this._audio.volume = 0;
		}
	
	SketchPlayer.prototype._turnDown = function() { 
				var turnDown = function() {
					this._audio.volume-=.005; 	
					if(this._audio.volume > 0)
						setTimeout(turnDown, 100);
					else {
						this._sketch.noLoop();
						this._audio.pause();
						}
					}
				turnDown();
			}
	
	SketchPlayer.prototype._turnUp = function() { 
				var turnUp = function() {
					this._audio.play();
					this._audio.volume+=.005; 	
					if(this._audio.volume < .5)
						setTimeout(turnUp, 100);
					}
				turnUp();
			}
		
	gallery.sketchPlayer = SketchPlayer;

}());

gallery.vimeoPlayer = null;

(function(){

	var VimeoPlayer = function VimeoPlayer(video) {
		this._video = video;
		this._mute();
	}
	
	VimeoPlayer.prototype._pause = function() { 
			if(gallery.control.isZoomedOut) {
				video.api("pause");
				this._mute();
			}
			else
				this._turnDown(video, project);
			}
	VimeoPlayer.prototype._play = function() { 
			video.api("play");
			if(!gallery.control.isZoomedOut)
				this._turnUp();
			else
				this._mute();
	
			}
	
	VimeoPlayer.prototype._mute = function() {
		this._video.api("setVolume", 0);
	}
	
	VimeoPlayer.prototype._turnDown = function() { 
			var turnDown = function() {
				video.api("getVolume", function(volume){
					var newVolume = volume - .001;
					video.api("setVolume", newVolume); 
					if(newVolume > 0)
						setTimeout(turnDown, 100);
					else
						video.api("pause");
					});
				}
			turnDown();
			}
	VimeoPlayer.prototype._turnUp = function() { 
			var turnUp = function() {
				video.api("getVolume", function(volume){
					var newVolume = parseFloat(volume) +.001;
					video.api("setVolume", newVolume); 
					if(newVolume < .1)
						setTimeout(turnUp, 100);
					});
				}
			turnUp();
		}
		
	gallery.vimeoPlayer = VimeoPlayer;

}());