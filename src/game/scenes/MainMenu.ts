import { GameObjects, Input, Scene } from "phaser";

import { EventBus } from "../EventBus";
import { MyGameScene, MyGameScenes } from "../../scenes";

export const isMainMenu = (
  scene: MyGameScene | null | undefined
): scene is MainMenu => scene?.scene.key === MyGameScenes.MainMenu;

export class MainMenu extends Scene implements MyGameScene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  logoTween: Phaser.Tweens.Tween | null;

  keyLeft?: Input.Keyboard.Key;
  keyRight?: Input.Keyboard.Key;
  keyUp?: Input.Keyboard.Key;
  keyDown?: Input.Keyboard.Key;

  playerStar: Phaser.GameObjects.Sprite;

  constructor() {
    super(MyGameScenes.MainMenu);
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    this.logo = this.add.image(512, 300, "logo").setDepth(100);

    this.title = this.add
      .text(512, 460, "Main Menu", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.playerStar = this.physics.add.sprite(50, 50, "star");
    this.keyLeft = this.input.keyboard?.addKey(Input.Keyboard.KeyCodes.LEFT);
    this.keyRight = this.input.keyboard?.addKey(Input.Keyboard.KeyCodes.RIGHT);
    this.keyUp = this.input.keyboard?.addKey(Input.Keyboard.KeyCodes.UP);
    this.keyDown = this.input.keyboard?.addKey(Input.Keyboard.KeyCodes.DOWN);

    EventBus.emit("current-scene-ready", this);
  }

  changeScene() {
    if (this.logoTween) {
      this.logoTween.stop();
      this.logoTween = null;
    }

    this.scene.start(MyGameScenes.Game);
  }

  moveLogo(reactCallback: ({ x, y }: { x: number; y: number }) => void) {
    if (this.logoTween) {
      if (this.logoTween.isPlaying()) {
        this.logoTween.pause();
      } else {
        this.logoTween.play();
      }
    } else {
      this.logoTween = this.tweens.add({
        targets: this.logo,
        x: { value: 750, duration: 3000, ease: "Back.easeInOut" },
        y: { value: 80, duration: 1500, ease: "Sine.easeOut" },
        yoyo: true,
        repeat: -1,
        onUpdate: () => {
          if (reactCallback) {
            reactCallback({
              x: Math.floor(this.logo.x),
              y: Math.floor(this.logo.y),
            });
          }
        },
      });
    }
  }

  addBouncingStar() {
    const bouncingStar = this.physics.add.sprite(
      Phaser.Math.Between(64, this.scale.width - 64),
      Phaser.Math.Between(64, this.scale.height - 64),
      "star"
    );
    bouncingStar.setGravityY(500);
    bouncingStar.setBounce(0.85);
    bouncingStar.setVelocityY(-200);
    bouncingStar.setCollideWorldBounds(true);
  }

  update(time: number, delta: number): void {
    if (this.keyLeft?.isDown) {
      this.playerStar.setX(this.playerStar.x - 3);
    }
    if (this.keyRight?.isDown) {
      this.playerStar.setX(this.playerStar.x + 3);
    }
    if (this.keyUp?.isDown) {
      this.playerStar.setY(this.playerStar.y - 3);
    }
    if (this.keyDown?.isDown) {
      this.playerStar.setY(this.playerStar.y + 3);
    }
  }
}
