import React, { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ToolRegistry } from "../tools/toolRegistry";
import { type Point } from "../tools/point";

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [toolRegistry, setToolRegistry] = useState<ToolRegistry | null>(null);
  const [currentTool, setCurrentTool] = useState<"pencil" | "rectangle">("rectangle");
  const [isDrawing, setIsDrawing] = useState(false); // State to track if the user is drawing
  const dispatch = useDispatch();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setCtx(ctx);

    // Initialize ToolRegistry once
    const registry = new ToolRegistry(ctx, dispatch);
    setToolRegistry(registry);
  }, [dispatch]);

  const getMousePos = (e: MouseEvent): Point => {
    const rect = canvasRef.current?.getBoundingClientRect();
    return {
      x: e.clientX - (rect?.left || 0),
      y: e.clientY - (rect?.top || 0),
    };
  };

  const startDrawing = (e: MouseEvent) => {
    const pos = getMousePos(e);
    const tool = toolRegistry?.getTool(currentTool);
    tool?.start(pos);
    setIsDrawing(true); // Set drawing state to true
  };

  const draw = (e: MouseEvent) => {
    if (!isDrawing) return; // Only draw if the user is actively drawing
    const pos = getMousePos(e);
    const tool = toolRegistry?.getTool(currentTool);
    tool?.draw(pos);
  };

  const endDrawing = (e: MouseEvent) => {
    if (!isDrawing) return; // Only finalize if the user was drawing
    const pos = getMousePos(e);
    const tool = toolRegistry?.getTool(currentTool);
    tool?.end(pos);
    setIsDrawing(false); // Reset drawing state
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDrawing);
    canvas.addEventListener("mouseout", endDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endDrawing);
      canvas.removeEventListener("mouseout", endDrawing);
    };
  }, [toolRegistry, currentTool, isDrawing]);

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setCurrentTool("pencil")}>Pencil</button>
        <button onClick={() => setCurrentTool("rectangle")}>Rectangle</button>
      </div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ border: "1px solid #ccc", display: "block" }}
      />
    </div>
  );
};

export default Canvas;