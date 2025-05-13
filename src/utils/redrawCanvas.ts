import { type DrawingComponent } from "../tools/toolTypes";
import { type RootState } from "../store/store";
import store from "../store/store"; // Import the Redux store

/**
 * Redraws all components on the given canvas.
 * @param ctx - The canvas rendering context.
 */
export function redrawCanvas(ctx: CanvasRenderingContext2D | null): void {
  if (!ctx) return;

  // Fetch the components from the Redux store
  const components: DrawingComponent[] = (store.getState() as RootState).drawing.components;

  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Redraw all components
  components.forEach((component) => {
    if (component.type === "rectangle") {
      // Redraw rectangle
      ctx.strokeStyle = component.color;
      ctx.lineWidth = component.strokeWidth;
      ctx.strokeRect(
        component.startPoint.x,
        component.startPoint.y,
        component.endPoint.x - component.startPoint.x,
        component.endPoint.y - component.startPoint.y
      );
    } else if (component.type === "pencil") {
      // Redraw pencil strokes
      ctx.strokeStyle = component.color;
      ctx.lineWidth = component.strokeWidth;
      ctx.beginPath();
      ctx.moveTo(component.points[0].x, component.points[0].y);
      for (let i = 1; i < component.points.length; i++) {
        ctx.lineTo(component.points[i].x, component.points[i].y);
      }
      ctx.stroke();
    }
  });
}