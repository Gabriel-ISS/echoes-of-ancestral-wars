export type Tileset = {
  readonly columns:      number;
  readonly image:        string;
  readonly imageheight:  number;
  readonly imagewidth:   number;
  readonly margin:       number;
  readonly name:         string;
  readonly spacing:      number;
  readonly tilecount:    number;
  readonly tiledversion: string;
  readonly tileheight:   number;
  readonly tiles?:        Tile[];
  readonly tilewidth:    number;
  readonly type:         string;
  readonly version:      string;
}

export type Tile = {
  readonly id:          number;
  readonly objectgroup?: Objectgroup;
  readonly animation?:  Animation;
}

export type Animation = {
  readonly tileid:         number;
  readonly duration:   number;
}

export type Objectgroup = {
  readonly draworder: Draworder;
  readonly name:      string;
  readonly objects:   Object[];
  readonly opacity:   number;
  readonly type:      Type;
  readonly visible:   boolean;
  readonly x:         number;
  readonly y:         number;
}

export enum Draworder {
  Index = "index",
}

export type Object = {
  readonly height:   number;
  readonly id:       number;
  readonly name:     string;
  readonly rotation: number;
  readonly type:     string;
  readonly visible:  boolean;
  readonly width:    number;
  readonly x:        number;
  readonly y:        number;
}

export enum Type {
  Objectgroup = "objectgroup",
}