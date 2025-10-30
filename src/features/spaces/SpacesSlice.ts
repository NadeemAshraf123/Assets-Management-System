import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Space {
  id: string;
  branchName: string;
  buildingName: string;
  floorName: string;
  spaceName: string;
  spaceArea: string;
  metaType: string;
  parentSpace: string;
  spaceCondition: string;
  spaceManager: string;
  spaceImage?: string;
}

interface SpacesState {
  spaces: Space[];
  loading: boolean;
  error: string | null;
}

const initialState: SpacesState = {
  spaces: [],
  loading: false,
  error: null,
};

export const fetchSpaces = createAsyncThunk("spaces/fetchSpaces", async () => {
  const res = await axios.get("http://localhost:3001/spaces");
  return res.data;
});


export const addSpace = createAsyncThunk("spaces/addSpace", async (space: Space) => {
  const res = await axios.post("http://localhost:3001/spaces", space);
  return res.data;
});


export const updateSpace = createAsyncThunk(
  "spaces/updateSpace",
  async ({ id, data }: { id: string; data: Partial<Space> }) => {
    const res = await axios.put(`http://localhost:3001/spaces/${id}`, data);
    return res.data;
  }
);


export const deleteSpace = createAsyncThunk("spaces/deleteSpace", async (id: string) => {
  await axios.delete(`http://localhost:3001/spaces/${id}`);
  return id;
});

export const selectSpaceNames = (state: any) =>
  [...new Set(state.spaces.spaces.map((s: Space) => s.spaceName))];

export const selectSpaceManagers = (state: any) =>
  [...new Set(state.spaces.spaces.map((s: Space) => s.spaceManager))];

const spacesSlice = createSlice({
  name: "spaces",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpaces.fulfilled, (state, action) => {
        state.spaces = action.payload;
        state.loading = false;
      })
      .addCase(fetchSpaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch spaces";
      })
      .addCase(addSpace.fulfilled, (state, action) => {
        state.spaces.push(action.payload);
      })
      .addCase(updateSpace.fulfilled, (state, action) => {
        const index = state.spaces.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.spaces[index] = action.payload;
      })
      .addCase(deleteSpace.fulfilled, (state, action) => {
        state.spaces = state.spaces.filter((s) => s.id !== action.payload);
      });
  },
});

export const { clearError } = spacesSlice.actions;
export default spacesSlice.reducer;
