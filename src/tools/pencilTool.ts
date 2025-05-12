import { type BaseDrawingComponent } from "./baseTool";
import { type Point } from "./point";

export interface PencilComponent extends BaseDrawingComponent {
  type: "pencil";
  points: Point[]; // List of points for freehand drawing
}