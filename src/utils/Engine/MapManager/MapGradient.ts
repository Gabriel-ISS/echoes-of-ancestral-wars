import Element from "../../Element";
import { Layers } from "../constants";
import type Dimensions from "../Utils/Dimensions";

enum Direction {
  TOP_DOWN = "top-down",
  LEFT_RIGHT = "left-right",
  BOTTOM_UP = "bottom-up",
  RIGHT_LEFT = "right-left",
}

/** @deprecated ya no se usa*/
export default class MapGradient extends Element<"canvas"> {
  private ctx: CanvasRenderingContext2D; // Contexto del canvas

  constructor(
    parent: HTMLElement,
    mapDimensions: Dimensions,
    private gradientSize: number,
    private colorStops: [number, string][]
  ) {
    super("canvas", parent);

    const style = this._element.style;
    style.position = "absolute";
    style.zIndex = `${Layers.GRADIENT}`;
    style.imageRendering = "pixelated";
    this._element.width = mapDimensions.width;
    this._element.height = mapDimensions.height;

    const ctx = this._element.getContext("2d");
    if (!ctx) throw new Error("Context not found");
    this.ctx = ctx;
    this.gradientSize = gradientSize;

    this.drawBorders(mapDimensions.width, mapDimensions.height);
  }

  private drawBorderGradient(
    x: number,
    y: number,
    width: number,
    height: number,
    direction: Direction
  ): void {
    let gradient: CanvasGradient;
    switch (direction) {
      case Direction.TOP_DOWN:
        gradient = this.ctx.createLinearGradient(x, y, x, y + height);
        break;
      case Direction.LEFT_RIGHT:
        gradient = this.ctx.createLinearGradient(x, y, x + width, y);
        break;
      case Direction.BOTTOM_UP:
        gradient = this.ctx.createLinearGradient(x, y + height, x, y);
        break;
      case Direction.RIGHT_LEFT:
        gradient = this.ctx.createLinearGradient(x + width, y, x, y);
        break;
      default:
        throw new Error("Invalid direction");
    }

    this.colorStops.forEach(([offset, color]) => {
      gradient.addColorStop(offset, color);
    });

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x, y, width, height);
  }

  public drawBorders(canvasWidth: number, canvasHeight: number): void {
    // Gradiente superior
    this.drawBorderGradient(
      0,
      0,
      canvasWidth,
      this.gradientSize,
      Direction.TOP_DOWN
    );

    // Gradiente inferior
    this.drawBorderGradient(
      0,
      canvasHeight - this.gradientSize,
      canvasWidth,
      this.gradientSize,
      Direction.BOTTOM_UP
    );

    // Gradiente izquierdo
    this.drawBorderGradient(
      0,
      0,
      this.gradientSize,
      canvasHeight,
      Direction.LEFT_RIGHT
    );

    // Gradiente derecho
    this.drawBorderGradient(
      canvasWidth - this.gradientSize,
      0,
      this.gradientSize,
      canvasHeight,
      Direction.RIGHT_LEFT
    );
  }
}
