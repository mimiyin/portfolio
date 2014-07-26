var doc = doc || {};
doc.Pitch = null;

(function(doc) {
  var Pitch = function(sketch, audio){
      this.sketch = sketch;
      this.audios = [];
      for(var a = 0; a < 50; a++) {
        this.audios.push(audio.cloneNode(true));
      }
      this.bm = 0;
  }
    
  // Fire at the dartboard
  Pitch.prototype.play = function() {
    for(var a = this.bm; a < this.audios.length; a++) {
        var audio = this.audios[a];
        if(audio.paused) {
          audio.play();
          this.bm = (a+1)%this.audios.length;
          break;
        }
    }
  }

  doc.Pitch = Pitch;
})(doc)