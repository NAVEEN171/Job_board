import { createSlice, PayloadAction, configureStore } from "@reduxjs/toolkit";

type Authtype = {
  loggedIn: boolean;
  errorshow: string;
};
const initialAuthstate: Authtype = {
  loggedIn: false,
  errorshow: "",
};

const AuthSlice = createSlice({
  name: "Authentication",
  initialState: initialAuthstate,
  reducers: {
    setloggedIn(state, action: PayloadAction<boolean>) {
      state.loggedIn = action.payload;
    },
    seterrorshow(state, action: PayloadAction<string>) {
      state.errorshow = action.payload;
    },
  },
});

export const Authreducer = AuthSlice.reducer;

export const Authactions = AuthSlice.actions;
