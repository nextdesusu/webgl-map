import { mat4, vec3 } from "gl-matrix";
import { loadImage } from "../helpers/image";
import { ensureGLOk } from "../webgl/error";
import { SimpleProgram } from "../webgl/program";
import { Renderer } from "../webgl/renderer";
import { Texture } from "../webgl/texture";
import { TextureManager } from "../webgl/texture/manager";
import { IRenderContext } from "../webgl/types";
import { Shader } from "../webgl/shader/shader";
import { WebglContextOwner } from "../webgl/context/owner";
import { StaticBuffer } from "../webgl/buffer/static";
import { Vector3 } from "../math/vector3";
import { Matrix4 } from "../math/matrix4";

export class MapDisplay {
  private constructor(private readonly renderer: Renderer) { }

  // RAII 😎😎😎
  static async capture(canvas: HTMLCanvasElement) {
    const map = new MapDisplay(new Renderer(canvas));
    await map.init();

    return map;
  }

  private async init() {
    // await this.renderer.init();
  }

  async test() {
    const renderer = this.renderer;
    const gl = renderer.gl;
    const ctx = new WebglContextOwner({
      gl,
    });

    const textures = await Promise.all(textureSources.map(async (src) => {
      const img = await loadImage(src);
      return new Texture(img);
    }));

    textures.forEach((tex) => tex.init(ctx));

    const drawInfos = textures.map((tex) => {
      const position = new Vector3(0, 0, 0);
      const scale = new Vector3(1, 1, 1);
      return {
        texture: tex,
        position,
        scale,
      }
    });

    const positionBuffer = StaticBuffer.f32([
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ]);
    positionBuffer.init(ctx);

    const textcoordBuffer = StaticBuffer.f32([
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ]);
    textcoordBuffer.init(ctx);

    const program = new SimpleProgram({
      vertex: Shader.vertex(`
        uniform mat4 u_matrix;
        uniform mat4 u_textureMatrix;

        in vec2 a_position;

        out vec2 v_texcoord;

        void main() {
          gl_Position = u_matrix * a_position;
          v_texcoord = (u_textureMatrix * vec4(a_texcoord, 0, 1)).xy;
        }
      `),
      fragment: Shader.fragment(`
        precision mediump float;
        uniform u_texture;
        in vec4 v_texcoord;

        void main() {
          gl_FragColor = texture2D(u_texture, v_texcoord);
        }
      `),
    });

    program.init(ctx);

    let then = 0;
    function render(time: number) {
      ensureGLOk(gl);

      requestAnimationFrame(render);

      const now = time * 0.001;
      const delta = Math.min(0.1, now - then);
      then = now;

      update(delta);
      draw();
      // renderer.render();
    }

    function draw() {
      for (const info of drawInfos) {
        const tex = info.texture;
        tex.use();
        program.use();

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // gl.enableVertexAttribArray(POSITION_LOCATION);
        // gl.vertexAttribPointer(POSITION_LOCATION, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, textcoordBuffer);
        // gl.enableVertexAttribArray(TEXTURE_LOCATION);
        // gl.vertexAttribPointer(TEX)

        const matrix = Matrix4.ortho(0, gl.canvas.width, gl.canvas.height, 0, -1, 1)
          .translate(info.position)
          .scale(info.scale);


        const w = 100;
        const h = 100;
        const s = tex.source;
        const translation = new Vector3(s.width / w, s.height / h, 0)
        const texMatrix = Matrix4.fromTranslation(translation);

        program.setUniform("u_matrix", matrix);
        program.setUniform("texture_matrix", texMatrix);

        // gl.uniformMatrix4fv(TEXTURE_MATRIX_LOCATION, false, texMatrix);
        // gl.uniform1i(TEXTURE_LOCATION, 0);

        // gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    }

    function update(delta: number) {
      const SPEED = 10;
      for (const info of drawInfos) {
        const moveX = r() * SPEED * delta;
        const moveY = r() * SPEED * delta;

        info.position.add(new Vector3(moveX, moveY, 0));
        info.scale.set(r(), r(), 1);
      }
    }

    requestAnimationFrame(render);
  }
}

function r() {
  const sign = Math.random() > 0.5 ? 1 : -1;
  return Math.random() * sign;
}

const textureSources = [
  '/images/1.png',
  '/images/2.png',
  '/images/3.png',
];
