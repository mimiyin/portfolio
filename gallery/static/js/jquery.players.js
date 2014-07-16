// Listen for scrolling



// Player controls
$.widget('doc.player', {
	options : {
	},
	_create : function() {
		this.element.addClass("doc_player");
		this.id = this.element.attr("id");
		this._on({
			"click" : $this._toggle,
		});

		// Listen for focus and scroll on parent element
		this.element.on("scroll, focus", function(){
			$this._map();
		});
	},
	_toggle : function() {
		if(this.isPlaying) {
			this.play();
		}
		else {
			this.pause();
		}
	},
	enter : function() {
		console.log("ENTERING!!! " + this.id);
		this.isLeaving = false;
		this.isEntering = true;
		this.play();
		// Turn up the volume if there's audio
		if(this.audio) {
			this._turnUp(function(){
				$this.isEntering = false;
			});	
		}
	},
	leave : function() {
		console.log("LEAVING!!! " + this.id);
		this.isEntering = false;
		this.isLeaving = true;
		if(this.audio) {
			this._turnDown(function(){
				$this.pause();
				$this.isLeaving = false;
			});
		}
		else {
			this.pause();
		}
	},
	_map : function() {
		// get the offset from the viewport
		var vh = $(window).height();
		var offset = 0;
		// map the abs value of it between 0 and .5
		var value = Math.abs(offset + vh)/vh;

		if(value < 1) {
					// Set the volume accordingly
		this._set(vh*.5);
			this.play();
		}
		else {
			this.pause();
		}

	},
	_turnDown : function(callback) { 
		var $this = this;
		while (this.audio.volume > 0 && this.isLeaving) {
			console.log("TURNING DOWN!!! " + $this.id + "\tVOL: " + $this.audio.volume);
			if(!this.paused()) {
				$this._down();
			} 	
		}
		if(callback) {
			callback();
		}
	},
	_turnUp : function() { 
		//console.log("TURNING UP!!! " + this.id);

		while (this.audio.volume < .5 && this.isEntering) {
			console.log("TURNING UP!!! " + $this.id + "\tVOL: " + $this.audio.volume);
			if(!this.paused()) {
				$this._down();
			}	
		}
	}
});

$.widget('doc.sketch', $.doc.player, {
	options : {
	},
	_create : function() {
		var $this = this;
		this.element.addClass("doc_sketch");
		var id = this.element.find("canvas").attr("id");
		this.sketch = Processing.getInstanceById(id);
		this.audio = new Audio(this.element.find("audio"));
	},
	_init : function() {
		this.pause();
		// And mute the sound
		if(this.audio) {
			this._mute();
		}
	},
	play : function() {
		this.sketch.loop();
		this.audio.play();
	},
	pause : function() {
		this.sketch.noLoop();
		this.audio.pause();
	},
	_paused : function() {
		return this.audio.paused;
	},
	_up : function() {
		this.audio.volume += 0.0001;

	},
	_down : function() {
		this.audio.volume -= 0.001;
	},
	_mute : function() {
		this.audio.volume = 0;
	},
	_destroy : function() {
		this.element.removeClass("doc_sketch");
	}	
});

$.widget('doc.vimeo', $.doc.player, {
	options : {
		callback : null,
	},
	_create : function() {
		var $this = this;
		this.element.addClass("doc_vimeo");
		this.vimeo = $f(this.element.find('iframe')[0]);
		this.audio = this.vimeo;
	},
	_init : function() {
		var $this = this;
		
		// Set volume to 0
		this.vimeo.addEvent("ready", function(){
			$this._mute();
		});

		// Listen for finish
		this.vimeo.addEvent("finish", function(){ 
			console.log("FINISHED VIDEO!!!");
			if(this.options.callback) {
				this.options.callback();
			}
		});
	},
	play : function() {
		this.vimeo.api("play");
	},
	pause : function() {
		this.vimeo.api("pause");
	},
	_paused : function() {
		this.vimeo.api("paused", function(paused){
			return paused;
		});
	},
	_up : function() {
		var $this = this;
		this.vimeo.api("setVolume", $this._curr() + 0.0001);

	},
	_down : function() {
		var $this = this;
		this.vimeo.api("setVolume",  $this._curr() - 0.001);
	},
	_curr : function() {
		$this.vimeo.api("getVolume", function(volume){
			return volume;
		});
	},
	_mute : function() {
		this.vimeo.api("setVolume", 0);
	}
});