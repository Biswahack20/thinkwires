import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:5000/api';

export const fetchTechStack = createAsyncThunk(
  'home/fetchTechStack',
  async () => {
    const response = await fetch(`${API_BASE}/tech-stack`);
    return await response.json();
  }
);

export const fetchOpenings = createAsyncThunk(
  'home/fetchOpenings',
  async () => {
    const response = await fetch(`${API_BASE}/openings`);
    return await response.json();
  }
);

export const fetchStats = createAsyncThunk('home/fetchStats', async () => {
  const response = await fetch(`${API_BASE}/stats`);
  return await response.json();
});

export const fetchIndustries = createAsyncThunk(
  'home/fetchIndustries',
  async () => {
    const response = await fetch(`${API_BASE}/industries`);
    return await response.json();
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    techStack: [],
    openings: [],
    stats: {
      jobsFilled: 0,
      corePlacements: 0,
      contingentHired: 0,
      clientRetention: 0,
    },
    industries: [],
    status: {
      techStack: 'idle',
      openings: 'idle',
      stats: 'idle',
      industries: 'idle',
    },
    errors: {
      techStack: null,
      openings: null,
      stats: null,
      industries: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Tech Stack
      .addCase(fetchTechStack.pending, (state) => {
        state.status.techStack = 'loading';
      })
      .addCase(fetchTechStack.fulfilled, (state, action) => {
        state.status.techStack = 'succeeded';
        state.techStack = action.payload;
      })
      .addCase(fetchTechStack.rejected, (state, action) => {
        state.status.techStack = 'failed';
        state.errors.techStack = action.error.message;
      })
      // Openings
      .addCase(fetchOpenings.pending, (state) => {
        state.status.openings = 'loading';
      })
      .addCase(fetchOpenings.fulfilled, (state, action) => {
        state.status.openings = 'succeeded';
        state.openings = action.payload;
      })
      .addCase(fetchOpenings.rejected, (state, action) => {
        state.status.openings = 'failed';
        state.errors.openings = action.error.message;
      })
      // Stats
      .addCase(fetchStats.pending, (state) => {
        state.status.stats = 'loading';
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.status.stats = 'succeeded';
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.status.stats = 'failed';
        state.errors.stats = action.error.message;
      })
      // Industries
      .addCase(fetchIndustries.pending, (state) => {
        state.status.industries = 'loading';
      })
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.status.industries = 'succeeded';
        state.industries = action.payload;
      })
      .addCase(fetchIndustries.rejected, (state, action) => {
        state.status.industries = 'failed';
        state.errors.industries = action.error.message;
      });
  },
});

export default homeSlice.reducer;
