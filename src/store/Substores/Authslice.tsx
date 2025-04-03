import { createSlice, PayloadAction, configureStore } from "@reduxjs/toolkit";
type User = {
  _id: string;
  username: string;
  email: string;
  provider: string | null;
  profilephoto?: string;
  password?: string;
  savedJobs: string[];
};
type Authtype = {
  loggedIn: boolean;
  errorshow: string;
  currentJobs: any[];
  currentPage: number;
  extraOption: string;
  isJobsLoading: boolean;
  totalPages: number;
  UserId: string | null;
  User: User | null;
  advancedShow: boolean;
};

const initialAuthstate: Authtype = {
  loggedIn: false,
  errorshow: "",
  currentJobs: [],
  currentPage: 1,
  extraOption: "Experience (Low to High)",
  isJobsLoading: false,
  totalPages: 0,
  UserId: null,
  User: null,
  advancedShow: false,
};
interface ToggleIDs {
  ID1: string;
  ID2: string;
}

const AuthSlice = createSlice({
  name: "Authentication",
  initialState: initialAuthstate,
  reducers: {
    setAdvancedShow(state, action: PayloadAction<boolean>) {
      state.advancedShow = action.payload;
    },
    changehandler(state, action: PayloadAction<ToggleIDs>) {
      let Jobtitlediv: HTMLElement = document.getElementById(
        action.payload.ID1
      )!;
      let jobinput: HTMLElement = document.getElementById(action.payload.ID2)!;
      if (Jobtitlediv && jobinput) {
        Jobtitlediv.classList.add("hidden");
        jobinput.classList.remove("hidden");
        jobinput.focus();
      }
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.User = action.payload;
    },
    getCookie: {
      reducer(state, action: PayloadAction<string>) {
        return state;
      },
      prepare(cookieName: string) {
        const findCookieValue = () => {
          const name = cookieName + "=";
          const decodedCookie = decodeURIComponent(document.cookie);
          const cookieArray = decodedCookie.split(";");

          for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === " ") {
              cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
              return cookie.substring(name.length, cookie.length);
            }
          }
          return "";
        };

        return {
          payload: findCookieValue(),
        };
      },
    },
    deleteCookie(state, action: PayloadAction<string>) {
      const cookieName = action.payload;

      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    },
    setCookieInMinutes(
      state,
      action: PayloadAction<{
        name: string;
        value: string;
        expirationMinutes: number;
      }>
    ) {
      // console.log("I am working");
      const { name, value, expirationMinutes } = action.payload;
      const date = new Date();
      date.setTime(date.getTime() + expirationMinutes * 60 * 1000);
      const expires = "expires=" + date.toUTCString();
      // console.log(name, value, expirationMinutes);

      document.cookie = `${name}=${value}; ${expires}; path=/;  ${
        JSON.parse(process.env.NEXT_PUBLIC_IS_PRODUCTION!) ? "Secure;" : ""
      }  SameSite=Strict`;
    },

    setCookie(
      state,
      action: PayloadAction<{
        name: string;
        value: string;
        expirationDays: number;
      }>
    ) {
      // console.log("I am working");
      const { name, value, expirationDays } = action.payload;
      const date = new Date();
      date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
      const expires = "expires=" + date.toUTCString();
      // console.log(name, value, expirationDays);

      document.cookie = `${name}=${value}; ${expires}; path=/;  ${
        JSON.parse(process.env.NEXT_PUBLIC_IS_PRODUCTION!) ? "Secure;" : ""
      }  SameSite=Strict`;
    },
    setUserId(state, action: PayloadAction<string | null>) {
      state.UserId = action.payload;
    },
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
