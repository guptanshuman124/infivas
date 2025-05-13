import { type ToolInterFace } from "./toolInterface";
import { type Point } from "./point";

import { addComponent } from "../store/slice/drawingSlice";
import store, { type AppDispatch } from "../store/store";
import { redrawCanvas } from "../utils/redrawCanvas";

export class ArrowTool implements ToolInterFace {
  private startPoint: Point | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private dispatch: AppDispatch;
  private strokeColor: string = store.getState().drawing.strokeColor;

  constructor(ctx: CanvasRenderingContext2D | null, dispatch: AppDispatch) {
    this.ctx = ctx;
    this.dispatch = dispatch;
  }

  start(pos: Point): void {
    // Set the starting point for the arrow
    this.startPoint = pos;
  }

  draw(pos: Point): void {
    if (!this.startPoint || !this.ctx) return;

    // Save the current canvas state
    this.ctx.save();

    // Redraw the canvas to avoid overlapping shapes
    redrawCanvas(this.ctx);

    // Draw the arrow line
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = 2;
    this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();

    // Draw the arrowhead
    this.drawArrowhead(this.startPoint, pos);

    // Restore the canvas state
    this.ctx.restore();
  }

  end(pos: Point): void {
    if (!this.startPoint || !this.ctx) return;

    // calculate the length of the arrow
    const arrowLength = Math.sqrt(
      Math.pow(pos.x - this.startPoint.x, 2) + Math.pow(pos.y - this.startPoint.y, 2)
    );

    if(arrowLength < 10){
      this.startPoint = null;
      redrawCanvas(this.ctx);
      return;
    }; // Ignore if the arrow is too short

    // Dispatch the finalized arrow to Redux
    this.dispatch(
      addComponent({
        id: Date.now().toString(),
        type: "arrow",
        strokeWidth: 2,
        color: this.strokeColor,
        startPoint: this.startPoint,
        endPoint: pos,
        arrowLength: 10,
      })
    );

    // Clear the start point
    this.startPoint = null;

    // Redraw the canvas to include the finalized arrow
    redrawCanvas(this.ctx);
  }

  private drawArrowhead(start: Point, end: Point): void {
    if (!this.ctx) return;

    const angle = Math.atan2(end.y - start.y, end.x - start.x); // Calculate the angle of the line
    const arrowLength = 10; // Length of the arrowhead

    // Calculate the points for the arrowhead
    const arrowPoint1 = {
      x: end.x - arrowLength * Math.cos(angle - Math.PI / 6),
      y: end.y - arrowLength * Math.sin(angle - Math.PI / 6),
    };

    const arrowPoint2 = {
      x: end.x - arrowLength * Math.cos(angle + Math.PI / 6),
      y: end.y - arrowLength * Math.sin(angle + Math.PI / 6),
    };

    // Draw the arrowhead
    this.ctx.beginPath();
    this.ctx.moveTo(end.x, end.y);
    this.ctx.lineTo(arrowPoint1.x, arrowPoint1.y);
    this.ctx.lineTo(arrowPoint2.x, arrowPoint2.y);
    this.ctx.closePath();
    this.ctx.fillStyle = this.strokeColor;
    this.ctx.fill();
  }
}