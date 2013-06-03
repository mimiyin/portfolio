(function( $ ) {
	$.fn.scrollBottom = function() { 
		  return this.height() - $(window).scrollTop() - $(window).height(); 
		};
	$.fn.scrollRight = function() { 
		  return this.width() - $(window).scrollLeft() - $(window).width(); 
		};

	$.fn.shift = function(leftShift, topShift, leftShiftMult, topShiftMult, speed, callback) {
		this.animate({
			left : "+=" + leftShift * leftShiftMult + "%",
			top : "+=" + topShift * topShiftMult,
		}, speed);
		
		// Start animating in at 80% completion
		setTimeout(callback, speed*.8);
	}
		
})( jQuery );