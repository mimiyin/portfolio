var doc = doc || {};

(function(doc){
  var Wave = function(sketch) {
    }

  Wave.prototype.init = function(t,f,a,o) {
      this.t = t;
      this.f = f;
      this.a = a;
      this.o = o;
    }

  Wave.prototype.run = function() {
      this.update();
      return this.wave();
    }
    
  Wave.prototype.setT = function(t) {
     this.t = t; 
    }

  Wave.prototype.update = function() {
      this.t += this.f;
    }

  doc.Wave = Wave;

  var Sine = function(sketch) {
    Wave.call(this, sketch);
    }

  Sine.prototype = new Wave();

  Sine.prototype.wave = function() {
      return Math.sin(this.t)*this.a + this.o;    
    }

  doc.Sine = Sine;

  var Cosine = function(sketch) {
    Wave.call(this,sketch);
    }

  Cosine.prototype = new Wave();

  Cosine.prototype.wave = function() {
      return Math.cos(this.t)*this.a + this.o;
    } 

  doc.Cosine = Cosine;

  var Tan = function(sketch) {
    Wave.call(this, sketch);
  }

  Tan.prototype = new Wave();

  Tan.prototype.wave = function() {
      return Math.abs(Math.tan(this.t)*this.a);
  }

  doc.Tan = Tan;

  var Square = function(sketch) {
    Wave.call(this, sketch);
  }
  Square.prototype = new Wave();

  Square.prototype.wave = function() {
      return this.o + (this.t%Math.TWO_PI >= Math.PI ? 1 : -1)*this.a;
  }

  doc.Square = Square;

  var Sawtooth = function(sketch) {
    Wave.call(this, sketch);
  }

  Sawtooth.prototype = new Wave();

  Sawtooth.prototype.wave = function() {
      var m = (this.a+this.o) / Math.TWO_PI;
      return (this.t%Math.TWO_PI)*m;
    }
    
  doc.Sawtooth = Sawtooth;

})(doc);