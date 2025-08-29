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
import { Vector2 } from "../math/vector2";

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
      const cnv = gl.canvas;
      const x = randomInt(0, cnv.width);
      const y = randomInt(0, cnv.height);
      const position = new Vector3(x, y, 0);
      const scale = new Vector3(1, 1, 1);
      return {
        texture: tex,
        position,
        scale,
      }
    });

    const program = new SimpleProgram({
      vertex: Shader.vertex(`
        uniform mat4 u_textureMatrix;

        in vec3 a_position;

        out vec2 v_texcoord;

        void main() {
          gl_Position = vec4(a_position.xy, 1.0, 1.0);
          v_texcoord = (u_textureMatrix * vec4(a_position.xyz, 1)).xy;
        }
      `, {
        uniforms: {
          u_textureMatrix: Matrix4,
        },
        attributes: {
          a_position: Vector3,
        }
      }),
      fragment: Shader.fragment(`
        uniform sampler2D u_texture;
        in vec2 v_texcoord;

        out vec4 fragColor;
        void main() {
          // fragColor = texture(u_texture, v_texcoord);
          fragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `, {
        uniforms: {
          u_texture: Texture,
        }
      }),
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
      gl.clearColor(.1, .1, .1, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      for (let i = 0; i < drawInfos.length; i++) {
        program.sync(ctx);
        const info = drawInfos[i];
        const tex = info.texture;
        program.setAttribute("a_position", i, info.position);

        const w = 1;
        const h = 1;
        const s = tex.source;
        const translation = new Vector3(s.width / w, s.height / h, 1)
        const texMatrix = Matrix4.fromTranslation(translation);

        // program.setUniform("u_matrix", matrix);
        program.setUniform("u_textureMatrix", texMatrix);
        program.setUniform("u_texture", tex);
        tex.use();
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        ensureGLOk(gl);
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

function randomInt(min: number, max: number) {
  min = Math.ceil(min); // Ensure min is an integer
  max = Math.floor(max); // Ensure max is an integer
  return Math.floor(Math.random() * (max - min + 1)) + min;
}