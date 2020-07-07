const canvas = document.querySelector('#box');
const mat4 = require('gl-mat4');

if (canvas) {
  const regl = require('regl')('#box');
  const image = document.querySelector('img');
  image.onload = () => {
    const texture = regl.texture(image);

    // prettier-ignore
    const cubePosition = [
      [-1.0, +1.0, +1.0], [+1.0, +1.0, +1.0], [+1.0, -1.0, +1.0], [-1.0, -1.0, +1.0], // positive z face.
      [+1.0, +1.0, +1.0], [+1.0, +1.0, -1.0], [+1.0, -1.0, -1.0], [+1.0, -1.0, +1.0], // positive x face
      [+1.0, +1.0, -1.0], [-1.0, +1.0, -1.0], [-1.0, -1.0, -1.0], [+1.0, -1.0, -1.0], // negative z face
      [-1.0, +1.0, -1.0], [-1.0, +1.0, +1.0], [-1.0, -1.0, +1.0], [-1.0, -1.0, -1.0], // negative x face.
      [-1.0, +1.0, -1.0], [+1.0, +1.0, -1.0], [+1.0, +1.0, +1.0], [-1.0, +1.0, +1.0], // top face
      [-1.0, -1.0, -1.0], [+1.0, -1.0, -1.0], [+1.0, -1.0, +1.0], [-1.0, -1.0, +1.0]  // bottom face
    ];

    // prettier-ignore
    const cubeUv = [
      [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // positive z face.
      [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // positive x face.
      [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // negative z face.
      [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // negative x face.
      [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // top face
      [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]  // bottom face
    ];

    // prettier-ignore
    const cubeElements = [
      [2, 1, 0], [2, 0, 3], // positive z face.
      [6, 5, 4], [6, 4, 7], // positive x face.
      [10, 9, 8], [10, 8, 11], // negative z face.
      [14, 13, 12], [14, 12, 15], // negative x face.
      [18, 17, 16], [18, 16, 19], // top face.
      [20, 21, 22], [23, 20, 22] // bottom face
    ];

    const drawCube = regl({
      vert: `
      precision mediump float;
      attribute vec3 a_position;
      attribute vec2 a_uv;
      varying vec2 v_uv;
      uniform mat4 u_projection, u_view;

      void main() {
        v_uv = a_uv;
        gl_Position = u_projection * u_view * vec4(a_position, 1.0);
      }
    `,
      frag: `
      precision mediump float;
      uniform sampler2D u_texture;
      varying vec2 v_uv;

      void main() {
        gl_FragColor = texture2D(u_texture, v_uv);
      }
    `,
      attributes: {
        a_position: cubePosition,
        a_uv: cubeUv,
      },
      elements: cubeElements,
      uniforms: {
        u_texture: (context, props) => props.texture,
        u_view: ({ tick }) => {
          const time = 0.01 * tick;

          return mat4.lookAt(
            [], // out
            [5 * Math.cos(time), 2.5 * Math.sin(time), 5 * Math.sin(time)], // viewer position
            [0, 0.0, 0], // point the viewer is looking at
            [0, 1, 0] // up
          );
        },
        u_projection: ({ viewportWidth, viewportHeight }) =>
          mat4.perspective(
            [], // out
            Math.PI / 4, //field of view in radians
            viewportWidth / viewportHeight, // aspect ratio
            0.01, // near bound
            10 // far bound
          ),
      },
    });

    regl.frame(() => {
      regl.clear({
        color: [0, 0, 0, 1],
        depth: 1,
      });
      drawCube({
        texture,
      });
    });
  };
}
