import { mat3, mat4, vec3 } from "gl-matrix";
import { loadImage } from "../helpers/image";
import { ensureGLOk } from "../webgl/error";
import { SimpleProgram } from "../webgl/program";
import { Renderer } from "../webgl/renderer";
import { processShaderSource } from "../webgl/shader/process";
import { Texture } from "../webgl/texture";
import { TextureManager } from "../webgl/texture/manager";
import { IRenderContext } from "../webgl/types";
import { Shader } from "../webgl/shader/shader";

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

    const textures = await Promise.all(textureSources.map(async (src) => {
      const img = await loadImage(src);
      return new Texture(img);
    }));

    console.log('textures', textures);

    textures.forEach((tex) => tex.init(gl));

    const drawInfos = textures.map((tex) => {

      const position = vec3.create();
      const scale = vec3.create();
      return {
        texture: tex,
        position,
        scale,
      }
    });

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ]), gl.STATIC_DRAW);

    const textcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textcoordBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ]), gl.STATIC_DRAW);

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

    program.init(gl);

    let then = 0;
    function render(time: number) {
      requestAnimationFrame(render);

      const now = time * 0.001;
      const delta = Math.min(0.1, now - then);
      then = now;

      update(delta);
      draw();
      // renderer.render();
    }

    const ctx: IRenderContext = {
      textureManager: new TextureManager(),
      gl,
    }

    function draw() {
      for (const info of drawInfos) {
        const tex = info.texture;
        tex.use(ctx);
        program.use();

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // gl.enableVertexAttribArray(POSITION_LOCATION);
        // gl.vertexAttribPointer(POSITION_LOCATION, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, textcoordBuffer);
        // gl.enableVertexAttribArray(TEXTURE_LOCATION);
        // gl.vertexAttribPointer(TEX)

        let matrix = mat4.ortho(mat4.create(), 0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

        matrix = mat4.translate(matrix, matrix, info.position);
        matrix = mat4.scale(matrix, matrix, info.scale);
        // gl.uniformMatrix4fv(MATRIX_LOCATION, false, matrix);


        const w = 100;
        const h = 100;
        const s = tex.source;
        const translation = vec3.create();
        vec3.set(translation, s.width / w, s.height / h, 0);
        const texMatrix = mat4.fromTranslation(mat4.create(), translation);

        // gl.uniformMatrix4fv(TEXTURE_MATRIX_LOCATION, false, texMatrix);
        // gl.uniform1i(TEXTURE_LOCATION, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    }

    function update(delta: number) {
      const SPEED = 10;
      for (const info of drawInfos) {
        const moveX = r() * SPEED * delta;
        const moveY = r() * SPEED * delta;
        vec3.add(info.position, info.position, vec3.set(vec3.create(), moveX, moveY, 0));
        vec3.set(info.scale, r(), r(), 1);
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
