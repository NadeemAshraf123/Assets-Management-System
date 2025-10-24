import { configureStore } from "@reduxjs/toolkit";
import branchesReducer   from  '../features/branches/BranchesSlice';


export const store = configureStore({
    reducer: {
        branches: branchesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

