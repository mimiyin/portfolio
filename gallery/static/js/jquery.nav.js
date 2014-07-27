$.widget('doc.nav', {
	options : {
		selected : null,
	},
	_create : function() {
		var $this = this;

		// Fade it back in on mouseeneter
		this.element.mouseenter(function(){
			$this.element.stop(true, false).fadeTo(1000, 1, function(){
				});
		});

		// Fade out when you leave the area
		this.element.mouseleave(function(){
			$this.element.stop(true, false).fadeTo(2500, 0);
		})
	},
	_init : function() {
		var $this = this;
		this.scroll = this.element.find("#scroll");

		this.navitems = this.element.find("li.navitem").navitem({
			selected : function(event, ui) {
				// Only show scroll hand if project has mult slides
				var code = $(event.target).attr("code");
				if($(".project[code=" + code + "]").children("li").length > 1) {
					$this.scroll.stop(true,false).fadeIn("slow");
				}
				else {
					$this.scroll.stop(true,false).fadeOut("fast");
				}

				// deselect all nav items
			    $this.navitems.navitem('deselect');

				// tell control what's been selected
				$this._trigger('selected', null, $(event.target).attr("code"));
			}
		});
	},
	select : function(id) {
		this.element.find("li[code=" + id + "]").click();
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