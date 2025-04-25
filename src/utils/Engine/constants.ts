export enum Layers {
  BACKGROUND = 0,
  CHARACTER = 1,
  FOREGROUND = 2,
  GRADIENT = 3,
  UI = 4,
}

export const Config = {
  SHOW_PLAYER_COLLISION: false,
  SHOW_COLLISIONS: false,
  SHOW_COLLISION_ZONES: false,
};

export const BASE_PATH = import.meta.env.BASE_URL;
console.log('BASE_PATH', BASE_PATH);
