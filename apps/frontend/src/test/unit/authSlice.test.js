import { describe, it, expect } from 'vitest';
import authReducer, {
  clearAuthError,
  clearSuccessMessage,
  checkAuthSession,
  loginUser,
  logoutUser,
} from '../../store/slices/authSlice';

describe('authSlice reducer', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    isInitializing: true,
    loading: false,
    error: null,
    successMessage: null,
  };

  it('should return initial state when passed undefined', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearAuthError', () => {
    const previousState = { ...initialState, error: 'Invalid credentials' };
    expect(authReducer(previousState, clearAuthError())).toEqual({
      ...initialState,
      error: null,
    });
  });

  it('should handle clearSuccessMessage', () => {
    const previousState = {
      ...initialState,
      successMessage: 'Profile updated',
    };
    expect(authReducer(previousState, clearSuccessMessage())).toEqual({
      ...initialState,
      successMessage: null,
    });
  });

  describe('checkAuthSession extraReducers', () => {
    it('sets isInitializing true on pending', () => {
      const state = authReducer(initialState, checkAuthSession.pending(''));
      expect(state.isInitializing).toBe(true);
    });

    it('sets user and isAuthenticated true on fulfilled', () => {
      const mockCandidate = {
        id: 'c123',
        email: 'candidate@thinkwires.com',
        name: 'Jane Doe',
      };
      const state = authReducer(
        initialState,
        checkAuthSession.fulfilled(mockCandidate, '')
      );
      expect(state.isInitializing).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockCandidate);
      expect(state.error).toBeNull();
    });

    it('sets isAuthenticated false on rejected', () => {
      const state = authReducer(
        initialState,
        checkAuthSession.rejected(new Error('Unauthenticated'), '')
      );
      expect(state.isInitializing).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe('loginUser extraReducers', () => {
    it('sets loading true and clears error on pending', () => {
      const previousState = { ...initialState, error: 'Previous error' };
      const state = authReducer(
        previousState,
        loginUser.pending('', { email: 'test@example.com', password: 'secret' })
      );
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('sets user and isAuthenticated on fulfilled', () => {
      const mockUser = { id: 'c123', email: 'test@example.com' };
      const state = authReducer(
        initialState,
        loginUser.fulfilled(mockUser, '', {
          email: 'test@example.com',
          password: 'secret',
        })
      );
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
    });

    it('sets error on rejected', () => {
      const state = authReducer(initialState, {
        type: loginUser.rejected.type,
        payload: 'Invalid password',
      });
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('Invalid password');
    });
  });

  describe('logoutUser extraReducers', () => {
    it('clears user and sets isAuthenticated false on fulfilled', () => {
      const loggedInState = {
        ...initialState,
        isAuthenticated: true,
        user: { id: 'c123', name: 'Jane' },
      };
      const state = authReducer(loggedInState, logoutUser.fulfilled(true, ''));
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });
  });
});
