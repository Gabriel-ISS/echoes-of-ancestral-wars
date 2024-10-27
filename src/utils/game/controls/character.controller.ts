import type PlayableCharacter from "../../Engine/Character/PlayableCharacter";
import Controller, { MouseButton } from "../../Engine/Controller";

export default function setCharacterControls(character: PlayableCharacter) {
  const animationIntervals = {
    idle: 200,
    walk: 100,
    run: 50,
    attack: 70,
  };

  const keys = {
    RIGHT: "d",
    LEFT: "a",
    UP: "w",
    DOWN: "s",
    RUN: "shift",
    ATTACK: MouseButton.LEFT,
  }

  const setWalkOrRunInterval = () => {
    if (Controller.activeKeys.has(keys.RUN)) {
      character.animation.currentInterval = animationIntervals.run;
    } else {
      character.animation.currentInterval = animationIntervals.walk;
    }
  };

  const setIdleAnimation = (
    ...params: Parameters<typeof character.animation.setAnimation>
  ) => {
    character.animation.currentInterval = animationIntervals.idle;
    character.animation.setAnimation(...params);
  };

  // derecha
  Controller.setKeyDownEventListener(keys.RIGHT, () => {
    setWalkOrRunInterval();
    character.move.right();
    character.animation.setAnimation("move_side");
  });
  Controller.setKeyUpEventListener(keys.RIGHT, () => {
    setIdleAnimation("idle_side");
  });

  // izquierda
  Controller.setKeyDownEventListener(keys.LEFT, () => {
    setWalkOrRunInterval();
    character.move.left();
    character.animation.setAnimation("move_side", true);
  });
  Controller.setKeyUpEventListener(keys.LEFT, () => {
    setIdleAnimation("idle_side", true);
  });

  // arriba
  Controller.setKeyDownEventListener(keys.UP, () => {
    setWalkOrRunInterval();
    character.move.top();
    if (Controller.activeKeys.has(keys.RIGHT)) {
      character.animation.setAnimation("move_side");
    } else if (Controller.activeKeys.has(keys.LEFT)) {
      character.animation.setAnimation("move_side", true);
    } else {
      character.animation.setAnimation("move_top");
    }
  });
  Controller.setKeyUpEventListener(keys.UP, () => {
    setIdleAnimation("idle_top");
  });

  // abajo
  Controller.setKeyDownEventListener(keys.DOWN, () => {
    setWalkOrRunInterval();
    character.move.bottom();
    if (Controller.activeKeys.has(keys.RIGHT)) {
      character.animation.setAnimation("move_side");
    } else if (Controller.activeKeys.has(keys.LEFT)) {
      character.animation.setAnimation("move_side", true);
    } else {
      character.animation.setAnimation("move_bottom");
    }
  });
  Controller.setKeyUpEventListener(keys.DOWN, () => {
    setIdleAnimation("idle_bottom");
  });

  // correr
  Controller.setKeyDownEventListener(keys.RUN, () => {
    character.startRunning();
    character.animation.currentInterval = animationIntervals.run;
  });

  // dejar de correr
  Controller.setKeyUpEventListener(keys.RUN, () => {
    character.stopRunning();
    character.animation.currentInterval = animationIntervals.walk;
  });

  Controller.setMouseUpEventListener(keys.ATTACK, () => {
    character.animation.currentInterval = animationIntervals.attack;

    if (character.animation.currentSequence.includes("side")) {
      character.animation.setAnimation(
        "attack_side",
        character.animation.mirror
      );
      character.animation.onAnimationEnd = () => {
        setIdleAnimation("idle_side", character.animation.mirror);
      };
    } else if (character.animation.currentSequence.includes("top")) {
      character.animation.setAnimation("attack_top");
      character.animation.onAnimationEnd = () => setIdleAnimation("idle_top");
    } else if (character.animation.currentSequence.includes("bottom")) {
      character.animation.setAnimation("attack_bottom");
      character.animation.onAnimationEnd = () =>
        setIdleAnimation("idle_bottom");
    }
  });
}
