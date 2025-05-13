import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type DrawingComponent } from "../../tools/toolTypes";

interface DrawingState {
  currentTool: string;
  isDrawing: boolean;
  strokeColor: string;
  components: DrawingComponent[];
  redoStack: DrawingComponent[]; // Stack for redo functionality
}

const initialState: DrawingState = {
  strokeColor: "#FFFFFF", // Default stroke color
  isDrawing: false, // Default drawing state
  currentTool: "pencil", // Default tool
  components: [],
  redoStack: [], // Initialize redo stack as empty
};

const drawingSlice = createSlice({
  name: "drawing",
  initialState,
  reducers: {
    toggleIsDrawing: (state) => {
      state.isDrawing = !state.isDrawing;
    },
    setStrokeColor: (state, action: PayloadAction<string>) => {
      state.strokeColor = action.payload;
    },
    setCurrentTool: (state, action: PayloadAction<string>) => {
      state.currentTool = action.payload;
    },
    addComponent: (state, action: PayloadAction<DrawingComponent>) => {
      state.components.push(action.payload);
      state.redoStack = []; // Clear redo stack when a new component is added
    },
    undo: (state) => {
      if (state.components.length > 0) {
        const lastComponent = state.components.pop(); // Remove the last component
        if (lastComponent) {
          state.redoStack.push(lastComponent); // Add it to the redo stack
        }
      }
    },
    redo: (state) => {
      if (state.redoStack.length > 0) {
        const componentToRedo = state.redoStack.pop(); // Remove the last component from the redo stack
        if (componentToRedo) {
          state.components.push(componentToRedo); // Add it back to the components array
        }
      }
    },
  },
});

export const { addComponent, setCurrentTool, undo, redo } = drawingSlice.actions;

export default drawingSlice.reducer;