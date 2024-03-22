import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    sessionUserId: null,
  },
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    setSessionUserId(state, action) {
      state.sessionUserId = action.payload;
    },
  },
});

export const { setCurrentUser, setSessionUserId } = userSlice.actions;

export default userSlice.reducer;
