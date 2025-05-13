import { addComponent } from "../store/slice/drawingSlice";
import { type Point } from "./point";
import { type ToolInterFace } from "./toolInterface";
import store , { type AppDispatch } from "../store/store";
import { redrawCanvas } from "../utils/redrawCanvas";

export class EllipseTool implements ToolInterFace {
  private ctx: CanvasRenderingContext2D | null = null;
  private dispatch: AppDispatch;
  private startPoint: Point | null = null;
  private strokecolor:string =store.getState().drawing.strokeColor;

  constructor(ctx: CanvasRenderingContext2D | null, dispatch: AppDispatch) {
    this.ctx = ctx;
    this.dispatch = dispatch;
  }

  start(pos: Point): void {
    this.startPoint = pos; // Set the starting point for the ellipse
    this.ctx?.beginPath(); // Begin a new path for the ellipse
  }

  draw(pos: Point): void {
    if (!this.startPoint || !this.ctx) return;

    const centerX = (this.startPoint.x + pos.x) / 2;
    const centerY = (this.startPoint.y + pos.y) / 2;
    const radiusX = Math.abs(pos.x - this.startPoint.x) / 2;
    const radiusY = Math.abs(pos.y - this.startPoint.y) / 2;

    // Save the current canvas state
    this.ctx?.save();
    
    // Clear the canvas and redraw existing components
    redrawCanvas(this.ctx);

    // Draw the ellipse
    this.ctx.beginPath();
    this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    this.ctx.strokeStyle = this.strokecolor; // Ellipse outline color
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Restore the canvas state
    this.ctx.restore();
  }

  end(pos: Point): void {
    if (!this.startPoint || !this.ctx) return;

    const centerX = (this.startPoint.x + pos.x) / 2;
    const centerY = (this.startPoint.y + pos.y) / 2;
    const radiusX = Math.abs(pos.x - this.startPoint.x) / 2;
    const radiusY = Math.abs(pos.y - this.startPoint.y) / 2;

    // Finalize the ellipse and dispatch it to the Redux store
    this.dispatch(
      addComponent({
        id: Date.now().toString(),
        type: "ellipse",
        center: { x: centerX, y: centerY },
        radiusX,
        radiusY,
        strokeWidth: 2,
        color: this.strokecolor,
      })
    );

    // Clear the starting point
    this.startPoint = null;
  }
}