import { type ToolInterFace } from "./toolInterface";
import { type Point } from "./point";

import { addComponent } from "../store/slice/drawingSlice";
import store , { type AppDispatch } from "../store/store";
import { redrawCanvas } from "../utils/redrawCanvas";

export class LineTool implements ToolInterFace {
  private startPoint: Point | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private dispatch: AppDispatch;
  private strokecolor:string =store.getState().drawing.strokeColor;

  constructor(
    ctx: CanvasRenderingContext2D | null,
    dispatch: AppDispatch,
  ) {
    this.ctx = ctx;
    this.dispatch = dispatch;
  }

  start(pos: Point): void {
    // Set the starting point for the rectangle
    this.startPoint = pos;
  }

  draw(pos: Point): void {
    if (!this.startPoint) return;

    // Save the current canvas state
    this.ctx?.save();

    redrawCanvas(this.ctx);

    this.ctx?.beginPath();
    if (this.ctx) {
      this.ctx.strokeStyle = this.strokecolor;
    }
    if (this.ctx) {
      this.ctx.lineWidth = 2;
    }
    
    this.ctx?.moveTo(this.startPoint.x, this.startPoint.y);
    this.ctx?.lineTo(pos.x, pos.y);
    this.ctx?.stroke();

    // Restore the canvas state
    this.ctx?.restore();
  }

  end(pos: Point): void {
    if (!this.startPoint) return;

    // Dispatch the finalized rectangle to Redux
    this.dispatch(
      addComponent({
        id: Date.now().toString(),
        type: "line",
        strokeWidth: 2,
        color: this.strokecolor,
        startPoint: this.startPoint,
        endPoint: pos,
      })
    );

    // Clear the start point
    this.startPoint = null;

    // Redraw the canvas to include the finalized rectangle
    redrawCanvas(this.ctx);
  }
}