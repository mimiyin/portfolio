var gallery = gallery || {};
gallery.project = null;

(function(){
	var Carousel = gallery.carousel;
	var SketchPlayer = gallery.sketchPlayer;
	var VimeoPlayer = gallery.vimeoPlayer;

	var Project = function Project(project) {
		var self = this;		

		this.code = project.code;
		this.medium = project.medium;
		this.order = project.order;
		this._element = $("#" + this.code);
				
		// Wire up the players
		$.each(this._element.find($("li canvas iframe")), function(p, player){
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
		this._carousel = this._element.find(".carousel").bxSlider({
			infiniteLoop : true,
			pager: false,
			controls: false,
			preventDefaultSwipeY : false,
			mode : 'vertical',
			video: true,
			useCSS: false,
		    onSlideBefore: function (slide, oldIndex, newIndex){
		    	console.log("MOVING", oldIndex, newIndex);
		    	var currSlide = self._carousel.find("li:eq(" + newIndex + ")");
		    	var id = $(currSlide.find('canvas, iframe')[0]).attr("id");
		    	if(id) {
	    			self._players[id].pause();
	    		}
		    	var id = $(slide.find('canvas, iframe')[0]).attr("id");
		    	if(id) {
	    			self._players[id].play();
	    			}
	    		}
		});	

		$("#nav-wrapper").click(function(){
			if(gallery.control.currentProject && (gallery.control.currentProject.code == self.code)) {
				self._carousel.goToNextSlide();
			}
		})

		// Emit click
		this._element.click(function(){ $(self).trigger('click', self.code) });

		// Listen for move
		$(gallery.control).on('move', function(event){
			self.move();
		});
	}; 

	// Start the project
	Project.prototype.start = function() {
		this._carousel.goToSlide(0);
	}

	// Stop the project
	Project.prototype.stop = function() {
		var currIndex = this._carousel.getCurrentSlide();
		var currSlide = this._carousel.find("li:eq(" + index + ")");
	}

	// Shift all projects
	// Start the project if we are going to this project
	// Only stop project if we are leaving this project
	Project.prototype.move = function() {
		this._carousel.goToSlide(0);
	}

	gallery.project = Project;

}());