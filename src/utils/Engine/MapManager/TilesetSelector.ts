import type { Object, Tileset } from "../../../types/tiled/Tileset";
import Dimensions from "../Utils/Dimensions";
import Point from "../Utils/Point";

export default class TilesetSelector {
  readonly img: HTMLImageElement;

  constructor(readonly tileset: Tileset, readonly tilesetGlobalID: number) {
    this.img = new Image();
    this.img.src = this.tileset.image;
  }

  /**El tamaño de cada tile en el tileset */
  get tileDimensions(): Dimensions {
    return new Dimensions([this.tileset.tilewidth, this.tileset.tileheight]);
  }

  private getLocalID(globalID: number): number {
    return globalID - this.tilesetGlobalID;
  }

  /**@returns las coordenadas X e Y en pixeles en el contexto del tileset */
  private getTileCoordinatesFromLocalID(localID: number) {
    const x = (localID % this.tileset.columns) * this.tileset.tilewidth;
    const y = Math.floor(localID / this.tileset.columns) * this.tileset.tileheight;

    return new Point([x, y]);
  }

  /**@returns las coordenadas X e Y en pixeles en el contexto del tileset */
  getTileCoordinates(globalID: number): Point {
    if (this.tileset.tilecount == 1) return new Point([0, 0]);
    const localID = this.getLocalID(globalID);
    const coordinates = this.getTileCoordinatesFromLocalID(localID);
    return coordinates
  }

  /**@returns las colisiones en crudo */
  getTileRawCollisions(globalID: number): Object[] | null {
    const tiles = this.tileset.tiles;
    if (!tiles) return null;

    const localID = this.getLocalID(globalID);
    const tile = tiles.find((tile) => tile.id == localID);
    if (!tile) return []

    return tile.objectgroup?.objects ?? [];
  }
}
