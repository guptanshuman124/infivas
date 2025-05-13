import { PencilTool } from "./pencilTool";
import { RectangleTool } from "./rectangleTool";
import { EllipseTool } from "./ellipseTool";
import { LineTool } from "./lineTool";
import { ArrowTool } from "./arrowTool";
import { type ToolInterFace } from "./toolInterface";
import { type AppDispatch } from "../store/store";

export class ToolRegistry {
  private tools: Record<string, ToolInterFace> = {};

  constructor(
    ctx: CanvasRenderingContext2D,
    dispatch: AppDispatch
  ) {
    // Initialize tools
    this.tools["pencil"] = new PencilTool(ctx, dispatch);
    this.tools["rectangle"] = new RectangleTool(ctx, dispatch);
    this.tools["ellipse"] = new EllipseTool(ctx, dispatch);
    this.tools["line"] = new LineTool(ctx, dispatch);
    this.tools["arrow"] = new ArrowTool(ctx, dispatch);
  }

  getTool(toolName: string): ToolInterFace | null {
    return this.tools[toolName] || null;
  }
}