const canvas = document.querySelector('#draw');

if (canvas) {
  const regl = require('regl')('#draw');

  const drawTriangle = regl({
    vert: `
    attribute vec2 a_position;
    attribute vec3 a_color;

    varying vec3 v_color;

    void main() {
      v_color = a_color;
      gl_Position = vec4(a_position, 0, 1);
    }
  `,
    frag: `
    precision mediump float;
    varying vec3 v_color;

    void main() {
      gl_FragColor = vec4(v_color, 1.0);
    }
  `,
    attributes: {
      a_position: [
        [0, -1],
        [-1, 0],
        [1, 1],
      ],
      a_color: [
        [1, 0, 1],
        [0, 1, 1],
        [1, 1, 0],
      ],
    },
    count: 3,
  });

  regl.clear({ color: [0, 0, 0, 1] });
  drawTriangle();
}
