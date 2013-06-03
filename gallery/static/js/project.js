var gallery = gallery || {};
gallery.project = null;

(function(){
	
	var Carousel = gallery.carousel;
	
	var sketch = {
			pause : function(sketch) { sketch.noLoop() },
			play : function(sketch) { sketch.loop() },
			reset : function(sketch) { sketch.reset() },
		}

		
	var video = {
			pause : function(video) { video.api("pause") },
			play : function(video) { video.api("play") },
			reset : function(video) { video.api("play") },
		}
	
	var Project = function Project(project, percHeight) {
		this.code = project.code;
		this.medium = project.medium;
		this.order = project.order;
		this._percHeight = percHeight;
		this.navItem = $("#nav-for-" + this.code);		
		this.div = $("#" + this.code);
		
		// Find live elements
		this._live = this.div.find($(".live")) || [];	
		
		var thisProject = this;		
		// Find Processing sketches
		this._sketches = [];
		$.each(this.div.find($("[type=sketch] canvas")), function(e, el){
			thisProject._sketches.push(Processing.getInstanceById($(el).attr('id')));
		})
		
		// Wire up the carousel
		this._carousel = new Carousel($(this.div.find("ul.carousel")), {
		    onSlideAfter: function (slide, oldIndex, newIndex){
		    	if(slide.hasClass("live"))
		    		thisProject._playPauseResetLiveContent($(slide), "play");
		    	},
		    onSlideBefore: function (slide, oldIndex, newIndex){
		    	if(slide.hasClass("live"))
	    			setTimeout(function(){ thisProject._playPauseResetLiveContent($(slide), "pause"); }, 1000);
	    		},
		});
	};
	
	Project.prototype._playPauseResetLiveContent = function(slide, action) {
		var type = slide.attr("type");
		var func, player;
		switch(type) {
		case "sketch":
			func = sketch;
			player = Processing.getInstanceById(this.code);
			func[action](player);
			break;
		case "video":
			func = video;
			var iframe = slide.find('iframe')[0];
			player = $f(iframe);
			func[action](player);
			break;
		default:
			return;
		}

	},
	
	// Make the carousel go from the beginning
	Project.prototype.start = function(isPreview) {
		if(this._carousel) {
			if(isPreview)
				this._carousel.play(0, true);
			else
				this._carousel.play(0, false);
		}
	}
	
	// Stop the carousel
	// Stop all live elements
	Project.prototype.stop = function() {
		if(this._carousel) this._carousel.stop();
		var thisProject = this;
		$.each(this._live, function(e, el){
			thisProject._playPauseResetLiveContent($(el), "pause");
		});
	}
	
	Project.prototype.shift = function(leftShift, topShift, isSelected) {
		var speed = 0;
		var callback;
		if(this._carousel) this._carousel.stop();
		if(isSelected) {
			speed = 3000;
			callback = this.start;
		}
		else {
			speed = 2500;
			callback = this.stop;
		}
		
		this.div.shift(leftShift, topShift, speed, callback);

	}
		
	// Zoom out into gallery map view
	Project.prototype.zoomOut = function(h) {
		var thisProject = this;
		this.div.animate({
			top : 0,
			left : 0,
			height : h + "px",
			overflow : 'hidden',
		}, "slow", function() {
			thisProject.onResizeHeight();
			});
		this.start(true);
	}
	
	// Middle aligning media items (videos, sketches)
	Project.prototype.onResizeHeight = function() {
		if(this._carousel)
			this._carousel.middleAlignMedia();
	}
	
	// Make project div the size of the window
	Project.prototype.fitToWindow = function() {
		this.div.width($(window).width());
		this.div.height($(window).height());
		
		// Scale this project's Processing sketches
		$.each(this._sketches, function(s, sketch){
			var size = sketch.getSize();
			var width = size.x;
			var height = size.y;
				var scaleX = $(window).width()/width || 0;
			sketch.resize(scaleX, 1);
			});	
		
		this.onResizeHeight();
		}
	
	Project.prototype.getLoc = function() {
		return this.div.offset();
	}
	
	gallery.project = Project;

}());