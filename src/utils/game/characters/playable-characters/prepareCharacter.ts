import PlayableCharacter from "../../../Engine/Character/PlayableCharacter";
import type MapManager from "../../../Engine/MapManager/MapManager";
import { range } from "../../../Engine/utils";
import Dimensions from "../../../Engine/Utils/Dimensions";
import Point from "../../../Engine/Utils/Point";
import SpriteSelector from "../../../Engine/Utils/SpriteSelector";
import SpriteSheetAnimation from "../../../Engine/Utils/SpriteSheetAnimation";
import setCharacterControls from "../../controls/character.controller";

export default async function prepareCharacter(mapManager: MapManager) {
  const characterSpriteSelector = new SpriteSelector(
    "/assets/mystic_woods_2.2/sprites/characters/player.png",
    10,
    6,
    48,
    new Dimensions({
      width: 288,
      height: 480,
    })
  );
  await characterSpriteSelector.loadSpriteSheet();

  const character = new PlayableCharacter({
    layer: mapManager._element,
    element: {
      x: 210,
      y: 260,
      width: 48,
      height: 48,
    },
    collision: {
      positionInElement: new Point({ x: 18, y: 20 }),
      dimensions: new Dimensions({ width: 12, height: 20 }),
    },
    stats: {
      health: 100,
      strength: 100,
      intelligence: 100,
      walkingSpeed: 40,
      runningSpeed: 80,
    },
    mapCollisions: mapManager.collisions,
    animation: {
      spriteSelector: characterSpriteSelector,
      animationSequences: {
        idle_bottom: range(0, 5).map((x) => new Point({ x, y: 0 })),
        idle_side: range(0, 5).map((x) => new Point({ x, y: 1 })),
        idle_top: range(0, 5).map((x) => new Point({ x, y: 2 })),
        move_bottom: range(0, 5).map((x) => new Point({ x, y: 3 })),
        move_side: range(0, 5).map((x) => new Point({ x, y: 4 })),
        move_top: range(0, 5).map((x) => new Point({ x, y: 5 })),
        attack_bottom: range(0, 3).map((x) => new Point({ x, y: 6 })),
        attack_side: range(0, 3).map((x) => new Point({ x, y: 7 })),
        attack_top: range(0, 3).map((x) => new Point({ x, y: 8 })),
        die: range(0, 2).map((x) => new Point({ x, y: 9 })),
      },
      defaultInterval: 200,
      defaultSequence: 'idle_bottom',
    },
  });

  setCharacterControls(character);

  mapManager.camera.follow(character);
}
