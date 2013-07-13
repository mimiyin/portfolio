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
			top :  "+=" + topShift * topShiftMult + "%",
		}, speed || 0);
		
		//Start animating in at 80% completion
		setTimeout(function() { if(callback) callback(); }, speed*.8);
	}
		
})( jQuery );