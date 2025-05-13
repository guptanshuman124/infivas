import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type DrawingComponent } from "../../tools/toolTypes";

interface DrawingState {
  currentTool: string;
  components: DrawingComponent[];
}

const initialState: DrawingState = {
  currentTool: "pencil", // Default tool
  components: [],
};

const drawingSlice = createSlice({
  name: "drawing",
  initialState,
  reducers: {
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