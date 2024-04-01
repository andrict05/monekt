import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    sessionUserId: null,
    follows: [],
  },
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    setSessionUserId(state, action) {
      state.sessionUserId = action.payload;
    },
    setSavedPosts(state, action) {
      state.currentUser.savedPosts = action.payload;
    },
    setFollows(state, action) {
      state.follows = action.payload;
    },
  },
});

export const { setCurrentUser, setSessionUserId, setSavedPosts, setFollows } =
  userSlice.actions;

export default userSlice.reducer;
