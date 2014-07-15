$.widget('doc.project', {
	options : {
		code : null,
		medium : null,
		order : null
	},
	_create : function() {
		var $this = this;
		this.element.addClass("doc_project");
		this.loaded = false;

	},
	_init : function() {
		this._load();
	},
	_load : function() {
		var $this = this;

		// Load sketches
		this.sketches = this.element.find("[type=sketch]").sketch();
		// Load vimeos
		this.vimeos = this.element.find("[type=vimeo]").vimeo();

		// Load embedded websites
		this.wwws = this.element.find("[type=www]");

		// Load embedded flickr slideshows
		this.flickrs = this.element.find("[type=flickr]");

		// Slides
		this.players = [];
		$.each(this.element.find("li"), function(s, slide){
			var type = $(slide).attr("type");
			if(type == "vimeo" || type == "sketch") {
				$this.players.push($(slide)[type]().data("doc-" + type));
			}
		});

		// First slide
		if(this.players.length > 0) {
			this.hasPlayers = true;
			this.currSlide = this.players[0];
		}

		// Wire up the carousel
		this.carousel = this.element.find(".carousel").bxSlider({
			infiniteLoop : false,
			pager: true,
			controls: false,
			mode : 'vertical',
			video: true,
			useCSS: false,
		    onSlideBefore: function (slide, oldIndex, newIndex){
		    	$this.slides[oldIndex].leave();
		    	$this.slides[newIndex].enter();
		    	$this.currSlide = $this.slides[newIndex];
	    	},
		});	

		this.loaded = true;
	},
	_start : function() {
		if(this.hasPlayers) {
			this.currSlide.enter();
		}
	},
	_stop : function() {
		if(this.hasPlayers) {
			this.currSlide.leave();
		}
	},
	select : function() {
		if(!this.loaded) {
			this._load();
		}

		// Wait for everything to load before starting
		this._start();
	},
	deselect : function() {
		this._stop();
	}
});