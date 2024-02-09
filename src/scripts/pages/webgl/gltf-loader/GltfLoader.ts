import { BaseThreeCanvas } from "@scripts/components/BaseThreeCanvas";
/**
 * IndexページのWEBGL Canvas
 */
class GltfLoader extends BaseThreeCanvas {
  #canvasElement: HTMLCanvasElement;
  constructor({ canvasElement }: { canvasElement: HTMLCanvasElement }) {
    super({ canvasElement });
    this.#canvasElement = canvasElement;

    // meshの初期化
    console.log("GltfLoader", this.#canvasElement);
  }
}

export { GltfLoader };
