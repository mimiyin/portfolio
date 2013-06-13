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
		this._id = $(element).parent().attr("id");
		
		// Seeding slide nav events
		this.onSlideStop = this._options.onSlideStop || null;
		this.onSlideAfter = this._options.onSlideAfter || null;;
		this.onSlideBefore = this._options.onSlideBefore || null;
		
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
		this._lastSlideIndex = this._slides.length-1;
		this._currentSlideIndex = this._lastSlideIndex;
		this._nextSlideIndex = 0;	
		
		// Build the nav
		this._buildNav();
		
		// Listen to mousemoves to show nav
		this._nav.parent().mouseenter(function(){
				thisCar._showNav();
		});
		this._nav.parent().mouseleave(function(){
				thisCar._hideNav();
		});

	}
	
	// Show nav for 5 seconds after moving mouse
	Carousel.prototype._showNav = function(isAutoHide) {
		if(gallery.control.isZoomedOut)
			return;
		this._nav.stop(true, true);
		var thisCar = this;
		this._nav.slideDown("slow", function(){
			$(this).css("display", "block");
			if(isAutoHide)
				thisCar._hideNav();
		})
	}
	
	// Hide nav
	Carousel.prototype._hideNav = function() {
		this._nav.delay(5000).slideUp("slow", function(){
			$(this).css("display", "none");
		});
	}
	
	Carousel.prototype._buildNav = function() {
		var thisCar = this;
		this._nav = $("<ul>").addClass("carousel-nav").appendTo($("<div>").addClass("nav-wrapper").appendTo(thisCar._el));
		$.each(this._slides, function(s, slide){
			var label = $(slide).attr("alt");
			thisCar._nav.append($("<li>").addClass("carousel-nav-item").text(label).click(function(){
				console.log("CLICKING ON: " + $(this).text());
				thisCar.stop();
				thisCar.start($(this).index());
			}));
		});
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
	Carousel.prototype._cycle = function() {
		if(this._isPaused)
			return;
		
		// Leave the current slide if it is not
		// also the slide we're trying to go to
		if(this._currentSlideIndex != this._nextSlideIndex)
			this.goFromSlide(this._currentSlideIndex);

		var thisCar = this;
		var isPreview = gallery.control.isZoomedOut == true ? true : false;
		var isLastSlide = function() { 
			return thisCar._nextSlideIndex == thisCar._lastSlideIndex;
		}

		// Go to next slide
		this.goToSlide(this._nextSlideIndex, isPreview, isLastSlide(), function(){
			// If we're in Preview mode or the Carousel is paused, stop cycling
			// I need to listen for isPaused because this callback may not
			// get called for a while, during which time everything has changed
			if(isPreview || thisCar._isPaused)
				return;
			// If you've reached the end of the slide, stop cycling
			if(isLastSlide())
				return;
			thisCar._nextSlideIndex++;
			thisCar._cycle();
				
			});				
		
	}
	
	// Start up the carousel
	Carousel.prototype.start = function(slideKey) {
		this._isPaused = false;
		this._nextSlideIndex = this._testSlideKey(slideKey) || 0;		
		this._cycle();
		
		var thisCar = this;
		// Show nav after 2.5 seconds
		setTimeout(function(){
			thisCar._showNav(true);
		}, 2500);
	}
		
	// Stop cycling animations.
	// Clear all impending timed cycling
	Carousel.prototype.stop = function() {
		this._isPaused = true;
		var thisCar = this;
		$.each(this._slideObjs, function(s, slideObj) {
			var slide = slideObj.slide;
			// Do not complete animations
			slide.stop(true, true);
			thisCar.onSlideStop(slide);
		});
				
		// Get rid of any upcoming preview timeouts
		clearTimeout(this._nextTimeOut);
		delete this._nextTimeOut;
	}
	
	// Go to a particular slide
	// If it's a movie, wait for it to finish
	Carousel.prototype.goToSlide = function(slideKey, isPreview, isLastSlide, callback) {
		var thisCar = this;
		var index = this._testSlideKey(slideKey);
		var slideObj = this._slideObjs[slideKey];
		var slide = slideObj.slide;
		var transitionTime;
		
		if(slide.hasClass("slide-in")) {
			slide.css("opacity" , 1).slideUp("medium", function(){
				$(this).css("display", "block");
			});
			transitionTime = 200;
		}
		else {
			slide.animate({ opacity : 1 }, slideObj.fadeIn);
			transitionTime = slideObj.fadeIn;
		}
			
		// Kick off media right away
		thisCar.onSlideAfter(slide, index, index-1, function(){
			// Callback to move onto next slide fades in and 
			// has been held in place (if there is a delay specified)
			// If the player is paused, this callback gets nuked
			setTimeout(function() {
				if(callback)
					callback();
			}, transitionTime + ( slideObj.delay || 0) );	
		});
		
		//Update current slide
		this._currentSlideIndex = index;
		
		// Don't wait for callbacks to move onto next slide in Preview mode
		if(isPreview) {
			var delayFactor = slide.hasClass("featured") ? 5000 : 1000;
			this._nextTimeOut = setTimeout(function(){ 
				thisCar._nextSlideIndex = isLastSlide? 0 : thisCar._nextSlideIndex + 1;
				thisCar._cycle();
				}, Math.random()*10000 + delayFactor);	
		}
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