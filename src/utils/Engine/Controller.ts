import type { BasicCallback } from '../../types/helpers';
import FPSController from './FPSController';

export enum MouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
}

class Controller {
  readonly activeKeys: Set<string>;
  /**Donde la clave es un teclado y basic callback un listener */
  private listeners: Record<string, BasicCallback> = {}
  public locked = true;

  constructor () {
    this.activeKeys = new Set()

    window.addEventListener('keydown', e => {
      this.activeKeys.add(e.key.toLowerCase())
    })

    window.addEventListener('keyup', e => {
      this.activeKeys.delete(e.key.toLowerCase())
    })

    FPSController.addEventListener(() => this.#triggerListeners())
  }

  setKeyDownEventListener(key: string, listener: BasicCallback) {
    this.listeners[key.toLowerCase()] = listener
  }

  setKeyUpEventListener(key: string, listener: BasicCallback) {
    window.addEventListener('keyup', e => {
      if (this.locked || e.key.toLowerCase() != key.toLowerCase()) return;
      listener()
    })
  }

  setMouseUpEventListener(btn: MouseButton, listener: BasicCallback) {
    window.addEventListener('mouseup', e => {
      if (this.locked || e.button != btn) return;
      listener()
    })
  }

  #triggerListeners() {
    if (this.locked) return;

    this.activeKeys.forEach(key => {
      const listener = this.listeners[key]

      if (!listener) return;
      listener()
    })
  }
}

export default new Controller()