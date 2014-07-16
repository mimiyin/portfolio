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
		this._on({
			"click" : $this._select,
		});
	},
	_select : function() {
		this._trigger('selected');
		this.element.toggleClass("doc_selected", true, "slow");
	},
	deselect : function() {
		this.element.toggleClass("doc_selected", false, "fast");
	},
});