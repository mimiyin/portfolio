$.widget('doc.nav', {
	options : {
		selected : null,
	},
	_create : function() {
		var $this = this;
		this.element.addClass("doc_nav");
	},
	_init : function() {
		var $this = this;
		this.navitems = [];
		var navitem = this.element.find("li.navitem").navitem({
			selected : function(event, ui) {
				console.log($(event.target).attr('code'));
				// // deselect all nav items
				// $this.navitems('deselect');
				// // tell control what's been selected
				$this._trigger('selected');
			}
		});
	}
});

$.widget('doc.navitem', {
	options : {
		selected : null,
	},
	_create : function() {
		var $this = this;
		this.element.addClass("doc_navitem");
		this._on({
			"click" : $this._select,
			"mouseenter" : $this.enter,
			"mouseleave" : $this.leave,
		});
	},
	_init : function() {
		this.carousel = this.element.find(".carousel").bxSlider({
			auto: false,
			speed: 500,
		});
	},
	_select : function() {
		this._trigger('selected');
		this.element.toggleClass("doc_selected", true, "slow");
	},
	deselect : function() {
		this.element.toggleClass("doc_selected", false, "fast");
	},
	enter : function() {
		this.carousel.show();
		this.carousel.startAuto();
	},
	leave : function() {
		this.carousel.hide();
		this.carousel.stopAuto();

	}
});