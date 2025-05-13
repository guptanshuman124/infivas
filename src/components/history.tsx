import React , { useState , useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { undo, redo } from "../store/slice/drawingSlice";
import store , { type RootState } from "../store/store";
import "../style/history.css";

import { UndoIcon, RedoIcon } from "../assets/icons";

const HistoryBar: React.FC = () => {
  const dispatch = useDispatch();
  const [ isDrawing , setIsDrawing ] = useState<boolean>(store.getState().drawing.isDrawing); // Get the drawing state from Redux

  // Select components and redoStack from Redux state
  const components = useSelector((state: RootState) => state.drawing.components);
  const redoStack = useSelector((state: RootState) => state.drawing.redoStack);

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
    <div className="historybar"
      style={{
        pointerEvents: isDrawing ? "none" : "auto", // Disable interactions when drawing
        opacity: isDrawing ? 0.5 : 1, // Optional: Dim the toolbar when drawing
      }}
    >
      <button
        onClick={() => dispatch(undo())}
        disabled={components.length === 0} // Disable if no components to undo
        className={components.length === 0 ? "disabled" : ""}
      >
        <UndoIcon />
      </button>
      <button
        onClick={() => dispatch(redo())}
        disabled={redoStack.length === 0} // Disable if no components to redo
        className={redoStack.length === 0 ? "disabled" : ""}
      >
        <RedoIcon />
      </button>
    </div>
  );
};

export default HistoryBar;