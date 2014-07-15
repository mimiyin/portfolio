$.widget('doc.navitem', {
	options : {
		onSelected : null,
	},
	_create : function() {
		this.element.addClass("doc_nav");
		this.id = this.element.attr("code");
		this._on({
			"click" : $this._select,
			"mouseenter" : $this._enter,
			"mouseleave" : $this._leave,
		})
	},
	_init : function() {
		this.carousel = this.element.find(".carousel").bxSlider({
			auto: false,
			speed: 500,
		});

	},
	_select : function() {
		this._trigger('selected');
	},
	enter : function() {
		this.carousel.bxSlider('auto', true);
	},
	leave : function() {
		this.carousel.goToSlide(0);
		this.carousel('auto', false);

	},
	_turnDown = function(callback) { 
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
	_turnUp = function() { 
		//console.log("TURNING UP!!! " + this.id);

		while (this.audio.volume < .5 && this.isEntering) {
			console.log("TURNING UP!!! " + $this.id + "\tVOL: " + $this.audio.volume);
			if(!this.paused()) {
				$this._down();
			}	
		}
	},
	_destroy : function() {
		this.element.removeClass("doc_nav");
	}	
});