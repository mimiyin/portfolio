$.widget('doc.project', {
	options : {
		code : null,
		medium : null,
		order : null
	},
	_create : function() {
		var $this = this;
		this._load();
	},
	_load : function() {
		var $this = this;

		// Slides
		this.players = [];
		$.each(this.element.find("li"), function(s, slide){
			var type = $(slide).attr("type");
			if(type == "vimeo" || type == "sketch") {
				$this.players.push($(slide)[type]().data("doc-" + type));
			}
		});
	},
	_stop : function() {
		$.each(this.players, function(p, player){
			player.leave();
		});
	},
	select : function() {
		this.element.click();
		window.location.hash = this.options.code;
	},
	deselect : function() {
		console.log("DESELECTING", this.options.code);
		this._stop();
	}
});