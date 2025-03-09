import store from "@/store";
import { useRouter } from "next/navigation";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const router = useRouter();
  type RootState = ReturnType<typeof store.getState>;

  const loggedIn = useSelector((state: RootState) => state.Auth.loggedIn);
  return (
    <div className="h-[100px] w-full flex items-center justify-center">
      <div className="w-[90%]  flex flex-row justify-between ">
        <h2 className="bg-[linear-gradient(180deg,_#0ca3f3_25%,_#098ee7_75%)] font-[700] text-[1.6rem]  bg-clip-text text-transparent cursor-pointer">
          FlexiBoard
        </h2>
        <div className="flex  flex-row gap-[10px]">
          {loggedIn && (
            <Fragment>
              <button className=" px-[20px] py-[10px] bg-[#eef8ff] text-[#4aa3fa] text-[1rem] font-[600] hover:text-white hover:bg-[#4aa3fa] rounded-[8px]">
                Account
              </button>
              <button className="px-[20px] py-[10px] bg-[#eef8ff] text-[#4aa3fa] text-[1rem] font-[600] hover:text-white hover:bg-[#4aa3fa] rounded-[8px]">
                Log out
              </button>
            </Fragment>
          )}
          {!loggedIn && (
            <Fragment>
              <button className=" px-[20px] py-[10px] bg-[#eef8ff] text-[#4aa3fa] text-[1rem] font-[600] hover:text-white hover:bg-[#4aa3fa] rounded-[8px]">
                Add Job
              </button>
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
