import type { BasicCallback } from '../../../types/helpers';
import Point from "./Point";
import SpriteSelector from "./SpriteSelector";

type AnimationSequences<SK extends string> = Record<SK, Point[]>;

export type SpriteSheetAnimationParameters<SK extends string> = {
  spriteSelector: SpriteSelector;
  animationSequences: AnimationSequences<SK>;
  defaultSequence: SK;
  defaultInterval: number;
  element: HTMLElement;
};

export default class SpriteSheetAnimation<SK extends string> {
  private spriteSelector: SpriteSelector;
  private animationSequences: AnimationSequences<SK>;
  private element: HTMLElement;

  private _mirror = false;
  private currentFrame = 0;
  public currentInterval: number;
  private _currentSequence: SK;
  private intervalID: number = 0;

  public onAnimationEnd: BasicCallback | null = null;

  get currentSequence() {
    return this._currentSequence;
  }

  get mirror() {
    return this._mirror;
  }

  constructor(parameters: SpriteSheetAnimationParameters<SK>) {
    this.spriteSelector = parameters.spriteSelector;
    this.animationSequences = parameters.animationSequences;
    this.element = parameters.element;

    const style = this.element.style;
    style.backgroundImage = `url(${this.spriteSelector.spriteSheet.src})`;
    style.backgroundSize = `${this.spriteSelector.spriteSheet.width}px ${this.spriteSelector.spriteSheet.height}px`;
    style.imageRendering = "pixelated";

    this.currentInterval = parameters.defaultInterval;

    // siempre se ejecuta primero setAnimation
    this.setAnimation(parameters.defaultSequence);
    this._currentSequence = parameters.defaultSequence;
  }

  setAnimation(sequence: SK, mirror: boolean = false) {
    if (this._currentSequence == sequence && mirror == this._mirror) return;
    clearInterval(this.intervalID);

    this._mirror = mirror;
    this._currentSequence = sequence;
    this.currentFrame = 0;

    this.element.style.scale = mirror ? '-1 1' : '1 1'

    this.loop();
  }

  private loop() {
    this.intervalID = setTimeout(() => {
      const sequence = this.animationSequences[this._currentSequence];

      const spriteCoordinates = sequence[this.currentFrame];

      const style = this.element.style;

      const spritePixelCoordinates = this.spriteSelector.getSprite(
        spriteCoordinates.y,
        spriteCoordinates.x
      );

      style.backgroundPositionX = `-${spritePixelCoordinates.x}px`;
      style.backgroundPositionY = `-${spritePixelCoordinates.y}px`;

      this.currentFrame++;
      if (this.currentFrame >= sequence.length) {
        this.currentFrame = 0;
        this.onAnimationEnd?.()
        this.onAnimationEnd = null;
      }

      this.loop();
    }, this.currentInterval);
  }
}
