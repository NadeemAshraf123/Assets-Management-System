import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import axios from 'axios';

export interface Branch {
  id: number;
  name: string;
  manager: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  country?: string;
  status?: boolean;
  groundMaintenance?: boolean;
}


interface BranchesState {
  branches: Branch[];
  loading: boolean;
  error: string | null;
}

const initialState: BranchesState = {
  branches: [],
  loading: false,
  error: null,
};

const BASE_URL = 'http://localhost:3001/branches';


export const fetchBranches = createAsyncThunk('branches/fetchBranches', async () => {
  const response = await axios.get(BASE_URL);
  return response.data as Branch[];
});


export const deleteBranch = createAsyncThunk('branches/deleteBranch', async (id: number) => {
  await axios.delete(`${BASE_URL}/${id}`);
  return id;
});


export const updateBranch = createAsyncThunk(
  'branches/updateBranch',
  async ({ id, data }: { id: number; data: Partial<Branch> }) => {
    const response = await axios.patch(`${BASE_URL}/${id}`, data);
    return response.data as Branch;
  }
);


export const addBranch = createAsyncThunk('branches/addBranch', async (branch: Omit<Branch, 'id'>) => {
  const response = await axios.post(BASE_URL, branch);
  return response.data as Branch;
});

const branchesSlice = createSlice({
  name: 'branches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action: PayloadAction<Branch[]>) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch branches';
      })

      
      .addCase(deleteBranch.fulfilled, (state, action: PayloadAction<number>) => {
        state.branches = state.branches.filter((b) => b.id !== action.payload);
      })

    
      .addCase(updateBranch.fulfilled, (state, action: PayloadAction<Branch>) => {
        const index = state.branches.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) state.branches[index] = action.payload;
      })

      
      .addCase(addBranch.fulfilled, (state, action: PayloadAction<Branch>) => {
        state.branches.push(action.payload);
      });
  },
});

export default branchesSlice.reducer;
