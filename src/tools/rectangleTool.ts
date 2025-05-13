import { type ToolInterFace } from "./toolInterface";
import { type Point } from "./point";

import { addComponent } from "../store/slice/drawingSlice";
import { type AppDispatch } from "../store/store";
import { redrawCanvas } from "../utils/redrawCanvas";

export class RectangleTool implements ToolInterFace {
  private startPoint: Point | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private dispatch: AppDispatch;
  private id = Date.now().toString();

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

    // Draw the dynamic rectangle
    const width = pos.x - this.startPoint.x;
    const height = pos.y - this.startPoint.y;
    this.ctx?.beginPath();
    if (this.ctx) {
      this.ctx.strokeStyle = "#000000"; // Temporary rectangle color
    }
    if (this.ctx) {
      this.ctx.lineWidth = 2;
    }
    this.ctx?.strokeRect(this.startPoint.x, this.startPoint.y, width, height);

    // Restore the canvas state
    this.ctx?.restore();
  }

  end(pos: Point): void {
    if (!this.startPoint) return;

    // Dispatch the finalized rectangle to Redux
    this.dispatch(
      addComponent({
        id: Date.now().toString(),
        type: "rectangle",
        strokeWidth: 2,
        color: "#000000",
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