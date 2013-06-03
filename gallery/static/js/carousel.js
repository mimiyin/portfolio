var gallery = gallery || {};
gallery.carousel = null;

(function(){
	var Carousel = function(element, options) {
		var defaults = {
				normal : { fadeIn : 5000, fadeOut : 1000 },
				title : { fadeIn : 1000, fadeOut : 5000, delay : 7500 },
				isAuto : false,
		}
		
		// exend opions
		this._options = $.extend( {}, defaults, options );
		this._el = element;
		
		// Seeding slide nav events
		this.onSlideAfter = this._options.onSlideAfter || function() {};
		this.onSlideBefore = this._options.onSlideBefore || function() {};
		
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
	Carousel.prototype.play = function(slideKey, isPreview) {
		// Interrupt all previous animations
		this._slides.stop(true, true);
		var thisCar = this;
		var index = this._testSlideKey(slideKey) || 0;
		var cycle = function(index) {
			// Loop if in preview mode
			if(isPreview)
				prevSlide = index > 0 ? index-1 : thisCar._slides.length-1;
			else
				prevSlide = index-1;
			thisCar.goFromSlide(prevSlide);
			thisCar.goToSlide(index, function(){
				// If you've reached the end of the slide, stop cycling
				// Unles you're in preview mode
				if(index >= thisCar._slideObjs.length-1) {
					if(isPreview)
						index = -1;
					else {
						return;
					}
				}
				setTimeout(function(){ cycle(index+1) }, isPreview ? Math.random()*5000 : 0);					
			});
		}
		cycle(index);
	}
	
	// Stop all animation.
	// Optional slideKey to stop on
	Carousel.prototype.stop = function(slideKey) {
		var thisCar = this;
		var index = this._testSlideKey(slideKey) || 0;
		$.each(this._slideObjs, function(s, slideObj) {
			slideObj.slide.stop(true, true);			
			thisCar.goToSlide(index);
		});
	}
	
	// Go to a particular slide
	Carousel.prototype.goToSlide = function(slideKey, callback) {
		var thisCar = this;
		var index = this._testSlideKey(slideKey);
		var slideObj = this._slideObjs[slideKey];
		var slide = slideObj.slide;
		slide.animate({opacity : 1 }, slideObj.fadeIn, function(){	
			setTimeout(function() {
				if(callback)
					callback();
			}, slideObj.delay);
			
			thisCar.onSlideAfter(slide, index, index-1);			
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
		slide.animate({ opacity : 0 }, slideObj.fadeOut, function(){
			if(callback)
				callback();
			thisCar.onSlideBefore(slide, index, index+1);
		});
	}	
	
	//Test slide key
	Carousel.prototype._testSlideKey = function(slideKey) {
		return typeof slideKey == "string" ? this._keySlides[slideKey] : slideKey;
	}
	
	gallery.carousel = Carousel;
}())