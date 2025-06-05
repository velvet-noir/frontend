import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  isStaff: boolean | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isStaff: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(
      state,
      action: PayloadAction<{
        isAuthenticated: boolean;
        isStaff: boolean | null;
      }>,
    ) {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isStaff = action.payload.isStaff;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.isStaff = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
