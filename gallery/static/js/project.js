var gallery = gallery || {};
gallery.project = null;

(function(){
	
	var Carousel = gallery.carousel;
	
	var sketch = {
			pause : function(sketch) { 
				sketch.noLoop();
				try{
					var audio = sketch.getAudio();
					this.mute(audio);
					}
				catch(e) {
					console.log(sketch.externals.canvas.id + " has no audio.");
				}

				},
			play : function(sketch) { 
				sketch.loop();
				try{
					var audio = sketch.getAudio();
					if(gallery.control.isZoomedOut)
						this.mute(audio);
					else
						this.unmute(audio);
					}
				catch(e) {
					console.log(sketch.externals.canvas.id + " has no audio.");
					}
				},
			reset : function(sketch) { sketch.reset() },
			mute : function(audio) { 
				var turnDown = function() {
					audio.volume-=.005; 	
					if(audio.volume > 0)
						setTimeout(turnDown, 100);
					else
						audio.pause();
					}
				if(audio)
					turnDown();
			},
			unmute : function(audio) { 
				var turnUp = function() {
					audio.play();
					audio.volume+=.005; 	
					if(audio.volume < .5)
						setTimeout(turnUp, 100);
					}
				if(audio)
					turnUp();
			},
		}

		
	var video = {
			pause : function(video) { 
				if(gallery.control.isZoomedOut)
					video.api("setVolume", 0);
				else
					this.mute(video);
				},
			play : function(video) { 
				video.api("setVolume", 0);
				video.api("play");

				if(!gallery.control.isZoomedOut)
					this.unmute(video);
				},
			reset : function(video) { video.api("play") },
			unmute : function(video) { 
				var turnUp = function() {
					video.api("getVolume", function(volume){
						var newVolume = parseFloat(volume) +.001;
						video.api("setVolume", newVolume); 
						if(newVolume < .1)
							setTimeout(turnUp, 100);
						});
					}
				turnUp();
				},
			mute : function(video) { 
				var turnDown = function() {
					video.api("getVolume", function(volume){
						var newVolume = volume - .001;
						video.api("setVolume", newVolume); 
						if(newVolume > 0)
							setTimeout(turnDown, 100);
						else
							video.api("pause");
						});
				}
				turnDown();
			}
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
		}) || null;
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
	Project.prototype.start = function() {
		if(this._carousel) {
			this._carousel.play();
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
	
	// Shift all projects
	Project.prototype.shift = function(leftShift, topShift, isZoomedIn) {
		var thisProject = this;
		var callback = isZoomedIn ? function() { thisProject.start(); } : function() { thisProject.stop(); }
		this.div.shift(leftShift, topShift, 100, 100, isZoomedIn ? 3000 : 2500, callback );
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
	}
	
	// Middle aligning media items (videos, sketches)
	Project.prototype.onResizeHeight = function() {
		if(this._carousel)
			this._carousel.middleAlignMedia();
	}
	
	// Make project div the size of the window
	Project.prototype.fitToWindow = function() {
		var newWidth = $(window).width();
		var newHeight = $(window).height();
		var oldHeight = this.div.height();

		this.div.width(newWidth);
		this.div.height(newHeight);
		
		//this.div.shift(0, oldHeight-newHeight, 0, 1);
		
		// Scale this project's Processing sketches
		$.each(this._sketches, function(s, sketch){
			var canvas = $(sketch.externals.canvas);
			var width = canvas.width();
			var height = canvas.height();
			var scaleX = newWidth/width || 1;
			var scaleY = newHeight/height || 1;
			console.log("SCALEY: " + scaleY);
			sketch.resize(scaleX, scaleY);
			});	
		
		this.onResizeHeight();
		}
		
	gallery.project = Project;

}());