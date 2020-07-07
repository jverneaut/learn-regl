const canvas = document.querySelector('#clear');

if (canvas) {
  const regl = require('regl')('#clear');

  regl.frame(({ tick }) => {
    regl.clear({
      color: [
        Math.sin(tick * 0.01),
        Math.sin(tick * 0.01 + (2 * Math.PI) / 3),
        Math.sin(tick * 0.01 + (4 * Math.PI) / 3),
        1,
      ],
    });
  });
}
