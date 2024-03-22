import { createSlice } from '@reduxjs/toolkit';

const initialState = { value: 0 };

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
});

export const { increment } = appSlice.actions;

export default appSlice.reducer;
