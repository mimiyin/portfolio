var gallery = gallery || {};
gallery.project = null;

(function(){
	var Carousel = gallery.carousel;
	var SketchPlayer = gallery.sketchPlayer;
	var VimeoPlayer = gallery.vimeoPlayer;
	
	var Project = function Project(project, heightFactor) {
		this.code = project.code;
		this.medium = project.medium;
		this.order = project.order;
		this._heightFactor = heightFactor;
		this.navItem = $("#nav-for-" + this.code);
		this.div = $("#" + this.code);

		var thisProject = this;		

		// Find videos and sketches
		this._players = {};	
		// Find images
		this._stills = this.div.find("li[type=still] img");
		// Find flickrs
		this._flickrs = this.div.find("li[type=flickr] embed");
		// Find videos
		this._vimeos = [];
		// Keep track of sketches for height resizing
		this._sketches = [];
		
		
		
		$.each(this.div.find($("li.player")), function(p, player){
			var type = $(player).attr("type");
			var id;
			switch(type) {
			case "sketch":
				id = $(player).find("canvas").attr("id");
				var instance = Processing.getInstanceById(id);
				thisProject._players[id] = new SketchPlayer(id, instance);
				thisProject._sketches.push(instance);
				break;
			case "vimeo":
				var vimeoEl = $(player).find("iframe.vimeo");
				id = vimeoEl.attr("id");
				var vimeoPlayer = vimeos[id];
				thisProject._players[id] = new VimeoPlayer(id, vimeoPlayer);
				thisProject._vimeos.push(vimeoEl);
				break;
			}
		});	
		// Wire up the carousel
		thisProject._carousel = new Carousel($(thisProject.div.find("ul.carousel")), {
			onSlideStop : function(slide) {
		    	if(slide.hasClass("player")) {
			    	var id = $(slide.children()[0]).attr("id");
			    	thisProject._players[id].pause();
			    	}				
			},
		    onSlideAfter: function (slide, oldIndex, newIndex, callback){
		    	// Only play featured movies if we're zoomed out
		    	if(slide.hasClass("player") && (!gallery.control.isZoomedOut || ((slide.hasClass("featured") && Math.random() > .67)))) {		    	
			    	var id = $(slide.children()[0]).attr("id");
			    	thisProject._players[id].play(callback || null);
			    	}
		    	else
		    		if(callback) callback();
		    	},
		    onSlideBefore: function (slide, oldIndex, newIndex){
		    	if(slide.hasClass("player")) {
			    	var id = $(slide.children()[0]).attr("id");
		    		thisProject._players[id].pause();
		    		}
		    	},
		}) || null;			
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
		if(this._carousel) this._carousel.stop();
	}
	
	
		
	// Shift all projects
	// Start the project if we are going to this project
	// Only stop project if we are leaving this project
	Project.prototype.shift = function(leftShift, topShift, isPlaying) {
		var thisProject = this;
		var callback;
		
		if(isPlaying)
			//I have to stop it first, otherwise, there will be interfering
			//timed callbacks interfering with playing
			callback = function() { thisProject.stop(); thisProject.start(); };
		else if(this._isPlaying)
			callback = function() { thisProject.stop(); };	

		this.div.shift(leftShift, topShift, 100, 100, isPlaying ? 1000 : 500, callback);
		
	}
	
	// Re-adjust top offset based on absolute positioning
	// Which is needed to make the "shift" feature work
	Project.prototype.zoomIn = function(row) {
		this.div.css("top", row*100 + "%");
		this.div.height($(window).height());
		this._carousel.middleAlignMedia();
	}
		
	// Zoom out into gallery map view
	Project.prototype.zoomOut = function() {
		this.start();
		var thisProject = this;
		this.div.animate({
			opacity : .1,
			top : 0,
			left : 0,
			height : thisProject._calcZoomedOutHeight(),
			overflow : 'hidden',
		}, Math.random()*2000 + 500, function() {
			$(this).fadeTo(Math.random()*10000 + 2500, 1);
			thisProject.resizeMedia();
			thisProject._carousel.middleAlignMedia();		
			})
	}
	
	Project.prototype.resizeMedia = function() {
		var thisProject = this;
		// Scale this project's Processing sketches
		$.each(this._sketches, function(s, sketch){
			var canvas = $(sketch.externals.canvas);
			var width = canvas.width();
			var height = canvas.height();
			var scaleX = thisProject.div.width()/width || 1;
			var scaleY = thisProject.div.height()/height || 1;
			sketch.resize(scaleX, scaleY);
			});	
		
		// Scale this project's videos and stills in the same way
		var scaleToAlwaysFull = function(media) {
			$.each(media, function(m, medium){
				medium = $(medium);
				if(thisProject.div.width() < thisProject.div.height()*1.77) {
					medium.height(thisProject.div.height());
					medium.width(medium.height()*1.78);
					medium.css("margin-left", -(medium.width()-thisProject.div.width())/2);
				}
				else {
					medium.width("100%");
					medium.height(medium.width()*.562);
					medium.css("margin-left", 0);
					}
				});				
		}
		
		scaleToAlwaysFull(this._stills);
		scaleToAlwaysFull(this._vimeos);
	}
	
	Project.prototype._calcZoomedOutHeight = function() {
		return $(window).height()*this._heightFactor;
	}
	
	// Make project div the size of the window
	Project.prototype.fitToWindow = function() {
		var newWidth = $(window).width();
		var newHeight = gallery.control.isZoomedOut ? this._calcZoomedOutHeight() : $(window).height();
		var oldHeight = this.div.height();

		this.div.width(newWidth);
		this.div.height(newHeight);
		this.div.css("font-size", $(window).width()*$(window).height()*.0000015 + "em");
		this.resizeMedia();
		
		this._carousel.middleAlignMedia();
		}
		
	gallery.project = Project;

}());