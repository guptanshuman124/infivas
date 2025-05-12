import { type BaseDrawingComponent } from "./baseTool";
import { type Point } from "./point";

export interface RectangleComponent extends BaseDrawingComponent {
  type: "rectangle";
  startPoint: Point; // Starting point of the rectangle
  endPoint: Point;   // Ending point of the rectangle
}