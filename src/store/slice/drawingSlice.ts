import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type DrawingComponent } from "../../tools/toolTypes";

interface DrawingState {
  currentTool: string;
  isDrawing: boolean;
  strokeColor: string;
  components: DrawingComponent[];
}

const initialState: DrawingState = {
  strokeColor: "#FFFFFF", // Default stroke color
  isDrawing: false, // Default drawing state
  currentTool: "pencil", // Default tool
  components: [], 
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
    }
  },
});

export const { addComponent ,setCurrentTool } = drawingSlice.actions;

export default drawingSlice.reducer;