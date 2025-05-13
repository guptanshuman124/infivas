import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { undo, redo } from "../store/slice/drawingSlice";
import { type RootState } from "../store/store";
import "../style/history.css";

import { UndoIcon, RedoIcon } from "../assets/icons";

const HistoryBar: React.FC = () => {
  const dispatch = useDispatch();

  // Select components and redoStack from Redux state
  const components = useSelector((state: RootState) => state.drawing.components);
  const redoStack = useSelector((state: RootState) => state.drawing.redoStack);

  return (
    <div className="historybar">
      {/* Undo Button */}
      <button
        onClick={() => dispatch(undo())}
        disabled={components.length === 0} // Disable if no components to undo
        className={components.length === 0 ? "disabled" : ""}
      >
        <UndoIcon />
      </button>

      {/* Redo Button */}
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