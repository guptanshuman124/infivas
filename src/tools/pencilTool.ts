import { type ToolInterFace } from "./toolInterface";
import { type Point } from "./point";

import { addComponent } from "../store/slice/drawingSlice";
import { type AppDispatch } from "../store/store";

export class PencilTool implements ToolInterFace {
  private points: Point[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private dispatch: AppDispatch;

  constructor(ctx: CanvasRenderingContext2D | null, dispatch: AppDispatch) {
    this.ctx = ctx;
    this.dispatch = dispatch;
  }

  start(pos: Point): void {
    this.points = [pos];
    this.ctx?.beginPath();
    this.ctx?.moveTo(pos.x, pos.y);
  }

  draw(pos: Point): void {
    this.points.push(pos);
    this.ctx?.lineTo(pos.x, pos.y);
    this.ctx?.stroke();
  }

  end() :void {
    this.dispatch(
      addComponent({
        id: Date.now().toString(),
        type: "pencil",
        strokeWidth: 2,
        color: "#000000",
        points: this.points,
      })
    );
    this.points = [];
  }
};