(function( $ ) {
	$.fn.scrollBottom = function() { 
		  return this.height() - $(window).scrollTop() - $(window).height(); 
		};
	$.fn.scrollRight = function() { 
		  return this.width() - $(window).scrollLeft() - $(window).width(); 
		};

	$.fn.shift = function(leftShift, topShift, speed, callback) {
		this.animate({
			top : "+=" + topShift * $(window).height(),
			left : "+=" + leftShift*100 + "%",
		}, speed);
		
		// Start animating in at 80% completion
		setTimeout(callback, speed*.8);
	}
		
})( jQuery );