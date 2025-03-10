import { createSlice, PayloadAction, configureStore } from "@reduxjs/toolkit";

type Authtype = {
  loggedIn: boolean;
  errorshow: string;
  currentJobs: any[];
  currentPage: number;
  extraOption: string;
  isJobsLoading: boolean;
  totalPages: number;
};

const initialAuthstate: Authtype = {
  loggedIn: false,
  errorshow: "",
  currentJobs: [],
  currentPage: 1,
  extraOption: "Relevance & Date",
  isJobsLoading: false,
  totalPages: 0,
};

const AuthSlice = createSlice({
  name: "Authentication",
  initialState: initialAuthstate,
  reducers: {
    setIsJobsLoading(state, action: PayloadAction<boolean>) {
      state.isJobsLoading = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setCurrentJobs(state, action: PayloadAction<any[]>) {
      state.currentJobs = action.payload;
    },
    setloggedIn(state, action: PayloadAction<boolean>) {
      state.loggedIn = action.payload;
    },
    setTotalPages(state, action: PayloadAction<number>) {
      state.totalPages = action.payload;
    },
    seterrorshow(state, action: PayloadAction<string>) {
      state.errorshow = action.payload;
    },
    setExtraOption(state, action: PayloadAction<string>) {
      state.extraOption = action.payload;
    },
  },
});

export const Authreducer = AuthSlice.reducer;

export const Authactions = AuthSlice.actions;
