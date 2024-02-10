import { BaseThreeCanvas } from "@scripts/components/BaseThreeCanvas";
/**
 * IndexページのWEBGL Canvas
 */
class GltfLoader extends BaseThreeCanvas {
  #canvasElement: HTMLCanvasElement;
  constructor({ canvasElement }: { canvasElement: HTMLCanvasElement }) {
    super({ canvasElement });
    this.#canvasElement = canvasElement;

    console.log("GltfLoader", this.#canvasElement);
  }
}

export { GltfLoader };
