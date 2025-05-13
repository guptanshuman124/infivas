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
      } else {
        console.warn(`Component with id ${action.payload.id} not found.`);
      }
    },
    removeComponent: (state, action: PayloadAction<string>) => {
      console.log("Removing component with id:", action.payload);
      state.components = state.components.filter((comp) => comp.id !== action.payload);
    },
    clearComponents: (state) => {
      console.log("Clearing all components");
      state.components = [];
    },
  },
});

export const { addComponent, updateComponent, removeComponent, clearComponents } =
  drawingSlice.actions;

export const selectComponentById = (state: DrawingState, id: string) =>
  state.components.find((comp) => comp.id === id);

export default drawingSlice.reducer;