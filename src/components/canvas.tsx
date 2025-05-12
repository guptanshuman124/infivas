import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComponent } from "../store/slice/drawingSlice";
import { type RootState } from "../store/store";
import { type Point } from "../tools/point";

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentTool, setCurrentTool] = useState<"pencil" | "rectangle">("pencil");
  const dispatch = useDispatch();
  const components = useSelector((state: RootState) => state.drawing.components);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setCtx(ctx);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";

    const getMousePos = (e: MouseEvent): Point => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const redrawCanvas = () => {
      if (!ctx) return;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Redraw all components from the Redux store
      components.forEach((component) => {
        if (component.type === "pencil") {
          ctx.beginPath();
          ctx.lineWidth = component.strokeWidth;
          ctx.strokeStyle = component.color;
          component.points.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
        } else if (component.type === "rectangle") {
          const { startPoint, endPoint, strokeWidth, color } = component;
          ctx.beginPath();
          ctx.lineWidth = strokeWidth;
          ctx.strokeStyle = color;
          ctx.strokeRect(
            startPoint.x,
            startPoint.y,
            endPoint.x - startPoint.x,
            endPoint.y - startPoint.y
          );
          ctx.stroke();
        }
      });
    };

    const handlePencilStart = (pos: Point) => {
      setCurrentPoints([pos]);
      ctx?.beginPath();
      ctx?.moveTo(pos.x, pos.y);
    };

    const handlePencilDraw = (pos: Point) => {
      setCurrentPoints((prev) => [...prev, pos]);
      ctx?.lineTo(pos.x, pos.y);
      ctx?.stroke();
    };

    const handlePencilEnd = () => {
      dispatch(
        addComponent({
          id: Date.now().toString(),
          type: "pencil",
          strokeWidth: 2,
          color: "#000000",
          points: currentPoints,
        })
      );
      setCurrentPoints([]);
    };

    const handleRectangleStart = (pos: Point) => {
      setStartPoint(pos);
    };

    const handleRectangleDraw = (pos: Point) => {
      if (!startPoint || !ctx) return;

      // Save the current canvas state
      ctx.save();

      // Redraw the existing components
      redrawCanvas();

      // Draw the dynamic rectangle
      const width = pos.x - startPoint.x;
      const height = pos.y - startPoint.y;
      ctx.beginPath();
      ctx.strokeStyle = "#000000"; // Temporary rectangle color
      ctx.strokeRect(startPoint.x, startPoint.y, width, height);

      // Restore the canvas state
      ctx.restore();
    };

    const handleRectangleEnd = (pos: Point) => {
      if (!startPoint) return;

      // Dispatch the rectangle to Redux
      dispatch(
        addComponent({
          id: Date.now().toString(),
          type: "rectangle",
          strokeWidth: 2,
          color: "#000000",
          startPoint,
          endPoint: pos,
        })
      );

      // Clear the start point
      setStartPoint(null);
    };

    const startDrawing = (e: MouseEvent) => {
      const pos = getMousePos(e);
      setIsDrawing(true);

      if (currentTool === "pencil") {
        handlePencilStart(pos);
      } else if (currentTool === "rectangle") {
        handleRectangleStart(pos);
      }
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;

      const pos = getMousePos(e);

      if (currentTool === "pencil") {
        handlePencilDraw(pos);
      } else if (currentTool === "rectangle") {
        handleRectangleDraw(pos);
      }
    };

    const endDrawing = (e: MouseEvent) => {
      if (!isDrawing) return;

      setIsDrawing(false);
      const pos = getMousePos(e);

      if (currentTool === "pencil") {
        handlePencilEnd();
      } else if (currentTool === "rectangle") {
        handleRectangleEnd(pos);
      }
    };

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
  }, [ctx, isDrawing, currentPoints, startPoint, currentTool, dispatch, components]);

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