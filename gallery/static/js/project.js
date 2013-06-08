var gallery = gallery || {};
gallery.project = null;

(function(){
	var Carousel = gallery.carousel;
	
	var Project = function Project(project, percHeight) {
		this.code = project.code;
		this.medium = project.medium;
		this.order = project.order;
		this._percHeight = percHeight;
		this.navItem = $("#nav-for-" + this.code);
		this.div = $("#" + this.code);
		this._more = this.div.find('.more');

		var thisProject = this;		

		// Find videos
		this._vimeos = {};	
		$.each(this.div.find($("iframe.vimeo"), function(v, vimeo){
			var id = $(vimeo).attr('id');
			thisProject._vimeos[id] = new VimeoPlayer(vimeo);
		});
		
		// Find Processing sketches
		this._sketches = {};
		$.each(this.div.find($("[type=sketch] canvas")), function(c, canvas){
			var id = $(canvas).attr('id');
			thisProject._sketches[id] = new SketchPlayer(Processing.getInstanceById(id));
		})
		
		// Wire up the carousel
		this._carousel = new Carousel($(this.div.find("ul.carousel")), {
		    onSlideAfter: function (slide, oldIndex, newIndex, callback){
		    	if(slide.hasClass("live"))
		    		thisProject._playPauseResetLiveContent($(slide), "play", callback);
		    	else if(callback)
		    		callback();
		    	},
		    onSlideBefore: function (slide, oldIndex, newIndex){
		    	var id = slide.attr("id");
		    	if(slide.hasClass("vimeo"))
	    			setTimeout(function(){ thisProject._playPauseResetLiveContent($(slide), "pause"); }, 1000);
		    },
	    	onSlideLast: function() {
	    		setTimeout(function() { thisProject._more.slideDown("slow"); }, 2500);
	    		},
		}) || null;
	};
	
	// Callback is for telling carousel that it can advance 
	// to the next slide once  the media has finished
	Project.prototype._playPauseResetLiveContent = function(slide, action, callback) {
		var type = slide.attr("type");
		var func, player;
		switch(type) {
		case "sketch":
			func = sketchPlayer;
			func[action](Processing.getInstanceById(this.code));
			if(callback) callback();
			break;
		case "video":
			func = videoPlayer;
			if(callback)
				$f(slide.find('iframe')[0]).addEvent("finish", callback);
			func[action]($f(slide.find('iframe')[0]), this.code);
			break;
		default:
			return;
		}
	},
	
	// Make the carousel go from the beginning
	Project.prototype.start = function() {
		this._isPlaying = true;
		if(this._carousel) {
			this._carousel.play();
		}
	}
	
	// Stop the carousel
	// Stop all live elements
	Project.prototype.stop = function() {
		this._isPlaying = false;
		if(this._carousel) this._carousel.stop();
		var thisProject = this;
		$.each(this._live, function(e, el){
			thisProject._playPauseResetLiveContent($(el), "pause");
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
		if(!isResizing)
			this.start();
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
		$.each(this._sketches, function(s, sketchObj){
			var sketch = sketchObj.sketch;
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