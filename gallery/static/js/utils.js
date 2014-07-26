var gallery = gallery || {};
gallery.utils = null;

(function(){
	var utils = {
		getRandom : function(dict) {
			var index = 0;
			var random;
			$.each(dict, function(key, value){
				index++;
				if(Math.random() < 1/index)
					random = value;
			});
			return random;
		},
		constrain : function(value, min, max) {
			if(value <= min) return min;
			if(value >= max) return max;
			return value;
		}	
	}
	gallery.utils = utils;
	
}());