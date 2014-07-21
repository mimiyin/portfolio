// Listen for scrolling



// Player controls
$.widget('doc.player', {
	options : {
	},
	_create : function() {
		var $this = this;
		this.id = this.element.find("canvas, iframe").attr("id");
		this._on({
			"click" : $this._toggle,
		});

		//Listen for focus and scroll on parent element
		this.viewport = $(this.element.parents(".project")[0]);
		this.viewport.on("scroll click", function(event){
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
		console.log("ENTERING", this.id);
		var $this = this;
		this.isLeaving = false;
		this.play();
		// Turn up the volume if there's audio
		if(this.audio) {
			this._turnUp(1);	
		}
	},
	leave : function() {
		console.log("LEAVING", this.id);
		var $this = this;
		this.isEntering = false;
		this.isLeaving = true;
		if(this.audio) {
			this._turnDown(0, function(){
				$this.pause();
				$this.isLeaving = false;
			});
		}
		else {
			this.pause();
		}
	},
	_map : function() {
		// Get the view height
		var vh = $(window).height();
		// Get the offset from the viewport
		var acreage = parseInt((this.element.offset().top + vh) / vh);
		console.log("MAPPING", this.id, this.element.offset().top, acreage);
		if(acreage >= 0 && acreage <= 2) {
			this.play();
			if(this.audio) {
				this._dial(acreage*0.5);
			}
		}
		else {
			this.pause();
			if(this.audio) {
				this._set(0);
			}
		}

	},
	// Go up or go down
	_dial : function(goal) {
		var curr = this._get();
		if(curr == goal) {
			return;
		}

		if(curr < goal) {
			this._turnUp(goal);
		}
		else {
			this._turnDown(goal);
		}
	},
	_turnDown : function(goal, callback) { 
		var $this = this;
		while (this._get() > goal && this.isLeaving) {
			console.log("TURNING DOWN!!! " + $this.id + "\tVOL: " + $this.audio.volume);
			if(!$this.paused()) {
				$this._down();
			} 	
		}
		if(callback) {
			callback();
		}
	},
	_turnUp : function(goal, callback) { 
		var $this = this;
		while (this._get() < goal && !this.isLeaving) {
			console.log("TURNING UP!!! " + $this.id + "\tVOL: " + $this.audio.volume);
			if(!$this._paused()) {
				$this._up();
			}	
		}
		if(callback) {
			callback();
		}
	},
	_up : function() {
		this._set(this._get() + 0.001);

	},
	_down : function() {
		this._set(this._get() - 0.01);
	},
	_set : function(volume) {
		if(volume >= 1) {
			volume = 0.9999;
		}
		else if(volume < 0) {
			volume = 0;
		}
	}
});

$.widget('doc.sketch', $.doc.player, {
	options : {
	},
	_create : function() {
		this._super();
		this.sketch = Processing.getInstanceById(this.id);
		this.audio = this.element.find("audio")[0] || null;
	},
	_init : function() {
		this.pause();
		// And mute the sound
		if(this.audio) {
			this._set(0);
		}
	},
	play : function() {
		console.log("PLAY", this.id);
		this.sketch.loop();
		if(this.audio) {
			this.audio.play();
		}
	},
	pause : function() {
		console.log("PAUSE", this.id);
		this.sketch.noLoop();
		if(this.audio) {
			this.audio.pause();
		}
	},
	_paused : function() {
		return this.audio.paused;
	},
	_get : function() {
		return this.audio.volume;
	},
	_set : function(volume) {
		this._super(volume);
		this.audio.volume = volume;
		console.log("SETTING", this.id, this.audio.volume);
	}
});

$.widget('doc.vimeo', $.doc.player, {
	options : {
		callback : null,
	},
	_create : function() {
		this._super();
		this.vimeo = $f(this.element.find('iframe')[0]);
		this.audio = this.vimeo;
	},
	_init : function() {
		var $this = this;
		
		// Set volume to 0
		this.vimeo.addEvent("ready", function(){
			$this._set(0);
		});

		// Listen for finish
		this.vimeo.addEvent("finish", function(){ 
			console.log("FINISHED", this.id);
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
	_get : function() {
		this.vimeo.api("getVolume", function(volume){
			return volume;
		});
	},
	_set : function(volume) {
		this._super(volume);
		this.vimeo.api("setVolume", volume);
	}
});