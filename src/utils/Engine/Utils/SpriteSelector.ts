import { BASE_PATH } from '../constants';
import { loadImage } from "../utils";
import type Dimensions from "./Dimensions";
import Point from "./Point";

export default class SpriteSelector {
  readonly spriteSheet: HTMLImageElement;
  /** Se accede a la coordenada seleccionando la fila y luego la columna */
  private spriteCoordinates: Record<number, Record<number, Point>>;
  readonly paddingBetween: number;

  constructor(
    readonly spriteSheetPath: string,
    readonly rows: number,
    readonly columns: number,
    readonly spriteSize: number,
    readonly spriteDimensions: Dimensions
  ) {
    this.spriteSheet = new Image();
    this.spriteSheet.src = BASE_PATH + spriteSheetPath.slice(1);
    this.spriteCoordinates = {};
    this.paddingBetween =
      (spriteDimensions.width - spriteSize * columns) / columns;
  }

  /**Carga la imagen del spritesheet, y cachea las coordenadas de cada sprite */
  async loadSpriteSheet() {
    await loadImage(this.spriteSheetPath);
    for (let row = 0; row <= this.rows; row++) {
      this.spriteCoordinates[row] = {};
      for (let column = 0; column <= this.columns; column++) {
        const spriteCoordinates = this.getSpriteCoordinates(row, column);
        this.spriteCoordinates[row][column] = spriteCoordinates;
      }
    }
  }

  private getSpriteCoordinates(row: number, column: number): Point {
    const multiplier = this.spriteSize + this.paddingBetween;
    const extraPadding = 0//this.paddingBetween / 2;
    return new Point({
      x: column * multiplier + extraPadding,
      y: row * multiplier + extraPadding,
    });
  }

  /**Retorna las coordenadas cacheadas de un sprite */
  getSprite(row: number, column: number): Point {
    return this.spriteCoordinates[row][column];
  }

  getSpriteAsDiv(row: number, column: number): HTMLDivElement {
    const spriteCoordinates = this.getSprite(row, column);
    const div = document.createElement("div");
    div.style.width = `${this.spriteSize}px`;
    div.style.height = `${this.spriteSize}px`;
    div.style.backgroundImage = `url(${this.spriteSheetPath})`;
    div.style.backgroundPosition = `-${spriteCoordinates.x}px -${spriteCoordinates.y}px`;
    return div;
  }
}
