var gallery = gallery || {};
gallery.carousel = null;

(function(){
	var Carousel = function(element, options) {
		var defaults = {
				normal : { fadeIn : 5000, fadeOut : 1000 },
				title : { fadeIn : 1000, fadeOut : 5000, delay : 7500 },
				isAuto : false,
		}
		
		// Extend options
		this._options = $.extend( {}, defaults, options );
		this._el = element;
		
		// Seeding slide nav events
		this.onSlideAfter = this._options.onSlideAfter || function() {};
		this.onSlideBefore = this._options.onSlideBefore || function() {};
		this.onSlideLast = this._options.onSlideLast || function() {};
		
		// Storey duration for slides with each slide
		this._slides = element.children();
		this._slideObjs = [];
		var thisCar = this;
		$.each(this._slides, function(s, slide){
			var slide = $(slide);
			// Position all slides at the top
			slide.css("top", -s*100 + "%");
			
			var type = slide.attr('type') in thisCar._options ? slide.attr('type') : 'normal';
			var slideObj = { 
					"slide" : slide, 
					"fadeIn" : thisCar._options[type].fadeIn ||  thisCar._options["normal"].fadeIn, 
					"fadeOut" : thisCar._options[type].fadeOut || thisCar._options["normal"].fadeOut,
					"delay" : thisCar._options[type].delay || 0,
					}
			thisCar._slideObjs.push(slideObj);
		});
		
		// Create look-up table for key slides
		this._keySlides = { 
				'title' : thisCar._el.find('.title-slide').index(), 
				'still' : thisCar._el.find('.still-slide').index(), 
				'video' : thisCar._el.find('.video-slide').index(),
				};	
		
		// Calculate delay for title slide
		this._options.title.delay = thisCar._el.find('.title-slide').text().length*100;
		
		// Start off carousel with title slide
		this._currentSlideIndex = 0;
	}
	
	// Middle align any videos and sketches
	Carousel.prototype.middleAlignMedia = function() {
		$.each(this._slides, function(s, slide){
			var slide = $(slide);
			
			//Vertical align media items
			$.each(slide.children(".media"), function(e, el){
				var el = $(el);
				el.css("margin-top" , -el.height()/2 + "px");
			});
		});
	}
	
	// Cycle through all the slides
	Carousel.prototype.play = function(slideKey) {
		this._isPaused = false;
		
		// Interrupt all previous animations
		this._slides.stop(true, true);
		var thisCar = this;
		var index = this._testSlideKey(slideKey) || 0;
		function cycle(index) {
			if(thisCar._isPaused)
				return;

			var isPreview = gallery.control.isZoomedOut;
			var isLastSlide = index >= thisCar._slideObjs.length-1;
			var nextIndex = isLastSlide ? 0 : index + 1;

			// Tell project we're on the last
			// slide to cue the nav panels
			if(isLastSlide)
				thisCar.onSlideLast();

			// If on first slide, leave the last slide
			thisCar.goFromSlide(index > 0 ? index-1 : thisCar._slides.length-1);
			
			console.log(thisCar._el.parent().attr("id") + ": " + index + " of " + thisCar._slides.length);
			thisCar.goToSlide(index, function(){
				// If you've reached the end of the slide, stop cycling
				if(isLastSlide)
					return;
				if(!isPreview)
					cycle(nextIndex) });
			
			// Don't wait for callbacks to move onto next slide in Preview mode
			if(isPreview)
				setTimeout(function(){ cycle(nextIndex) }, Math.random()*5000);					
			}
		cycle(index);
	}
	
	// Stop all animation.
	// Optional slideKey to stop on
	Carousel.prototype.stop = function(slideKey) {
		this._isPaused = true;
		var thisCar = this;
		var index = this._testSlideKey(slideKey) || 0;
		$.each(this._slideObjs, function(s, slideObj) {
			var slide = slideObj.slide;
			slide.stop(true, true);
			thisCar.onSlideBefore(slide, s, s+1);			
		});
	}
	
	// Go to a particular slide
	// If it's a movie, wait for it to finish
	Carousel.prototype.goToSlide = function(slideKey, callback) {
		var thisCar = this;
		var index = this._testSlideKey(slideKey);
		var slideObj = this._slideObjs[slideKey];
		var slide = slideObj.slide;
		var transitionTime;
		
		if(slide.hasClass("slide-in")) {
			slide.css("opacity" , 1).slideUp("fast", function(){
				$(this).css("display", "block");
			});
			transitionTime = 200;
		}
		else {
			slide.animate({opacity : 1 }, slideObj.fadeIn);
			transitionTime = slideObj.fadeIn;
		}
		
		// Kick off media right away
		thisCar.onSlideAfter(slide, index, index-1, function(){
			// Callback after slide fades in and has been held in place (if there is a delay specified)
			setTimeout(function() {
				if(callback)
					callback();
			}, transitionTime + ( slideObj.delay || 0) );	
		});
	}
	// Leave a particular slide
	Carousel.prototype.goFromSlide = function(slideKey, callback) {
		if(slideKey < 0)
			return;
		var thisCar = this;
		var index = this._testSlideKey(slideKey);
		var slideObj = this._slideObjs[slideKey];
		var slide = slideObj.slide;
		var onComplete = function(){
			if(callback)
				callback();
			thisCar.onSlideBefore(slide, index, index+1);
		}
		
		if(slide.hasClass("slide-away")) {
			slide.slideUp("slow", function() { 
				onComplete();
				$(this).css({
					opacity: 0,
					display : "block"
					});
				});
		}
		else {
			slide.animate({ opacity : 0 }, slideObj.fadeOut, onComplete);
		}
	}	
	
	//Test slide key
	Carousel.prototype._testSlideKey = function(slideKey) {
		return typeof slideKey == "string" ? this._keySlides[slideKey] : slideKey;
	}
	
	gallery.carousel = Carousel;
}())