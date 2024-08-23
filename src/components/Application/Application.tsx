import { Application, extend } from "@pixi/react";
import {
  Container,
  Graphics,
} from "pixi.js";
import { createContext, useCallback, useRef, useState } from "react";
import Stage from "../Stage/Stage";

extend({
  Container,
  Graphics,
});


export const AppSizeContext = createContext<{
  appSize: { width: number; height: number };
}>({
  appSize: { width: 0, height: 0 },
});

export type AppSize = { width: number; height: number };

const GameApplication = () => {


  const parentRef = useRef<HTMLDivElement | null>(null);
  const [appSize, setAppSize] = useState<AppSize>({ width: 0, height: 0 });


  const onParentRefLoaded = useCallback(() => {
    const el: HTMLDivElement = parentRef.current as HTMLDivElement;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setAppSize({
          width: entry.contentBoxSize[0].inlineSize,
          height: entry.contentBoxSize[0].blockSize,
        });
      }
    });

    if (el) {
      console.log("app size");
      setAppSize({
        width: el.clientWidth,
        height: el.clientHeight,
      });
      resizeObserver.observe(el);
    }
  }, []);

  return (
    <div className="Game" ref={parentRef}>
      <Application
        backgroundColor={0xffffff}
        onInit={onParentRefLoaded}
        resizeTo={parentRef}
        roundPixels={true}
        antialias={true}
      >
        <AppSizeContext.Provider
          value={{ appSize: appSize }}
        >
          <Stage></Stage>
        </AppSizeContext.Provider>
      </Application>
    </div>
  );
};

export default GameApplication;
