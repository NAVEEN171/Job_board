import { createSlice, PayloadAction, configureStore } from "@reduxjs/toolkit";

type Authtype = {
  loggedIn: boolean;
};
const initialAuthstate: Authtype = {
  loggedIn: false,
};

const AuthSlice = createSlice({
  name: "Authentication",
  initialState: initialAuthstate,
  reducers: {
    setloggedIn(state, action: PayloadAction<boolean>) {
      state.loggedIn = action.payload;
    },
  },
});

export const Authreducer = AuthSlice.reducer;

export const Authactions = AuthSlice.actions;
