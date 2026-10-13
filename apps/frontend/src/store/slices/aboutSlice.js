import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aboutService } from '../../services/aboutService';
import mockAboutData from '../../data/mockdata.json';

export const fallbackAboutData = mockAboutData;

export const fetchAboutData = createAsyncThunk(
  'about/fetchAboutData',
  async () => {
    try {
      const data = await aboutService.getAboutData();
      return data;
    } catch (err) {
      console.warn('aboutService.getAboutData failed:', err.message);
      return { ...mockAboutData, _isMock: true };
    }
  }
);

export const submitConsultation = createAsyncThunk(
  'about/submitConsultation',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await aboutService.submitConsultation(formData);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to submit consultation request.');
    }
  }
);

const aboutSlice = createSlice({
  name: 'about',
  initialState: {
    data: mockAboutData,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    isMockMode: false,
    consultationStatus: 'idle', // 'idle' | 'submitting' | 'succeeded' | 'failed'
    consultationMessage: null,
    bookingRef: null,
    isConsultationMock: false
  },
  reducers: {
    resetConsultationStatus: (state) => {
      state.consultationStatus = 'idle';
      state.consultationMessage = null;
      state.bookingRef = null;
      state.isConsultationMock = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAboutData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.isMockMode = Boolean(action.payload?._isMock);
      })
      .addCase(fetchAboutData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.data = mockAboutData;
        state.isMockMode = true;
      })
      .addCase(submitConsultation.pending, (state) => {
        state.consultationStatus = 'submitting';
        state.consultationMessage = null;
      })
      .addCase(submitConsultation.fulfilled, (state, action) => {
        state.consultationStatus = 'succeeded';
        state.consultationMessage =
          action.payload.message || 'Strategy consultation scheduled successfully!';
        state.bookingRef = action.payload.bookingRef || null;
        state.isConsultationMock = Boolean(action.payload._isMock);
      })
      .addCase(submitConsultation.rejected, (state, action) => {
        state.consultationStatus = 'failed';
        state.consultationMessage =
          action.payload || action.error.message || 'Failed to schedule consultation.';
      });
  }
});

export const { resetConsultationStatus } = aboutSlice.actions;
export default aboutSlice.reducer;
