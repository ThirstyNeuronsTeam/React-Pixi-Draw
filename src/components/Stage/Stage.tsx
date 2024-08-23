/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSize } from "../../hooks/useAppSize";
import { useCallback, useRef } from "react";
import { FederatedPointerEvent, Graphics } from "pixi.js";
import RenderPad from "../RenderPad/RenderPad";

export interface IDrawPoint {
  command: "down" | "move" | "up";
  x: number;
  y: number;
}

const Stage = () => {
  const { width, height } = useAppSize();

  const mouseEventPad = useRef<Graphics | null>(null);
  const maskPad = useRef<Graphics | null>(null);
  const renderPad = useRef<any>(null);

  const mousePoints = useRef<IDrawPoint[]>([]);

  const drawMaskPad = useCallback(
    (g: Graphics) => {
      const w = width - 100;
      const h = height - 100;
      g.clear();
      g.roundRect(-w / 2, -h / 2, w, h, 20);
      g.fill(0xeeeeee);
    },
    [height, width]
  );

  const drawMouseEventPad = useCallback(
    (g: Graphics) => {
      const w = width - 100;
      const h = height - 100;
      g.clear();
      g.roundRect(-w / 2, -h / 2, w, h, 20);
      g.fill(0xeeeeee);
    },
    [height, width]
  );

  const onPointerMove = useCallback(
    (e: FederatedPointerEvent) => {
      mousePoints.current.push({
        command: "move",
        x: e.client.x - width / 2,
        y: e.client.y - height / 2,
      });
      //Rendering method called here
      renderPad.current?.drawMousePoints(mousePoints.current);
    },
    [height, width]
  );

  const onPointerUp = useCallback(() => {
    mouseEventPad.current?.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("blur", onPointerUp);
    mousePoints.current.push({
      command: "up",
      x: 0,
      y: 0,
    });
    //Rendering method called here
    renderPad.current?.drawMousePoints(mousePoints.current);
  }, [onPointerMove]);

  const onPointerDown = useCallback(
    (e: FederatedPointerEvent) => {
      const g = e.target;
      mousePoints.current.push({
        command: "down",
        x: e.client.x - width / 2,
        y: e.client.y - height / 2,
      });
      //Rendering method called here
      renderPad.current?.drawMousePoints(mousePoints.current);
      g.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
      window.addEventListener("blur", onPointerUp);
    },
    [height, onPointerMove, onPointerUp, width]
  );

  return (
    <container
      position={{ x: width / 2, y: height / 2 }}
      mask={maskPad?.current}
    >
      {/* Mask Pad : To hide the overflow */}
      <graphics ref={maskPad} draw={drawMaskPad}></graphics>

      {/* Mouse Event Pad : To recieve the moouse events */}
      <graphics
        ref={mouseEventPad}
        draw={drawMouseEventPad}
        eventMode={"dynamic"}
        onPointerDown={(e: FederatedPointerEvent) => onPointerDown(e)}
      ></graphics>


      {/* Render Pad : To render curve using the collected mouse points */}
      <container>
        <RenderPad ref={renderPad}></RenderPad>
      </container>
    </container>
  );
};

export default Stage;
