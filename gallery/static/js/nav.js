var gallery = gallery || {};
gallery.nav = null;

(function (){
	var nav = {
		init : function(el) {
			this._element = el;
			this._selector = this._element.find('#selector');

			// Show/hide nav with mouseenter/mouseleave
			this._element.parent().mouseenter(function(){
				if(!control.isZoomedOut)
					nav._show();
			});
			
			this._element.parent().mouseleave(function(){
				if(!control.isZoomedOut)
					nav._hide();
			});	

			// Click listeners for projects
			this._element.find('.nav-project').click(function(){
				$(nav).emit('click', $(this).attr('code'));
			});

			// Click listener for random
			this._element.find('#random').click(function(){
				$(nav).emit('click', control.getRandomProject());
			});

			// Click listener for zoom-out
			this._element.find('#zoom-out').click(function(){
				$(nav).emit('zoomOut');
			});
		},

		shift : function(leftShift, topShift) {						
			// Shift the selector
			this._selector.shift(-leftShift, -topShift, 19, 25, 3000);			
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
			}, isZoomingOut ? 0 : 5000);
		},		
	}

	gallery.nav = nav;

}());