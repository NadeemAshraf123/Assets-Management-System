import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Building {
  id: number;
  name: string;
  branchId: number;
  branchName?: string;
  type: string;
  floors: number;
  address: string;
  status?: boolean;
  description?: string;
  latitude?: number;
  longitude?: number;
}

interface BuildingsState {
  buildings: Building[];
  loading: boolean;
  error: string | null;
}

const initialState: BuildingsState = {
  buildings: [],
  loading: false,
  error: null,
};

const BASE_URL = 'http://localhost:3001/buildings';


export const fetchBuildings = createAsyncThunk('buildings/fetchBuildings', async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data as Building[];
  } catch (error) {
    throw new Error('Failed to fetch buildings');
  }
});


export const addBuilding = createAsyncThunk('buildings/addBuilding', async (building: Omit<Building, 'id'>) => {
  try {
    const response = await axios.post(BASE_URL, building);
    return response.data as Building;
  } catch (error) {
    throw new Error('Failed to add building');
  }
});


export const updateBuilding = createAsyncThunk(
  'buildings/updateBuilding',
  async ({ id, data }: { id: number; data: Partial<Building> }) => {
    try {
      const response = await axios.patch(`${BASE_URL}/${id}`, data);
      return response.data as Building;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Building not found');
      }
      throw new Error('Failed to update building');
    }
  }
);


export const deleteBuilding = createAsyncThunk('buildings/deleteBuilding', async (id: number) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return id;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Building not found');
    }
    throw new Error('Failed to delete building');
  }
});

const buildingsSlice = createSlice({
  name: 'buildings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchBuildings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuildings.fulfilled, (state, action: PayloadAction<Building[]>) => {
        state.loading = false;
        state.buildings = action.payload;
      })
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch buildings';
      })

      
      .addCase(addBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBuilding.fulfilled, (state, action: PayloadAction<Building>) => {
        state.loading = false;
        state.buildings.push(action.payload);
      })
      .addCase(addBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add building';
      })

    
      .addCase(updateBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBuilding.fulfilled, (state, action: PayloadAction<Building>) => {
        state.loading = false;
        const index = state.buildings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.buildings[index] = action.payload;
        }
      })
      .addCase(updateBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update building';
      })

    
      .addCase(deleteBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBuilding.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.buildings = state.buildings.filter(b => b.id !== action.payload);
      })
      .addCase(deleteBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete building';
      });
  },
});

export const { clearError } = buildingsSlice.actions;
export default buildingsSlice.reducer;