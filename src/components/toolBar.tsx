import React , { useState , useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTool } from "../store/slice/drawingSlice";
import store , { type RootState } from "../store/store";

import { PencilIcon , RectangleIcon ,EllipseIcon } from "../assets/icons";

import "../style/toolbar.css";

const ToolBar: React.FC = () => {
  const dispatch = useDispatch();
  const currentTool = useSelector((state: RootState) => state.drawing.currentTool); // Get the active tool from Redux
  const [ isDrawing , setIsDrawing ] = useState<boolean>(store.getState().drawing.isDrawing); // Get the drawing state from Redux

  const handleToolChange = (tool: string) => {
    dispatch(setCurrentTool(tool)); // Dispatch action to set the active tool
  };

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      setIsDrawing(state.drawing.isDrawing);
    });

    return () => {
      unsubscribe();
    };
  });

  return (
    <div className="toolbar" 
      style={{
        pointerEvents: isDrawing ? "none" : "auto", // Disable interactions when drawing
        opacity: isDrawing ? 0.5 : 1, // Optional: Dim the toolbar when drawing
      }}
    >
      <button
        className={currentTool === "pencil" ? "active" : ""}
        onClick={() => handleToolChange("pencil")}
      >
        <PencilIcon />
      </button>
      <button
        className={currentTool === "rectangle" ? "active" : ""}
        onClick={() => handleToolChange("rectangle")}
      >
        <RectangleIcon />
      </button>
      <button
        className={currentTool === "ellipse" ? "active" : ""}
        onClick={() => handleToolChange("ellipse")}
      >
        <EllipseIcon />
      </button>
    </div>
  );
};

export default ToolBar;