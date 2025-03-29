import store from "@/store";
import { useRouter } from "next/navigation";
import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Authactions } from "@/store/Substores/Authslice";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  type RootState = ReturnType<typeof store.getState>;

  const logoutHandler = () => {
    dispatch(Authactions.setUserId(null));
    dispatch(Authactions.setloggedIn(false));
    let userToken = dispatch(Authactions.getCookie("userId")).payload;
    if (userToken) {
      dispatch(Authactions.deleteCookie("userId"));
    }
    let AccessToken = dispatch(Authactions.getCookie("accessToken")).payload;
    if (AccessToken) {
      dispatch(Authactions.deleteCookie("accessToken"));
    }
    let RefreshToken = dispatch(Authactions.getCookie("refreshToken")).payload;
    if (RefreshToken) {
      dispatch(Authactions.deleteCookie("refreshToken"));
    }
  };

  const loggedIn = useSelector((state: RootState) => state.Auth.loggedIn);
  return (
    <div className="h-[100px] w-full flex items-center justify-center">
      <div className="w-[90%]  flex flex-row justify-between ">
        <h2
          onClick={() => {
            router.push("/");
          }}
          className="bg-[linear-gradient(180deg,_#0ca3f3_25%,_#098ee7_75%)] font-bold text-[1.6rem]  bg-clip-text text-transparent cursor-pointer"
        >
          FlexiBoard
        </h2>
        <div className="flex  flex-row gap-[10px]">
          {loggedIn && (
            <Fragment>
              <button
                onClick={() => {
                  router.push("/Account");
                }}
                className=" px-[20px] py-[10px] bg-[#eef8ff] text-[#4aa3fa] text-[1rem] font-[600] hover:text-white hover:bg-[#4aa3fa] rounded-[8px]"
              >
                Account
              </button>
              <button
                onClick={() => {
                  logoutHandler();
                }}
                className="px-[20px] py-[10px] bg-[#eef8ff] text-[#4aa3fa] text-[1rem] font-[600] hover:text-white hover:bg-[#4aa3fa] rounded-[8px]"
              >
                Log out
              </button>
            </Fragment>
          )}
          {!loggedIn && (
            <Fragment>
              {/* <button className=" px-[20px] py-[10px] bg-[#eef8ff] text-[#4aa3fa] text-[1rem] font-[600] hover:text-white hover:bg-[#4aa3fa] rounded-[8px]">
                Add Job
              </button> */}
              <button
                onClick={() => {
                  router.push("/Signup");
                }}
                className=" px-[20px] py-[10px] bg-[#eef8ff] text-[#4aa3fa] text-[1rem] font-[600] hover:text-white hover:bg-[#4aa3fa] rounded-[8px]"
              >
                Sign up
              </button>
              <button
                onClick={() => {
                  router.push("/Login");
                }}
                className=" px-[20px] py-[10px] bg-[#eef8ff] text-[#4aa3fa] text-[1rem] font-[600] hover:text-white hover:bg-[#4aa3fa] rounded-[8px]"
              >
                Login
              </button>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
