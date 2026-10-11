import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const fetchIndustriesPageData = createAsyncThunk(
  'industries/fetchIndustriesPageData',
  async () => {
    const response = await fetch(`${API_BASE}/industries-page`);
    if (!response.ok) {
      throw new Error('Failed to fetch industries page data');
    }
    return response.json();
  }
);

export const fetchSectorCatalog = createAsyncThunk(
  'industries/fetchSectorCatalog',
  async () => {
    const response = await fetch(`${API_BASE}/sector-catalog`);
    if (!response.ok) {
      throw new Error('Failed to fetch sector catalog');
    }
    return response.json();
  }
);

const initialState = {
  hero: null,
  sectorTabs: [],
  sectors: [],
  featureComparison: null,
  caseStudies: null,
  capabilityBriefing: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const industriesSlice = createSlice({
  name: 'industries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch full industries page data
      .addCase(fetchIndustriesPageData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchIndustriesPageData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const data = action.payload || {};
        state.hero = data.hero || null;
        state.sectorTabs = data.sectorTabs || [];
        state.sectors = data.sectors || [];
        state.featureComparison = data.featureComparison || null;
        state.caseStudies = data.caseStudies || null;
        state.capabilityBriefing = data.capabilityBriefing || null;
      })
      .addCase(fetchIndustriesPageData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Sector catalog fetch
      .addCase(fetchSectorCatalog.fulfilled, (state, action) => {
        state.sectors = action.payload || [];
      });
  },
});

export default industriesSlice.reducer;
