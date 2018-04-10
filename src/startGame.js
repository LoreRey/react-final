import gameAttributes from "./game-attributes.js";
import playScene from "./play-scene.js";
import titleScene from "./title-scene.js";
import lobbyScene from "./lobby-scene.js";

const start = () => {
  const gameConfig = {
    type: Phaser.AUTO,
    width: gameAttributes.gameWidth,
    height: gameAttributes.gameHeight,
    physics: {
      default: "arcade",
      arcade: {
        debug: true
        // gravity: { y: 20 }
      }
    },
    scene: [titleScene, lobbyScene, playScene]
  };

  const game = new Phaser.Game(gameConfig);
  // game.scene.start("Title", { data: "this is data" });

  // function resize() {
  //   const canvas = document.querySelector("canvas");
  //   const windowWidth = window.innerWidth;
  //   const windowHeight = window.innerHeight;
  //   const windowRatio = windowWidth / windowHeight;
  //   const gameRatio = game.config.width / game.config.height;
  //   if (windowRatio < gameRatio) {
  //     canvas.style.width = windowWidth + "px";
  //     canvas.style.height = windowWidth / gameRatio + "px";
  //   } else {
  //     canvas.style.width = windowHeight * gameRatio + "px";
  //     canvas.style.height = windowHeight + "px";
  //   }
  // }
  // resize();
  // window.addEventListener("resize", resize, false);
};

export default start;
