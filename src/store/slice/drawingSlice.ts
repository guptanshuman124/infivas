import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type DrawingComponent } from "../../tools/toolTypes";

interface DrawingState {
  components: DrawingComponent[];
}

const initialState: DrawingState = {
  components: [],
};

const drawingSlice = createSlice({
  name: "drawing",
  initialState,
  reducers: {
    addComponent: (state, action: PayloadAction<DrawingComponent>) => {
      console.log("Adding component:", action.payload);
      state.components.push(action.payload);
    },
    updateComponent: (
      state,
      action: PayloadAction<{ id: string; props: Partial<DrawingComponent> }>
    ) => {
      const component = state.components.find((comp) => comp.id === action.payload.id);
      if (component) {
        Object.assign(component, action.payload.props);
      }
    },
    removeComponent: (state, action: PayloadAction<string>) => {
      state.components = state.components.filter((comp) => comp.id !== action.payload);
    },
  },
});

export const { addComponent, updateComponent, removeComponent } = drawingSlice.actions;
export default drawingSlice.reducer;