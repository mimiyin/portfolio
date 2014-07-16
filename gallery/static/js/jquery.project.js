$.widget('doc.project', {
	options : {
		code : null,
		medium : null,
		order : null
	},
	_create : function() {
		var $this = this;
		this.loaded = false;
	},
	_init : function() {
		this._load();
	},
	_load : function() {
		var $this = this;

		// Load sketches
		this.sketches = this.element.find("[type=sketch]").sketch();

		// Load the vimeos
		this.vimeos = this.element.find("[type=vimeo]").vimeo();

		// Load embedded websites
		this.wwws = this.element.find("[type=www]");

		// Load embedded flickr slideshows
		this.flickrs = this.element.find("[type=flickr]");

		// Slides
		this.players = [];
		$.each(this.element.find("li"), function(s, slide){
			var type = $(slide).attr("type");
			if(type == "vimeo" || type == "sketch") {
				$this.players.push($(slide)[type]().data("doc-" + type));
			}
		});
		this.loaded = true;
	},
	_stop : function() {
		$.each(this.players, function(p, player){
			player.leave();
		});
	},

	select : function() {
		if(!this.loaded) {
			this._load();
		}
		this.element.trigger("focus");
		var $this = this;
		this.element.trigger("selected");
	},
	deselect : function() {
		this._stop();
	}
});