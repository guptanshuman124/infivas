import React from "react";
import { useDispatch } from "react-redux";
import { setCurrentTool } from "../store/slice/drawingSlice";

const Toolbar: React.FC = () => {
  const dispatch = useDispatch();

  const handleToolChange = (tool: string) => {
    dispatch(setCurrentTool(tool));
  };

  return (
    <div className="toolbar">
      <button onClick={() => handleToolChange("pencil")}>Pencil</button>
      <button onClick={() => handleToolChange("rectangle")}>Rectangle</button>
    </div>
  );
};

export default Toolbar;