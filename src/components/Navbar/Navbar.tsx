import store from "@/store";
import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Authactions } from "@/store/Substores/Authslice";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const loggedIn = useSelector((state: RootState) => state.Auth.loggedIn);
  return (
    <div className="h-[100px] w-full flex items-center justify-center">
      <div className="w-[90%] flex flex-row justify-between items-center">
        <h2
          onClick={() => {
            router.push("/");
          }}
          className="bg-[linear-gradient(180deg,_#0ca3f3_25%,_#098ee7_75%)] font-bold text-2xl bg-clip-text text-transparent cursor-pointer"
        >
          FlexiBoard
        </h2>

        {/* Hamburger menu for xs screens */}
        <div className="xs:block hidden">
          <button
            onClick={toggleMenu}
            className="flex flex-col justify-center items-center w-10 h-10 rounded hover:bg-sky-500 group"
          >
            <div
              className={`w-6 h-0.5 bg-[#4aa3fa] group-hover:bg-white mb-1.5 transition-all ${
                isOpen
                  ? "transform rotate-45 translate-y-2 opacity-100"
                  : "opacity-100"
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-[#4aa3fa] group-hover:bg-white mb-1.5 transition-all ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-[#4aa3fa] group-hover:bg-white transition-all ${
                isOpen
                  ? "transform -rotate-45 -translate-y-2 opacity-100"
                  : "opacity-100"
              }`}
            ></div>
          </button>
        </div>

        <div
          className={`fixed top-0 left-0 h-screen w-3/5 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col gap-4 p-4">
            <h2
              onClick={() => {
                router.push("/");
              }}
              className="bg-[linear-gradient(180deg,_#0ca3f3_25%,_#098ee7_75%)] mt-5 font-bold text-2xl bg-clip-text text-transparent cursor-pointer"
            >
              FlexiBoard
            </h2>
            {loggedIn && (
              <Fragment>
                <button
                  onClick={() => {
                    router.push("/Account");
                    setIsOpen(false);
                  }}
                  className="px-[20px] py-[10px] xs:text-center bg-[#eef8ff] text-[#4aa3fa] text-[1rem] font-[600] hover:text-white hover:bg-[#4aa3fa] rounded-[8px] text-left"
                >
                  Account
                </button>
                <button
                  onClick={() => {
                    logoutHandler();
                    setIsOpen(false);
                  }}
                  className="px-[20px] py-[10px] xs:text-center bg-[#eef8ff] text-[#4aa3fa] text-[1rem] font-[600] hover:text-white hover:bg-[#4aa3fa] rounded-[8px] text-left"
                >
                  Log out
                </button>
              </Fragment>
            )}
            {!loggedIn && (
              <Fragment>
                <button
                  onClick={() => {
                    router.push("/Signup");
                    setIsOpen(false);
                  }}
                  className="px-[20px] xs:text-center py-[10px] bg-[#eef8ff] text-[#4aa3fa] text-[1rem] font-[600] hover:text-white hover:bg-[#4aa3fa] rounded-[8px] text-left"
                >
                  Sign up
                </button>
                <button
                  onClick={() => {
                    router.push("/Login");
                    setIsOpen(false);
                  }}
                  className="px-[20px] xs:text-center py-[10px] bg-[#eef8ff] text-[#4aa3fa] text-[1rem] font-[600] hover:text-white hover:bg-[#4aa3fa] rounded-[8px] text-left"
                >
                  Login
                </button>
              </Fragment>
            )}
          </div>
        </div>

        {/* Regular nav buttons for md screens and above */}
        <div className="xs:hidden flex flex-row gap-[10px]">
          {loggedIn && (
            <Fragment>
              <button
                onClick={() => {
                  router.push("/Account");
                }}
                className="px-[20px] py-[10px] bg-[#eef8ff] text-[#4aa3fa] text-[1rem] font-[600] hover:text-white hover:bg-[#4aa3fa] rounded-[8px]"
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
              <button
                onClick={() => {
                  router.push("/Signup");
                }}
                className="px-[20px] py-[10px] bg-[#eef8ff] text-[#4aa3fa] text-[1rem] font-[600] hover:text-white hover:bg-[#4aa3fa] rounded-[8px]"
              >
                Sign up
              </button>
              <button
                onClick={() => {
                  router.push("/Login");
                }}
                className="px-[20px] py-[10px] bg-[#eef8ff] text-[#4aa3fa] text-[1rem] font-[600] hover:text-white hover:bg-[#4aa3fa] rounded-[8px]"
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
