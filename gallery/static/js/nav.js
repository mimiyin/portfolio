var gallery = gallery || {};
gallery.nav = null;

(function (){
	var nav = {
		init : function(el) {
			this._element = el;
			this._selector = this._element.find('#selector');

			// Click listener for random
			this._element.find('#random').click(function(){
				$(this).trigger("random");
			});

			// Click listener for project nav
			this._element.find('.nav-project').click(function(e){
				e.stopPropagation();
				$(nav).trigger("move", $(this).attr("code") );
			})

			// Listen for navigation clicks in control
			$(gallery.control).on('move', function(event, offset){
				nav.shift(offset.left, offset.top);
			});

			return this;
		},

		shift : function(leftShift, topShift) {						
			// Shift the selector
			this._selector.shift(-leftShift, -topShift, 20, 33.33, '%', 2500);			
		},

		// Show nav for 5 seconds after moving mouse
		_show : function(isAutoHide) {
			clearTimeout(this._hideTimeout);						
			this._element.stop(true, true).slideDown("slow", function(){
				if(isAutoHide) {
					nav._hide();
				}
			});
		},
		
		// Hide nav
		_hide : function(isZoomingOut) {
			clearTimeout(this._showTimeout);
			this._hideTimeout = setTimeout(function() {
				nav._element.slideUp("slow", function(){
					$(this).css("display", "none");
				});
			}, 5000);
		},		
	}

	gallery.nav = nav;

}());