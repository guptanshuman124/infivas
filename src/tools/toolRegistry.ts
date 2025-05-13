import { PencilTool } from "./PencilTool";
import { RectangleTool } from "./RectangleTool";
import { type ToolInterFace } from "./toolInterface";
import { type AppDispatch } from "../store/store";

export class ToolRegistry {
  private tools: Record<string, ToolInterFace> = {};

  constructor(
    private ctx: CanvasRenderingContext2D,
    private dispatch: AppDispatch
  ) {
    // Initialize tools
    this.tools["pencil"] = new PencilTool(ctx, dispatch);
    this.tools["rectangle"] = new RectangleTool(ctx, dispatch);
  }

  getTool(toolName: string): ToolInterFace | null {
    return this.tools[toolName] || null;
  }
}