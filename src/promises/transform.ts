import { MotionValue, animate, easeOut } from "framer-motion";

export const animatePromise = (
  motionValueRef: MotionValue,
  value: number,
  duration: number,
  aborter: AbortAnimations
) => {
  return new Promise((resolve, reject) => {
    const controls = animate(motionValueRef, value, {
      duration,
      ease : easeOut,
      onComplete: () => {
        resolve(true);
      },
    });

    const stop = () => {
      controls.stop();
      reject("aborted");
    };

    aborter.push({ stop });
  });
};

export interface ITransformOptions {
  aborter: AbortAnimations;
}

export const transform = (
  animationDatas: [MotionValue, number, number][],
  options: ITransformOptions
) => {
  options.aborter.clear();
  return new Promise((resolve, reject) => {
    Promise.all(
      animationDatas.map((animationData) =>
        animatePromise(
          animationData[0],
          animationData[1],
          animationData[2],
          options.aborter
        )
      )
    )
      .then(resolve)
      .catch((e)=>reject(e));
  });
};

export interface IControls {
  stop: () => void;
}

export class AbortAnimations {
  animations: IControls[] = [];
  push(animation: IControls) {
    this.animations.push(animation);
  }
  abort() {
    this.animations.forEach((animation) => animation.stop());
    this.clear();
  }
  clear() {
    this.animations = [];
  }
}
