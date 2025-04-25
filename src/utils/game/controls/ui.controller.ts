import Controller from "../../Engine/Controller";
import FPSController from "../../Engine/FPSController";
import AudioQueue from '../../Engine/Utils/AudioQueue';
import Dimensions from "../../Engine/Utils/Dimensions";
import SpriteSelector from "../../Engine/Utils/SpriteSelector";

export async function setUIControls(
  $fps: HTMLDivElement,
  $startStopGameBtn: HTMLButtonElement
) {
  const iconSelector = new SpriteSelector(
    "/assets/UI/UI_Wood_Fonts/UI_Font_A.png",
    17,
    18,
    32,
    new Dimensions({
      width: 576,
      height: 544,
    })
  );
  await iconSelector.loadSpriteSheet();

  const playIcon = iconSelector.getSpriteAsDiv(8, 7);
  const pauseIcon = iconSelector.getSpriteAsDiv(8, 4);
  $startStopGameBtn.appendChild(playIcon);

  const backgroundAudio = new AudioQueue("/assets/audio/background", 3);

  const startGame = () => {
    if (FPSController.gameIsRunning) return;

    document.body.style.cursor = 'none';

    document.documentElement.requestFullscreen();

    FPSController.startGame();

    backgroundAudio.play();

    $startStopGameBtn.innerHTML = "Pausar";
    $startStopGameBtn.appendChild(pauseIcon);

    $startStopGameBtn.removeEventListener("click", startGame);
    $startStopGameBtn.addEventListener("click", stopGame);

    Controller.locked = false;
  };

  const stopGame = () => {
    if (!FPSController.gameIsRunning) return;
    FPSController.stopGame();

    document.body.style.cursor = 'auto';

    //document.exitFullscreen();

    backgroundAudio.pause();

    $fps.innerText = "FPS: 0";

    $startStopGameBtn.innerHTML = "Iniciar";
    $startStopGameBtn.appendChild(playIcon);
    $startStopGameBtn.removeEventListener("click", stopGame);
    $startStopGameBtn.addEventListener("click", startGame);
  };

  const updateFPSView = () => {
    $fps.innerText = `FPS: ${FPSController.FPS}`;
  };

  $startStopGameBtn.addEventListener("click", startGame);
  Controller.setKeyUpEventListener("Escape", stopGame);

  document.addEventListener("keydown", function (event) {
    const controlPresionado = event.ctrlKey;
    const enterPresionado = event.key === "Enter";

    if (controlPresionado && enterPresionado) {
      startGame();
    }
  });

  setInterval(updateFPSView, 1000);
}
