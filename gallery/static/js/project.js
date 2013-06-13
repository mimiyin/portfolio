var gallery = gallery || {};
gallery.project = null;

(function(){
	var Carousel = gallery.carousel;
	var SketchPlayer = gallery.sketchPlayer;
	var VimeoPlayer = gallery.vimeoPlayer;
	
	var Project = function Project(project, percHeight) {
		this.code = project.code;
		this.medium = project.medium;
		this.order = project.order;
		this._percHeight = percHeight;
		this.navItem = $("#nav-for-" + this.code);
		this.div = $("#" + this.code);

		var thisProject = this;		

		// Find videos and sketches
		this._players = {};	
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
				var vimeo = $(player).find("iframe.vimeo");
				id = vimeo.attr("id");
				var vimeoPlayer = vimeos[id];
				thisProject._players[id] = new VimeoPlayer(id, vimeoPlayer);				
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
		    	if(slide.hasClass("player") && (!gallery.control.isZoomedOut || slide.hasClass("featured"))) {		    	
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

		this.div.shift(leftShift, topShift, 100, 100, isPlaying ? 3000 : 2500, callback);
		
	}
	
	// Re-adjust top offset based on absolute positioning
	// Which is needed to make the "shift" feature work
	Project.prototype.zoomIn = function(row) {
		this.div.css("top", row*100 + "%");
	}
		
	// Zoom out into gallery map view
	Project.prototype.zoomOut = function(h, isResizing) {
		if(!isResizing)
			this.start();
		var thisProject = this;
		this.div.animate({
			opacity : .1,
			top : 0,
			left : 0,
			height : h + "px",
			overflow : 'hidden',
		}, Math.random()*5000 + 2500, function() {
			$(this).fadeTo(Math.random()*10000 + 2500, 1);
			thisProject.resizeSketches();
			thisProject.onResizeHeight();
			})
	}
	
	// Middle aligning media items (videos, sketches)
	Project.prototype.onResizeHeight = function() {
		if(this._carousel)
			this._carousel.middleAlignMedia();
	}
	
	Project.prototype.resizeSketches = function() {
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
	}
	
	// Make project div the size of the window
	Project.prototype.fitToWindow = function() {
		var newWidth = $(window).width();
		var newHeight = $(window).height();
		var oldHeight = this.div.height();

		this.div.width(newWidth);
		this.div.height(newHeight);
		this.resizeSketches();
		
		//this.div.shift(0, oldHeight-newHeight, 0, 1);
		this.onResizeHeight();
		}
		
	gallery.project = Project;

}());