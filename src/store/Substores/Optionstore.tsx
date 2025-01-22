import { createSlice, PayloadAction, configureStore } from "@reduxjs/toolkit";

type OptionStateType = {
  visa: boolean;
  remote: boolean;
  NoExperience: boolean;
  NoSalary: boolean;
};

const initialOptionState: OptionStateType = {
  visa: false,
  remote: false,
  NoExperience: false,
  NoSalary: false,
};

const OptionsSlice = createSlice({
  name: "Options",
  initialState: initialOptionState,
  reducers: {
    setVisa(state, action: PayloadAction<boolean>) {
      state.visa = action.payload;
    },
    setRemote(state, action: PayloadAction<boolean>) {
      state.remote = action.payload;
    },
    setNoExperience(state, action: PayloadAction<boolean>) {
      state.NoExperience = action.payload;
    },
    setNoSalary(state, action: PayloadAction<boolean>) {
      state.NoSalary = action.payload;
    },
  },
});

export const OptionsSliceReducer = OptionsSlice.reducer;

export const OptionActions = OptionsSlice.actions;
