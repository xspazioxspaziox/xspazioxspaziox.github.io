osc(4,.02,0).rotate(.2,.3).scale(8,.2).modulateScrollX(noise(.2,.02)).modulateScrollY(noise(.4,.02))
.modulate(noise(200,.02)).repeat(10,4).rotate(.2,.02).scrollY(()=>mouse.x/3000).diff(gradient(.02))
.modulate(src(o0)).diff(shape(4,.8)).repeat(2,3).rotate(.02,.04).modulate(src(o0))
.out(o0)
