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
    } else if (component.type === "ellipse") {
      // Redraw ellipse
      ctx.strokeStyle = component.color;
      ctx.lineWidth = component.strokeWidth;
      ctx.beginPath();
      ctx.ellipse(
        component.center.x,
        component.center.y,
        component.radiusX,
        component.radiusY,
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }else if (component.type === "line") {
      // Redraw line
      ctx.strokeStyle = component.color;
      ctx.lineWidth = component.strokeWidth;
      ctx.beginPath();
      ctx.moveTo(component.startPoint.x, component.startPoint.y);
      ctx.lineTo(component.endPoint.x, component.endPoint.y);
      ctx.stroke();
    }else if (component.type === "arrow") {
      // Redraw arrow
      ctx.strokeStyle = component.color;
      ctx.lineWidth = component.strokeWidth;
      ctx.beginPath();
      ctx.moveTo(component.startPoint.x, component.startPoint.y);
      ctx.lineTo(component.endPoint.x, component.endPoint.y);
      ctx.stroke();

      // Draw arrowhead
      const angle = Math.atan2(
        component.endPoint.y - component.startPoint.y,
        component.endPoint.x - component.startPoint.x
      );
      const arrowLength = component.arrowLength || 10; // Default arrow length
      const arrowAngle = Math.PI / 6; // 30 degrees

      ctx.beginPath();
      ctx.moveTo(component.endPoint.x, component.endPoint.y);
      ctx.lineTo(
        component.endPoint.x - arrowLength * Math.cos(angle - arrowAngle),
        component.endPoint.y - arrowLength * Math.sin(angle - arrowAngle)
      );
      ctx.moveTo(component.endPoint.x, component.endPoint.y);
      ctx.lineTo(
        component.endPoint.x - arrowLength * Math.cos(angle + arrowAngle),
        component.endPoint.y - arrowLength * Math.sin(angle + arrowAngle)
      );
      ctx.stroke();
    }
  });
}