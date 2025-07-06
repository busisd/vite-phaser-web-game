import { GameObjects, Input, Scene, Types } from "phaser";

import { EventBus } from "../EventBus";
import { MyGameScene, MyGameScenes } from "../../scenes";

export const isMainMenu = (
  scene: MyGameScene | null | undefined,
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

  playerStar: Types.Physics.Arcade.SpriteWithDynamicBody;

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

    this.keyLeft?.on("down", this.handleArrowKeyInputChange, this);
    this.keyLeft?.on("up", this.handleArrowKeyInputChange, this);
    this.keyRight?.on("down", this.handleArrowKeyInputChange, this);
    this.keyRight?.on("up", this.handleArrowKeyInputChange, this);
    this.keyDown?.on("down", this.handleArrowKeyInputChange, this);
    this.keyDown?.on("up", this.handleArrowKeyInputChange, this);
    this.keyUp?.on("down", this.handleArrowKeyInputChange, this);
    this.keyUp?.on("up", this.handleArrowKeyInputChange, this);

    EventBus.emit("current-scene-ready", this);
  }

  handleArrowKeyInputChange() {
    const xVelocitySign =
      (this.keyLeft?.isDown ? -1 : 0) + (this.keyRight?.isDown ? 1 : 0);
    const yVelocitySign =
      (this.keyDown?.isDown ? 1 : 0) + (this.keyUp?.isDown ? -1 : 0);

    const speed =
      200 / (xVelocitySign !== 0 && yVelocitySign !== 0 ? Math.sqrt(2) : 1);
    this.playerStar.setVelocityX(speed * xVelocitySign);
    this.playerStar.setVelocityY(speed * yVelocitySign);
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
      "star",
    );
    bouncingStar.setGravityY(500);
    bouncingStar.setBounce(0.85);
    bouncingStar.setVelocityY(-200);
    bouncingStar.setCollideWorldBounds(true);
  }
}
