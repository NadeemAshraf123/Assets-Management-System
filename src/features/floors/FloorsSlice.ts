import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:3001/floors";


export const fetchFloors = createAsyncThunk("floors/fetchFloors", async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
});

export const addFloor = createAsyncThunk("floors/addFloor", async (floorData) => {
  const res = await axios.post(BASE_URL, floorData);
  return res.data;
});


export const updateFloor = createAsyncThunk("floors/updateFloor", async ({ id, data }) => {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
});


export const deleteFloor = createAsyncThunk("floors/deleteFloor", async (id: string) => {
  await axios.delete(`${BASE_URL}/${id}`);
  return id;
});


export const selectFloorNames = (state) => state.floors.floors.map((f) => f.floorName);
export const selectBuildingTypes = (state) => [...new Set(state.floors.floors.map((f) => f.buildingName))];


const floorsSlice = createSlice({
  name: "floors",
  initialState: {
    floors: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFloors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFloors.fulfilled, (state, action) => {
        state.floors = action.payload;
        state.loading = false;
      })
      .addCase(fetchFloors.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(addFloor.fulfilled, (state, action) => {
        state.floors.push(action.payload);
      })
      .addCase(updateFloor.fulfilled, (state, action) => {
        const id = action.payload.id || action.payload.floorId;
        const index = state.floors.findIndex(
          (f) => f.id === id || f.floorId === id
        );
        if (index !== -1) state.floors[index] = action.payload;
      })
      .addCase(deleteFloor.fulfilled, (state, action) => {
        state.floors = state.floors.filter(
          (f) => f.id !== action.payload && f.floorId !== action.payload
        );
      });
  },
});

export const { clearError } = floorsSlice.actions;
export default floorsSlice.reducer;
