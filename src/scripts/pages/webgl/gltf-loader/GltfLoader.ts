import { BaseThreeCanvas } from "@scripts/components/BaseThreeCanvas";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { AmbientLight } from "three/src/lights/AmbientLight.js";
import { Mesh } from "three/src/objects/Mesh.js";
import { BufferGeometry } from "three/src/core/BufferGeometry.js";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial.js";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import { Vector3 } from "three/src/math/Vector3.js";
import vertexShader from "./shaders/shader.vert";
import fragmentShader from "./shaders/shader.frag";

const GLTF_PATH = "/assets/models/red-spider-lily/";
const GLTF_NAME = "red-spider-lily.gltf";
const GLTF_MESH_NAME = "PL-QS1310-1all-3";
const TEXTURE_PATH = "/assets/models/red-spider-lily/textures/PL-QS1310-1all-3.jpg";
/**
 * IndexページのWEBGL Canvas
 */
class GltfLoader extends BaseThreeCanvas {
  #canvasElement: HTMLCanvasElement;
  #GLTFLoader: GLTFLoader;
  #light: AmbientLight = new AmbientLight();
  constructor({ canvasElement }: { canvasElement: HTMLCanvasElement }) {
    super({ canvasElement, orbitControls: true });
    this.#canvasElement = canvasElement;

    // lightの追加
    this.scene.add(this.#light);

    // GLTFLoader RGBELoaderの初期化
    this.#GLTFLoader = new GLTFLoader().setPath(GLTF_PATH);
    this.#initMesh();

    console.log("GltfLoader", this.#canvasElement);
  }

  /**
   * getGeometry
   */
  async #getGeometry(): Promise<BufferGeometry> {
    return new Promise<BufferGeometry>((resolve) => {
      this.#GLTFLoader.load(GLTF_NAME, (object) => {
        console.log(object);
        object.scene.traverse((child) => {
          // main という名前のオブジェクト
          if (child.name === GLTF_MESH_NAME) {
            resolve((child as Mesh).geometry);
            console.log((child as Mesh).geometry);
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
    const geometry = await this.#getGeometry();
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTex: { value: texture },
      },
    });
    const mesh = new Mesh(geometry, material);
    mesh.scale.set(60, 60, 60);
    // mesh.rotateX(90);
    const toRad = Math.PI / 180;
    // const axis = new Vector3(90 * toRad, 66 * toRad, 0 * toRad);
    // mesh.rotateOnAxis(axis, 1);
    mesh.translateY(120);
    mesh.rotateY(66 * toRad);
    mesh.rotateZ(-120 * toRad);
    // mesh.rotateZ(90);
    this.scene.add(mesh);
  }
}

export { GltfLoader };
