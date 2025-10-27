import { configureStore } from "@reduxjs/toolkit";
import branchesReducer   from  '../features/branches/BranchesSlice';
import buildingsReducer from '../features/building/BuildingSlice';



export const store = configureStore({
    reducer: {
        branches: branchesReducer,
        buildings: buildingsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

