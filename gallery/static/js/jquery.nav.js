$.widget('doc.nav', {
	options : {
		selected : null,
	},
	_create : function() {
		var $this = this;
		// Fade it back in on mousemove
		$("body").mousemove(function(){
			console.log("MOVIN THE MOUSE");
			$this.element.stop(true, false).fadeTo(1000, 1, function(){
				setTimeout(function(){
					$this.element.fadeTo(2500, 0)
				}, 5000)
			});
		});
	},
	_init : function() {
		var $this = this;
		this.navitems = [];
		var navitem = this.element.find("li.navitem").navitem({
			selected : function(event, ui) {
				// // deselect all nav items
				// $this.navitems('deselect');
				// // tell control what's been selected
				$this._trigger('selected', null, $(event.target).attr("code"));
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