import { BaseThreeCanvas } from "@scripts/components/BaseThreeCanvas";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { AmbientLight } from "three/src/lights/AmbientLight.js";
import { Mesh } from "three/src/objects/Mesh.js";
import { BufferGeometry } from "three/src/core/BufferGeometry.js";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial.js";
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial.js";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial.js";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import { Vector2 } from "three/src/math/Vector2.js";
import { Vector3 } from "three/src/math/Vector3.js";
import vertexShader from "./shaders/shader.vert";
import fragmentShader from "./shaders/shader.frag";

import { globalMouseMove } from "@scripts/events/GlobalMouseEventHandler";

const GLTF_PATH = "/assets/models/red-spider-lily/";
const GLTF_NAME = "red-spider-lily_particles.gltf";
const GLTF_MESH_NAME = "PL-QS1310-1all-3";
const TEXTURE_PATH = "/assets/models/red-spider-lily/textures/PL-QS1310-1all-3.jpg";
/**
 * IndexページのWEBGL Canvas
 */
class GltfLoader extends BaseThreeCanvas {
  #canvasElement: HTMLCanvasElement;
  #GLTFLoader: GLTFLoader;
  #light: AmbientLight = new AmbientLight();
  boundOnMouseMove: ({ clientX, clientY }: { clientX: number; clientY: number }) => void;
  material: ShaderMaterial | undefined = undefined;
  constructor({ canvasElement }: { canvasElement: HTMLCanvasElement }) {
    super({ canvasElement, orbitControls: true });
    this.#canvasElement = canvasElement;
    // lightの追加
    this.scene.add(this.#light);

    // GLTFLoader RGBELoaderの初期化
    this.#GLTFLoader = new GLTFLoader().setPath(GLTF_PATH);
    this.#initMesh();

    // イベント登録
    this.boundOnMouseMove = this.onMouseMove.bind(this);
    this._addEventListener();

    console.log("GltfLoader", this.#canvasElement);
  }

  /**
   * getGeometry
   */
  async #getGeometry(): Promise<{ geometry: BufferGeometry }> {
    return new Promise<{ geometry: BufferGeometry }>((resolve) => {
      this.#GLTFLoader.load(GLTF_NAME, (object) => {
        console.log(object);
        object.scene.traverse((child) => {
          // main という名前のオブジェクト
          if (child.name === GLTF_MESH_NAME) {
            resolve({
              geometry: (child as Mesh).geometry,
            });
          }
        });
      });
    });
  }

  /**
   * init Mesh
   */
  async #initMesh() {
    const loader = new TextureLoader(); // テクスチャローダーを作成
    const texture = loader.load(TEXTURE_PATH); // テクスチャ読み込み
    texture.flipY = false;
    const { geometry } = await this.#getGeometry();
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uTex: { value: texture },
        uMouse: { value: new Vector3(0, 0, 0) },
      },
    });
    const mesh = new Mesh(geometry, this.material);

    mesh.scale.set(60, 60, 60);
    const toRad = Math.PI / 180;
    mesh.translateY(120);
    mesh.rotateY(66 * toRad);
    mesh.rotateZ(-120 * toRad);
    this.scene.add(mesh);
    console.log(geometry.attributes.position.array.length);
  }

  /**
   * onMouseMoveEvent
   */
  onMouseMove({ clientX, clientY }: { clientX: number; clientY: number }) {
    console.log(clientX, clientY);
    const mouse = new Vector2();
    const worldMouse = new Vector3();
    mouse.x = ((clientX - this._renderer.domElement.offsetLeft) / this._renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -((clientY - this._renderer.domElement.offsetTop) / this._renderer.domElement.clientHeight) * 2 + 1;
    worldMouse.set(mouse.x, mouse.y, (this._camera.near + this._camera.far) / (this._camera.near - this._camera.far));
    worldMouse.unproject(this._camera);
    worldMouse.z = 0;
    if (this.material) this.material.uniforms.uMouse.value = worldMouse;
  }

  /**
   * addEventListener
   */
  protected _addEventListener(): void {
    super._addEventListener();
    if (this.material) globalMouseMove.add(this.boundOnMouseMove);
  }

  /**
   * update
   */
  update({ time }: { time: number }) {
    if (this.material) this.material.uniforms.uTime.value = time;
  }

  /**
   * レンダリング
   * @param {object} param0
   * @param {number} param0.time 経過秒数
   */
  render({ time }: { time: number }) {
    super.render({ time });
    if (this.material) this.update({ time });
  }
}

export { GltfLoader };
