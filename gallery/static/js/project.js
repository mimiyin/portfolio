var gallery = gallery || {};
gallery.project = null;

(function(){
	var Carousel = gallery.carousel;
	var SketchPlayer = gallery.sketchPlayer;
	var VimeoPlayer = gallery.vimeoPlayer;

	var Project = function Project(project) {
		this.code = project.code;
		this.medium = project.medium;
		this.order = project.order;
		this._element = $("#" + this.code);

		var self = this;		

		// Find videos and sketches
		this._players = {};	
		// Find images
		this._stills = this._element.find("li[type=still] img");
		// Find flickrs
		this._flickrs = this._element.find("li[type=flickr] embed");
		// Find videos
		this._vimeos = [];
		// Keep track of sketches for height resizing
		this._sketches = [];
				
		// Wire up the players
		$.each(this._element.find($("li.player")), function(p, player){
			var type = $(player).attr("type");
			var id;
			switch(type) {
			case "sketch":
				id = $(player).find("canvas").attr("id");
				var instance = Processing.getInstanceById(id);
				self._players[id] = new SketchPlayer(id, instance);
				self._sketches.push(instance);
				break;
			case "vimeo":
				var vimeoEl = $(player).find("iframe.vimeo");
				id = vimeoEl.attr("id");
				var vimeoPlayer = vimeos[id];
				self._players[id] = new VimeoPlayer(id, vimeoPlayer);
				self._vimeos.push(vimeoEl);
				break;
			}
			
		});	

		// Wire up the carousel
		self._carousel = new Carousel($(self._element.find("ul.carousel")), {
			onSlideStop : function(slide) {
		    	if(slide.hasClass("player")) {
			    	var id = $(slide.children()[0]).attr("id");
			    	self._players[id].pause();
			    	}				
			},
		    onSlideAfter: function (slide, oldIndex, newIndex, callback){
		    	// Only play featured movies if we're zoomed out
		    	if(slide.hasClass("player") && (!gallery.control.isZoomedOut || ((slide.hasClass("featured") && Math.random() > .67)))) {		    	
			    	var id = $(slide.children()[0]).attr("id");
			    	self._players[id].play(callback || null);
			    	}
		    	else
		    		if(callback) callback();
		    	},
		    onSlideBefore: function (slide, oldIndex, newIndex){
		    	if(slide.hasClass("player")) {
			    	var id = $(slide.children()[0]).attr("id");
		    		self._players[id].pause();
		    		}
		    	},
		}) || null;	

		// Emit click
		this._element.click(function(){ $(self).trigger('click', self.code) });

		// Listen for zoomIn
		$(gallery.control).on('zoomIn', function(shift){
			self.shift(shift.left, shift.top);
		});
	};

	// Make the carousel go from the beginning
	Project.prototype.start = function() {
		this._isPlaying = true;
		if(this._carousel) {
			this._carousel.start();
		}
	}
	
	// Stop the carousel
	// Stop all live elements
	Project.prototype.stop = function() {
		//console.log("STOPPING: " + this.code);
		this._isPlaying = false;
		if(this._carousel) {
			this._carousel.stop();
		}
	}
		
	// Shift all projects
	// Start the project if we are going to this project
	// Only stop project if we are leaving this project
	Project.prototype.shift = function(leftShift, topShift) {
		var self = this;
		var callback;

		var duration = gallery.control.isZoomedOut ? 0 : 500; 
		
		if(this.isZoomedIn) {
			//I have to stop it first, otherwise, there will be interfering
			//timed callbacks interfering with playing
			callback = function() { self.start(); };
		}
		else if(this._isPlaying) {
			callback = function() { self.stop(); };	
		}
				
		this._element.shift(leftShift, topShift, 100, 100, duration, callback);		
	}

	// Zoom out into gallery map view
	Project.prototype.zoomOut = function() {
		this.start();
		var self = this;
		this._element.animate({
			opacity : .1,
			top : 0,
			left : 0,
			height : self._calcZoomedOutHeight(),
			overflow : 'hidden',
		}, Math.random()*2000 + 500, function() {
			$(this).fadeTo(Math.random()*10000 + 2500, 1);
			self.resizeMedia();
			self._carousel.middleAlignMedia();		
			})
	}

	gallery.project = Project;

}());