import React, { useRef, useEffect, useState } from "react";
import { useDispatch , useSelector } from "react-redux";
import { ToolRegistry } from "../tools/toolRegistry";
import { type Point } from "../tools/point";
import store , { type RootState } from "../store/store";

import '../style/canvas.css';
import { redrawCanvas } from "../utils/redrawCanvas";

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [toolRegistry, setToolRegistry] = useState<ToolRegistry | null>(null);
  const [currentTool, setcurrentTool] = useState<string>(store.getState().drawing.currentTool); // Get the current tool from the Redux store
  const [isDrawing, setIsDrawing] = useState(store.getState().drawing.isDrawing); // State to track if the user is drawing
  const components = useSelector((state: RootState) => state.drawing.components);
  const dispatch = useDispatch();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize ToolRegistry once
    const registry = new ToolRegistry(ctx, dispatch);
    setToolRegistry(registry);
  }, [dispatch])

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      setcurrentTool(state.drawing.currentTool);
      setIsDrawing(state.drawing.isDrawing);
    });

    return () => {
      unsubscribe();
    };
  });

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    redrawCanvas(ctx); // Redraw the canvas with the updated components
  },[components]);

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
    dispatch({ type: "drawing/toggleIsDrawing" }); // Dispatch action to update drawing state in Redux store
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
    dispatch({ type: "drawing/toggleIsDrawing" }); // Dispatch action to update drawing state in Redux store
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
  }, [toolRegistry, currentTool , isDrawing]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
};

export default Canvas;