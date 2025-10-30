import { configureStore } from "@reduxjs/toolkit";
import branchesReducer   from  '../features/branches/BranchesSlice';
import buildingsReducer from '../features/building/BuildingSlice';
import floorsReducer from "../features/floors/FloorsSlice";
import spacesReducer from "../features/spaces/SpacesSlice"



export const store = configureStore({
    reducer: {
        branches: branchesReducer,
        buildings: buildingsReducer,
        floors:   floorsReducer,
        spaces: spacesReducer,

    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


