var ww, wh;
updateWH();

function updateWH() {
  ww = $(window).width();
  wh = $(window).height();
}

$(window).resize(funcition(){
  updateWH();
});

p5(node, function( s ) {

  s.setup = function() {
    sketch.createCanvas(ww, wh);
    sketch.background(0);
  };

  s.draw = function() {
    sketch.rect(sketch.width/2, sketch.height/2, 200, 200);
  }

  s.mousePressed = function() {
    gray += 10;
  }

});