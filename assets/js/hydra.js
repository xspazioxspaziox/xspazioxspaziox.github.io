
osc(20, 0.1, 0).color(0, 2, 0).rotate(1).out(o1)

noise(30, 0.01, 0).color(1, 2, 5).modulate(o2).add(o1).modulateScale(o2,1,10).scrollY(.7,.02,.1).out(o0)

noise(30, 0.5, 0).color(2, 6, 4).modulate(o2).add(o0,1).modulateScale(o0,1,10).scrollX(.3,.02,.1).pixelate(3,80).scale(.15,3).out(o2)
