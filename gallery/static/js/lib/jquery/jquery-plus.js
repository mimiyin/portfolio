(function( $ ) {
	$.fn.scrollBottom = function() { 
		  return $(document).height() - $(window).scrollTop() - $(window).height(); 
		};
	$.fn.scrollRight = function() { 
		  return $(document).width() - $(window).scrollLeft() - $(window).width(); 
		};
})( jQuery );