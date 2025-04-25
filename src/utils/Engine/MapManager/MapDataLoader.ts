import type { MapData, Tileset } from "../../../types/tiled/Map";
import type { Tileset as LoadedTileset } from "../../../types/tiled/Tileset";
import { BASE_PATH } from '../constants';
import { loadImage } from '../utils';
import Map from "./Map";

class MapDataLoader {

/**
   * 
   * @param origin el path de origen
   * @param relativePath la ruta relativa a la ruta de origen
   * @returns el path absoluto
   */
  private relativeToAbsolutePath(origin: string, relativePath: string) {
    const arrOrigin = origin.split("/");
    arrOrigin.pop();
    const path = relativePath.split("/");

    let validPath = "";
    arrOrigin.forEach((part) => {
      if (part == ".." ) {
        arrOrigin.pop();
      } else if (part != "") {
        validPath = validPath + "/" + part;
      }
    })

    // se espera que validoPath empiece con /
    return BASE_PATH + validPath.slice(1) + '/' + path.join("/");
  }

  /**
   * 
   * @param mapPath debe empezar con /
   * @returns 
   */
  async getMap(mapPath: string) {
    const mapData = await this.getMapData(mapPath);
    const tilesets: [Tileset, LoadedTileset][] = await Promise.all(
      mapData.tilesets.map(async (tileset) => {
        const tilesetData = await this.getTilesetData(
          this.relativeToAbsolutePath(mapPath, tileset.source)
        );
        return [tileset, tilesetData];
      })
    );

    return new Map(mapData, tilesets)
  }

  private async getMapData(mapDataPath: string) {
    try {
      const res = await fetch(mapDataPath);
      if (!res.ok) throw new Error(`error ${res.status}`);
      return (await res.json()) as MapData;
    } catch (error) {
      throw new Error(`Failed to load map data: ${(error as Error).message}`);
    }
  }

  private async getTilesetData(
    tilesetDataPath: string
  ): Promise<LoadedTileset> {
    try {
      const res = await fetch(tilesetDataPath);
      const tilesetData = (await res.json()) as LoadedTileset;
      const image = this.relativeToAbsolutePath(tilesetDataPath, tilesetData.image);
      await loadImage(image);
      return { ...tilesetData, image };
    } catch (error) {
      throw new Error("Failed to load map data");
    }
  }
}

export default new MapDataLoader();