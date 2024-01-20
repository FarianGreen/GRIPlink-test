import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TloginType, loginUser } from "../api/api-constants";

interface loginInitialState {
  isLogined: boolean;
  error: string;
  autorizadedUser: string | null;
  haveError: boolean;
}

export const sendLoginData = createAsyncThunk(
  "sendLoginData",
  async function (loginData: TloginType, { rejectWithValue }) {
    const response = await loginUser(loginData);
    if (!response.ok) {
      return rejectWithValue(await response.json());
    }
    const data = (await response.json()) as TloginType;

    return data;
  }
);

const initialState: loginInitialState = {
  isLogined: Boolean(localStorage.getItem("user")),
  error: "",
  autorizadedUser: localStorage.getItem("user"),
  haveError: false,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setActiveModalError: (state, action) => {
      state.haveError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendLoginData.fulfilled, (state, action) => {
        state.error = "Вход выполнен успешно";
        const { email } = action.payload;
        localStorage.setItem("user", JSON.stringify({ email }));
        state.isLogined = true;
      })
      .addCase(sendLoginData.rejected, (state) => {
        state.error = "Неверный логин или пароль";
        state.haveError = true;
      });
  },
});
export const { setActiveModalError } = loginSlice.actions;
export const loginReducer = loginSlice.reducer;