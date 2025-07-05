import { Scene } from "phaser";

export interface MyGameScene extends Scene {
  changeScene: () => void;
}

export enum MyGameScenes {
  Game = "Game",
  GameOver = "GameOver",
  MainMenu = "MainMenu",
}
