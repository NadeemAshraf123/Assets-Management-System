import { configureStore } from "@reduxjs/toolkit";
import branchesReducer   from  '../features/branches/BranchesSlice';
import buildingsReducer from '../features/building/BuildingSlice';
import floorsReducer from "../features/floors/FloorsSlice";



export const store = configureStore({
    reducer: {
        branches: branchesReducer,
        buildings: buildingsReducer,
        floors:   floorsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

