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
		this._more = this.div.find('.more');

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
				var vimeoPlayer = $f(vimeo[0]);
				thisProject._players[id] = new VimeoPlayer(id, vimeoPlayer);
				vimeoPlayer.api("getVolume", function(){
					console.log("WUT");
				});
				
				break;
			}
		})
		
		// Wire up the carousel
		this._carousel = new Carousel($(this.div.find("ul.carousel")), {
		    onSlideAfter: function (slide, oldIndex, newIndex, callback){
		    	if(slide.hasClass("player")) {
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
			this._carousel.play(0);
		}
	}
	
	// Stop the carousel
	// Stop all live elements
	Project.prototype.stop = function() {
		this._isPlaying = false;
		if(this._carousel) this._carousel.stop();
		
		// Pause all the players
		$.each(this._players, function(p, player){
			player.pause();
		});
	}
		
	// Shift all projects
	// Start the project if we are going to this project
	// Only stop project if we are leaving this project
	Project.prototype.shift = function(leftShift, topShift, isZoomedIn) {
		var callback = isZoomedIn ? function() { thisProject.start(); } : (this._isPlaying ? function() { thisProject.stop(); } : null);		
		var thisProject = this;
		this.div.shift(leftShift, topShift, 100, 100, isZoomedIn ? 3000 : 2500, callback );
	}
		
	// Zoom out into gallery map view
	Project.prototype.zoomOut = function(h, isResizing) {
		if(!isResizing) {
			// Turn down all the players
			$.each(this._players, function(p, player){
				player.turnDown();
			});
			this.start();
		}
		this._more.slideUp("fast");
		var thisProject = this;
		this.div.animate({
			top : 0,
			left : 0,
			height : h + "px",
			overflow : 'hidden',
		}, "slow", function() {
			thisProject.resizeSketches();
			thisProject.onResizeHeight();
			});
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