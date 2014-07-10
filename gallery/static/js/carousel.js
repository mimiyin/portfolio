var gallery = gallery || {};
gallery.carousel = null;

(function(){
	var Carousel = function(element, options) {
		var defaults = {
				normal : { fadeIn : 1000, fadeOut : 500 },
				still : { fadeIn : 1000, fadeOut : 500, delay: 10000 },
				title : { fadeIn : 1000, fadeOut : 5000, delay : 7500 },
				isAuto : false,
		}
		
		// Extend options
		this._options = $.extend( {}, defaults, options );
		this._el = element;
		this._id = $(element).parent().attr("id");
		
		// Seeding slide nav events
		this.onSlideStop = this._options.onSlideStop || null;
		this.onSlideAfter = this._options.onSlideAfter || null;;
		this.onSlideBefore = this._options.onSlideBefore || null;
		
		// Store duration for slides with each slide
		this._slides = element.children();
		this._slideObjs = [];
		var self = this;
		$.each(this._slides, function(s, slide){
			var slide = $(slide);			
			var type = slide.attr('type') in self._options ? slide.attr('type') : 'normal';
			var slideObj = { 
					"slide" : slide, 
					"fadeIn" : self._options[type].fadeIn ||  self._options["normal"].fadeIn, 
					"fadeOut" : self._options[type].fadeOut || self._options["normal"].fadeOut,
					"delay" : self._options[type].delay || 0,
					}
			self._slideObjs.push(slideObj);
		});
		
		// Create look-up table for key slides
		this._keySlides = { 
				'title' : self._el.find('.title-slide').index(), 
				'still' : self._el.find('.still-slide').index(), 
				'video' : self._el.find('.video-slide').index(),
				};	
				
		// Start off carousel with title slide
		this._lastSlideIndex = this._slides.length-1;
		this._currentSlideIndex = this._lastSlideIndex;
		this._nextSlideIndex = 0;	
	}

	// Cycle through all the slides
	Carousel.prototype._cycle = function() {
		if(this._isPaused) {
			console.log("PAUSE!!!");
			return;
		}
		
		var self = this;
		var isPreview = gallery.control.isZoomedOut == true ? true : false;
			
		var isLastSlide = function() { 
			return self._nextSlideIndex == self._lastSlideIndex;
		}

		// Leave the current slide if it is not
		// also the slide we're trying to go to
		if(this._currentSlideIndex != this._nextSlideIndex)
			this.goFromSlide(this._currentSlideIndex, isPreview);

		// Go to next slide
		this.goToSlide(this._nextSlideIndex, isPreview, isLastSlide(), function(){
			// If we're in Preview mode or the Carousel is paused, stop cycling
			// I need to listen for isPaused because this callback may not
			// get called for a while, during which time everything has changed
			if(isPreview || self._isPaused)
				return;
			// If you've reached the end of the slide, stop cycling
			if(isLastSlide())
				return;
			self._nextSlideIndex++;
			self._cycle();				
			});				
		
	}
	
	// Start up the carousel
	Carousel.prototype.start = function(slideKey, isRestarting) {
		this._nextSlideIndex = this._testSlideKey(slideKey) || 0;		
		this._isPaused = false;
		this._cycle();
		
		var self = this;
		// Show nav after 2.5 seconds
		if(!isRestarting) {
			setTimeout(function(){
				self._showNav(true);
			}, 2500);
		}
	}
		
	// Stop cycling animations.
	// Clear all impending timed cycling
	Carousel.prototype.stop = function() {
		this._isPaused = true;
		var self = this;
		$.each(this._slideObjs, function(s, slideObj) {
			var slide = slideObj.slide;
			// Do not complete animations
			slide.stop(true, true);
			self.onSlideStop(slide);
		});
				
		// Get rid of any upcoming preview timeouts
		clearTimeout(this._nextTimeOut);
		delete this._nextTimeOut;
	}
	
	// Go to a particular slide
	// If it's a movie, wait for it to finish
	Carousel.prototype.goToSlide = function(slideKey, isPreview, isLastSlide, callback) {
		//console.log("GOING TO SLIDE: " + slideKey);
		
		var self = this;
		var index = this._testSlideKey(slideKey);
		var slideObj = this._slideObjs[slideKey];
		var slide = slideObj.slide;
		var transitionTime;
		
		slide.animate({ opacity : 1 }, slideObj.fadeIn);
		transitionTime = slideObj.fadeIn;
			
		// Kick off media right away
		self.onSlideAfter(slide, index, index-1, function(){
			// Callback to move onto next slide fades in and 
			// has been held in place (if there is a delay specified)
			// If the player is paused, this callback gets nuked
			self._nextTimeOut = setTimeout(function() {
				if(callback)
					callback();
			}, transitionTime + ( slideObj.delay || 0) );	
		});
		
		//Update current slide
		this._currentSlideIndex = index;
		
		// Don't wait for callbacks to move onto next slide in Preview mode
		if(isPreview) {
			var delayFactor = slide.hasClass("featured") ? 10000 : 0;
			this._nextTimeOut = setTimeout(function(){ 
				self._nextSlideIndex = isLastSlide? 0 : self._nextSlideIndex + 1;
				self._cycle();
				}, Math.random()*20000 + delayFactor);	
		}
	}
	
	// Leave a particular slide
	Carousel.prototype.goFromSlide = function(slideKey, isPreview, callback) {
		if(slideKey < 0)
			return;
		var self = this;
		var index = this._testSlideKey(slideKey);
		var slideObj = this._slideObjs[slideKey];
		var slide = slideObj.slide;
		var onComplete = function(){
			if(callback)
				callback();
			self.onSlideBefore(slide, index, index+1);
		}
		
		slide.animate({ opacity : 0 }, slideObj.fadeOut, onComplete);
		
	}	
	
	//Test slide key
	Carousel.prototype._testSlideKey = function(slideKey) {
		return typeof slideKey == "string" ? this._keySlides[slideKey] : slideKey;
	}
	
	gallery.carousel = Carousel;
}())