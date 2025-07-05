import { RefObject, useEffect, useLayoutEffect, useRef } from "react";
import StartGame from "./game/main";
import { EventBus } from "./game/EventBus";
import { MyGameScene } from "./scenes";

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: MyGameScene | null;
}

interface IProps {
  currentActiveScene?: (scene_instance: Phaser.Scene) => void;
  ref: RefObject<IRefPhaserGame | null>;
}

export const PhaserGame = ({ currentActiveScene, ref }: IProps) => {
  const game = useRef<Phaser.Game | null>(null!);

  useLayoutEffect(() => {
    if (game.current === null) {
      game.current = StartGame("game-container");

      ref.current = { game: game.current, scene: null };
    }

    return () => {
      if (game.current) {
        game.current.destroy(true);
        if (game.current !== null) {
          game.current = null;
        }
      }
    };
  }, [ref]);

  useEffect(() => {
    EventBus.on("current-scene-ready", (sceneInstance: MyGameScene) => {
      if (currentActiveScene && typeof currentActiveScene === "function") {
        currentActiveScene(sceneInstance);
      }

      ref.current = {
        game: game.current,
        scene: sceneInstance,
      };
    });
    return () => {
      EventBus.removeListener("current-scene-ready");
    };
  }, [currentActiveScene, ref]);

  return <div id="game-container"></div>;
};
