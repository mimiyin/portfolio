var gallery = gallery || {};
gallery.carousel = null;

(function(){
	var Carousel = function(element, options) {
		this.defaults = {
				normal : {fadeIn : 1000, fadeOut, 1000},
				intro : {fadeIn : 1000, fadeOut, 1000},
				isAuto : false,
		}

		this._options = $.extend( {}, this.defaults, options );
		
		// Storey duration for slides with each slide
		this._slidesObjs = [];
		$.each(element.children(), function(s, slide){
			var type = slide.attr('type');
			var slideObj = { 
					"slide" : slide, 
					"fadeIn" : this._options.durations[type].fadeIn ||  this._options.durations["normal"].fadeIn, 
					"fadeOut" : this._options.durations[type].fadeOut || this._options.durations["normal"].fadeOut,
					}
			this._slidesObjs.push(slideObj);
		};
		
		// Create look-up table for key slides
		this.keySlides = { 
				'intro' : this.find('.intro').index(), 
				'still' : this.find('.still').index(), 
				'video' : this.find('.video').index(),
				};
		
		this._init();
	}
	
	Carousel.prototype._init() = function() {
		this.slides.css("opacity", .01);
	}
	
	// Cycle through all the slides
	Carousel.prototype.play = function() {
		cycle(0);
		var cycle = function(index) {
			this._slideObjs[index-1].fadeOut(slideObj.fadeOut);
			this._slideObjs[index].fadeIn(slideObj.fadeIn, function(){
				if(index < this._slideObjs.length-1)
					cycle(index+1);
			});
		}
	}
	
	// Go to a particular slide
	Carousel.prototype.goToSlide = function(slideKey) {
		var index = typeof slideKey == "string" ? this._keySlides[slideKey] : slideKey;
		var slideObj = this._slideObjs[slideKey].slide;
		slideObj.slide.fadeIn(slideObj.fadeIn);
	}
		
}())