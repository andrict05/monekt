import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import userReducer from './userSlice';

export default configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
  },
});
