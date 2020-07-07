const canvas = document.querySelector('#texture');

if (canvas) {
  const regl = require('regl')('#texture');

  const img = document.querySelector('img');
  img.onload = () => {
    const texture = regl.texture(img);

    const draw = regl({
      vert: `
      attribute vec2 a_position;
      varying vec2 v_uv;

      void main() {
        v_uv = 0.5 + 0.5 * a_position;
        gl_Position = vec4(a_position, 0, 1);
      }
    `,
      frag: `
      precision mediump float;
      varying vec2 v_uv;
      uniform sampler2D u_texture;

      void main() {
        gl_FragColor = texture2D(u_texture, v_uv);
      }
    `,
      uniforms: {
        u_texture: texture,
      },
      attributes: {
        a_position: ({ tick }) => [
          [Math.sin(tick * 0.01), -Math.sin(tick * 0.0012)],
          [-1, Math.sin(tick * 0.005)],
          [Math.sin(tick * 0.006), 1],
        ],
      },
      count: 3,
    });

    regl.frame(() => {
      regl.clear({ color: [0, 0, 0, 1] });
      draw();
    });
  };
}
