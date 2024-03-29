import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TloginType, loginUser } from "../api/api-constants";

interface loginInitialState {
  isLogined: boolean;
  error: string;
  autorizadedUser: string | null;
  haveError: boolean;
  data: Object | null;
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
  isLogined: Boolean(localStorage.getItem("userToken")),
  error: "",
  autorizadedUser: localStorage.getItem("userToken"),
  haveError: false,
  data: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setActiveModalError: (state, action) => {
      state.haveError = action.payload;
    },
    logOut: (state) => {
      state.isLogined = false;
      localStorage.removeItem("userToken");
      state.error = "";
      state.haveError = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendLoginData.fulfilled, (state, action) => {
        state.error = "Вход выполнен успешно";
        state.data = action.payload;
        localStorage.setItem("userToken", JSON.stringify(state.data));
        state.isLogined = true;
      })
      .addCase(sendLoginData.rejected, (state) => {
        state.error = "Неверный логин или пароль";
        state.haveError = true;
      });
  },
});
export const { setActiveModalError, logOut } = loginSlice.actions;
export const loginReducer = loginSlice.reducer;
