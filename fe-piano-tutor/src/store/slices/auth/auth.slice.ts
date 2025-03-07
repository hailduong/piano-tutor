import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {resetPassword, requestPasswordReset, loginUser, registerUser} from 'store/slices/auth/auth.thunks'

export interface IAuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: IAuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    // Register user
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
    // Login user
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
    // Request password reset
    builder.addCase(requestPasswordReset.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(requestPasswordReset.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(requestPasswordReset.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
    // Reset password
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(resetPassword.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
