import { BaseWebGLCanvas } from "@scripts/components/BaseWebGLCanvas";
import { Color, Program, Triangle, Transform, Mesh, Vec2 } from "ogl";
import vertexShader from "./shaders/metaball.vert";
import fragmentShader from "./shaders/metaball.frag";
import { ScreenUtil } from "@utils/ScreenUtil";
/**
 * IndexページのWEBGL Canvas
 */
class MetaballCanvas extends BaseWebGLCanvas {
  #element: HTMLElement;
  #group: Transform = new Transform();
  #programArr: Array<Program> = [];
  #meshArr: Array<Mesh> = [];
  constructor({ element }: { element: HTMLElement }) {
    super({ element });
    this.#element = element;

    // meshの初期化
    this.#initMesh();
  }

  /**
   * メッシュの初期化
   */
  #initMesh() {
    const geometry = new Triangle(super.gl);
    const program = new Program(super.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(0.3, 0.2, 0.5) },
        uAspect: { value: ScreenUtil.aspect },
        uResolution: { value: new Vec2(ScreenUtil.width, ScreenUtil.height) },
      },
      transparent: true,
    });
    this.#programArr.push(program);
    this.#meshArr.push(new Mesh(super.gl, { geometry, program }));
    this.#setMeshSize();
    this.#meshArr.forEach((mesh) => {
      super.scene.addChild(mesh);
    });
  }

  /**
   * メッシュのリサイズ
   */
  #setMeshSize() {
    console.log("setMeshSize");
    this.#meshArr.forEach((mesh) => {
      const width = ScreenUtil.width;
      const height = ScreenUtil.height;
      mesh.scale.set(width, height, 1);
    });
  }

  /**
   * update
   */
  #update({ time }: { time: number }) {
    this.#programArr.forEach((program) => {
      program.uniforms.uTime.value = time;
    });
  }

  /**
   * レンダリング
   * @param {object} param0
   * @param {number} param0.time 経過秒数
   */
  render({ time }: { time: number }) {
    super.render({ time });
    this.#update({ time });
  }

  /**
   * リサイズ
   */
  override _onResize() {
    super._onResize();
    ScreenUtil.resize();
    this.#setMeshSize();
    this.#programArr.forEach((program) => {
      program.uniforms.uAspect.value = ScreenUtil.aspect;
    });
  }
}

export { MetaballCanvas };
