  osc(10, 0.08, 1)
      .modulateScale(osc(6).rotate(Math.sin(time)), .5)
      .thresh(.4)
.colorama(50)
.modulateScale(o0)
      .diff(src(o0).scale(3))
      .modulateScale(osc(1).modulateRotate(o0, .7))
      .diff(src(o0).rotate([-.02, .01, -.002, 0]).scrollY(0, [-0.006, 0].fast(0.7)))
      .out(o0);
