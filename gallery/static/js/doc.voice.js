var doc = doc || {};
doc.Voice = null;

(function(doc) {

    var Voice = function(sketch) {

      this.sketch = sketch;

      //Which Curve?
      // Create weighted probabilities for num of voices to add and picking wave types
      this.w = new doc.Dartboard(sketch, 5).fire();

      switch(this.w) {
      default:
        this.wave = new doc.Sine(sketch); 
        break;
      case 1:
        this.wave = new doc.Cosine(sketch); 
        break;
      case 2:
        this.wave = new doc.Tan(sketch); 
        break;
      case 3:
        this.wave = new doc.Square(sketch); 
        break;
      case 4:
        this.wave = new doc.Sawtooth(sketch);
        break;
      }      


      //////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////
      //////////////////////PLAY WITH THESE NUMBERS/////////////////////
      //////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////
      // Assign random frequencies and amplitudes
      var freq = this.sketch.random(0.01, 0.1);
      var amp = this.sketch.random(0, 5000);
      this.wave.init(0, freq, amp, amp);

      //Set lifespan of voice
      this.lifespan = parseInt(this.sketch.random(600, 6000));
      this.age= 0;
      this.beat = 1;

      //console.log("LIFESPAN: " + this.lifespan + "\tWAVE TYPE: ", this.wave, "\tFREQ: " + freq + "\tAMP: " + amp);

    }

    Voice.prototype.run = function() {
      this.age++;   // Keep track of how long the voice has been going for
      // Play the beat
      if ( this.age%this.beat < 1) {
        this.beat = this.sketch.constrain(this.wave.run(), 10, this.wave.run());
        return true;
      }
      return false;
    }

    // Check for dead
    Voice.prototype.isDead = function() {
      return this.age > this.lifespan;
    }

    doc.Voice = Voice;
  
})(doc)
