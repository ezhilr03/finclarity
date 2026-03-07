import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { authApi, type AuthPayload, type RegisterInput, type LoginInput } from "@/services/api";

interface AuthState {
  user: AuthPayload | null;
  loading: boolean;
  error: string | null;
}

const storedUser = localStorage.getItem("finclarity_user");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  loading: false,
  error: null,
};

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data: RegisterInput, { rejectWithValue }) => {
    try {
      const res = await authApi.register(data);
      localStorage.setItem("finclarity_token", res.token);
      localStorage.setItem("finclarity_user", JSON.stringify(res));
      return res;
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data: LoginInput, { rejectWithValue }) => {
    try {
      const res = await authApi.login(data);
      localStorage.setItem("finclarity_token", res.token);
      localStorage.setItem("finclarity_user", JSON.stringify(res));
      return res;
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem("finclarity_token");
      localStorage.removeItem("finclarity_user");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerThunk.fulfilled, (state, action: PayloadAction<AuthPayload>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<AuthPayload>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
