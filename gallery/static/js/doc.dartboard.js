var doc = doc || {};
doc.Dartboard = null;

(function(doc) {
  var Dartboard = function(sketch, numZones, mult){
      this.sketch = sketch;
      this.zones = [];
      var offset = 0;
      for(var i = 0; i < numZones; i++) {
        offset += sketch.random(1);
        this.zones[i] = offset;
        // Print out the values all in one line
      }
      this.max = offset*mult || offset;
      console.log("MAX: " + this.max);
  }
    
  // Fire at the dartboard
  Dartboard.prototype.fire = function() {
    var dart = this.sketch.random(0, this.max); 
    for (var i  = 0; i < this.zones.length; i++) {
      if ( dart <= this.zones[i]) {
        return i;
      }
    }
    return -1;
  }

  doc.Dartboard = Dartboard;
})(doc);