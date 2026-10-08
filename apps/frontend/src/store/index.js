import { configureStore } from '@reduxjs/toolkit';
import homeReducer from './slices/homeSlice';
import aboutReducer from './slices/aboutSlice';
import blogReducer from './slices/blogSlice';

export const store = configureStore({
  reducer: {
    home: homeReducer,
    about: aboutReducer,
    blog: blogReducer,
  },
});
