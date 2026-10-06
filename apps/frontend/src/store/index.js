import { configureStore } from '@reduxjs/toolkit';
import homeReducer from './slices/homeSlice';
import blogReducer from './slices/blogSlice';

export const store = configureStore({
  reducer: {
    home: homeReducer,
    blog: blogReducer,
  },
});

