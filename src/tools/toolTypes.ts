// Base type for all drawing components
export interface BaseDrawingComponent {
  id: string;
  type: string; // Tool type (e.g., "pencil", "rectangle")
  strokeWidth: number;
  color: string;
}

// Specific type for the Pencil tool
export interface PencilComponent extends BaseDrawingComponent {
  type: "pencil";
  points: { x: number; y: number }[]; // Array of points for freehand drawing
}

// Specific type for the Rectangle tool
export interface RectangleComponent extends BaseDrawingComponent {
  type: "rectangle";
  startPoint: { x: number; y: number }; // Starting point of the rectangle
  endPoint: { x: number; y: number };   // Ending point of the rectangle
}

// Specific type for the Ellipse tool
export interface EllipseComponent extends BaseDrawingComponent {
  type: "ellipse";
  center: { x: number; y: number }; // Center point of the ellipse
  radiusX: number;                 // Horizontal radius
  radiusY: number;                 // Vertical radius
}

// Union type for all drawing components
export type DrawingComponent = PencilComponent | RectangleComponent | EllipseComponent;