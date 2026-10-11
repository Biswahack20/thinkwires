import { configureStore } from '@reduxjs/toolkit';
import homeReducer from './slices/homeSlice';
import aboutReducer from './slices/aboutSlice';
import blogReducer from './slices/blogSlice';
import contactReducer from './slices/contactSlice';
import industriesReducer from './slices/industriesSlice';
import benchReducer from './slices/benchSlice';

export const store = configureStore({
  reducer: {
    home: homeReducer,
    about: aboutReducer,
    blog: blogReducer,
    contact: contactReducer,
    industries: industriesReducer,
    bench: benchReducer,
  },
});
