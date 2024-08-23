import { Graphics, NOOP } from "pixi.js";
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { IDrawPoint } from "../Stage/Stage";

const RenderPad = forwardRef((_, ref) => {
  const g = useRef<Graphics | null>(null);
 
  //Render Logic
  const drawMousePoints = useCallback((mousePoints: IDrawPoint[]) => {
    if (mousePoints.length === 0) return;

    const pt = mousePoints[mousePoints.length - 1];

    const { x, y } = pt;
    if (pt.command === "move") {
      const { x: lx, y: ly } = mousePoints[mousePoints.length - 2];
      g.current?.moveTo(lx, ly);
      g.current?.lineTo(x, y);
    }
    if (pt.command === "move")
      g.current?.stroke({ width: 4, color: 0x000000, alpha: 1 });
  }, []);
  
 // method to access from parent
  useImperativeHandle(
    ref,
    () => {
      return {
        drawMousePoints,
      };
    },
    [drawMousePoints]
  );

  return <graphics ref={g} draw={NOOP}></graphics>;
});

export default memo(RenderPad);
