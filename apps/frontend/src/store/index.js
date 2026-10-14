import { configureStore } from '@reduxjs/toolkit';
import homeReducer from './slices/homeSlice';
import aboutReducer from './slices/aboutSlice';
import blogReducer from './slices/blogSlice';
import contactReducer from './slices/contactSlice';
import industriesReducer from './slices/industriesSlice';
import benchReducer from './slices/benchSlice';
import payrollReducer from './slices/payrollSlice';
import eorReducer from './slices/eorSlice';
import staffAugmentationReducer from './slices/staffAugmentationSlice';
import permanentStaffingReducer from './slices/permanentStaffingSlice';
import findTalentReducer from './slices/findTalentSlice';
import candidatePortalReducer from './slices/candidatePortalSlice';

export const store = configureStore({
  reducer: {
    home: homeReducer,
    about: aboutReducer,
    blog: blogReducer,
    contact: contactReducer,
    industries: industriesReducer,
    bench: benchReducer,
    payroll: payrollReducer,
    eor: eorReducer,
    staffAugmentation: staffAugmentationReducer,
    permanentStaffing: permanentStaffingReducer,
    findTalent: findTalentReducer,
    candidatePortal: candidatePortalReducer,
  },
});
