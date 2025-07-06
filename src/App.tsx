import { useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
import { isMainMenu } from "./game/scenes/MainMenu";
import { MyGameScenes } from "./scenes";

function App() {
  // The sprite can only be moved in the MainMenu Scene
  const [canMoveSprite, setCanMoveSprite] = useState(true);

  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });
  const [cameraAngle, setCameraAngle] = useState(0);

  const changeScene = () => {
    phaserRef.current?.scene?.changeScene();
  };

  const moveSprite = () => {
    const scene = phaserRef.current?.scene;

    if (isMainMenu(scene)) {
      // Get the update logo position
      scene.moveLogo(({ x, y }) => {
        setSpritePosition({ x, y });
      });
    }
  };

  const addBouncingStar = () => {
    const scene = phaserRef.current?.scene;

    if (isMainMenu(scene)) {
      // Get the update logo position
      scene.addBouncingStar();
    }
  };

  const addSprite = () => {
    if (phaserRef.current) {
      const scene = phaserRef.current.scene;

      if (scene) {
        // Add more stars
        const x = Phaser.Math.Between(64, scene.scale.width - 64);
        const y = Phaser.Math.Between(64, scene.scale.height - 64);

        //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
        const star = scene.add.sprite(x, y, "star");

        //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
        //  You could, of course, do this from within the Phaser Scene code, but this is just an example
        //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
        scene.add.tween({
          targets: star,
          duration: 500 + Math.random() * 1000,
          alpha: 0,
          yoyo: true,
          repeat: -1,
        });
      }
    }
  };

  // Event emitted from the PhaserGame component
  const currentScene = (scene: Phaser.Scene) => {
    setCanMoveSprite(scene.scene.key !== MyGameScenes.MainMenu);
  };

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
      <div>
        <div>
          <button className="button" onClick={changeScene}>
            Change Scene
          </button>
        </div>
        <div>
          <button
            disabled={canMoveSprite}
            className="button"
            onClick={moveSprite}
          >
            Toggle Movement
          </button>
        </div>
        <div className="spritePosition">
          Sprite Position:
          <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
        </div>
        <div>
          <button className="button" onClick={addSprite}>
            Add New Sprite
          </button>
        </div>
        <div>
          <button
            disabled={canMoveSprite}
            className="button"
            onClick={addBouncingStar}
          >
            Add Bouncing Star
          </button>
        </div>
        <div>
          <button
            className="button"
            onClick={() => {
              const camera = phaserRef.current?.scene?.cameras.main;
              if (camera) {
                camera.setAngle(cameraAngle + 10)
                setCameraAngle(angle => angle + 10);
              }
            }}
          >
            Rotate Camera
          </button>
        </div>
        <div>
          <button
            className="button"
            onClick={() => {
              const camera = phaserRef.current?.scene?.cameras.main;
              if (camera) {
                camera.setScroll(camera.scrollX + 10, 0);
                console.log(camera.worldView)
              }
            }}
          >
            Scroll Camera
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
