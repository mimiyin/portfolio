var gallery = gallery || {};
gallery.project = null;

(function(){
	
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
		var thisProject = this;
		this.code = project.code;
		this.medium = project.medium;
		this.order = project.order;
		this._percHeight = percHeight;
		this.navItem = $("#nav-for-" + this.code);		
		this.div = $("#" + this.code);
		
		// Find live elements
		this._live = [];		
		$.each(this.div.find($(".live")), function(e, element){
			thisProject._live.push(element);
		})
		
		// Wire up the carousel
		this._carousel = $(this.div.find("ul.carousel")).bxSlider({
			auto: false,
			pager: false,
			controls: false,
			//mode: "fade",
		    pause: 10000,
		    infiniteLoop: true,
		    startingSlide: 1,
		    onSlideAfter: function (slide, oldIndex, newIndex){
		    	if(slide.hasClass("live"))
		    		thisProject._playPauseResetLiveContent($(slide), "play");
		    	},
		    onSlideBefore: function (slide, oldIndex, newIndex){
		    	if(slide.hasClass("live"))
	    			thisProject._playPauseResetLiveContent($(slide), "pause");
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
		}

	},
	
	// Make the carousel go, from the beginning
	Project.prototype.start = function(slide) {
		if(this._carousel) {
			this._carousel.startAuto();
			this._carousel.goToSlide(slide);
		}
	}
	
	// Stop the carousel
	// Stop all live elements
	Project.prototype.stop = function() {
		var thisProject = this;
		if(this._carousel) this._carousel.stopAuto();
		$.each(this._live, function(e, element){
			thisProject._playPauseResetLiveContent(element, "pause");
		});
	}
		
	Project.prototype.open = function() {
		var thisProject = this;
		this.div.toggleClass("isOn", true, 1000, thisProject.start);
	}
	Project.prototype.close = function() {
		var thisProject = this;
		this.div.toggleClass("isOn", false, 500, thisProject.stop);
	}
	
	Project.prototype.zoomOut = function() {
		//var thisProject = this;
		//this.open();
		//this.div.find("html").css("zoom", .33);
		// Resize the height
		//this.div.height($(window).height()*this._percHeight);
		//this._carousel.height(this.div.height());
		//this._carousel.find("li").width(thisProject.div.width()*.25);
		//this.start(0);
	}

	Project.prototype.resize = function() {
		this.div.width("100%");
		this.div.css("min-height", $(window).height());
		this.div.find(".bx-viewport").height($(window).height());
		this.div.find("ul.carousel").height($(window).height());
		this.div.find("li").height($(window).height());
	}
	
	Project.prototype.getLoc = function() {
		return this.div.offset();
	}
	
	gallery.project = Project;
	

}());