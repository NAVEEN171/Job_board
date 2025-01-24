"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

const page = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="h-[100vh] w-full flex bg-gradient-to-r from-indigo-50 via-blue-100 to-purple-100 bg-opacity-90">
      <div className="w-1/2 h-full  flex items-center justify-center ">
        <div className="bg-gradient-to-br w-fit  flex flex-col gap-[10px] from-white/50  to-white/30 backdrop-blur-xl rounded-3xl  shadow-xl border border-white/50 px-[30px] py-[20px] ">
          <div className="text-[25px] font-bold text-center ">
            Welcome to FlexiBoard
          </div>
          <div className="text-[23px] font-semibold ">Log In</div>
          <div className="flex flex-col gap-[7px]">
            <div className="text-[15px] font-medium">Email</div>
            <input
              className="text-lg w-[350px] bg-white/70 px-[20px] py-[5px] rounded-lg placeholder-gray-400 focus:ring-2 focus:outline-none focus:ring-blue-400/50 focus:bg-white"
              type="text"
              placeholder="Email"
            />
          </div>
          <div className="flex flex-col gap-[7px]">
            <div className="text-[15px]  font-medium ">Password</div>
            <div className="relative">
              <input
                id="password"
                className="text-lg w-[350px] bg-white/70 pl-[20px] pr-[35px] py-[5px] rounded-lg placeholder-gray-400 focus:ring-2 focus:outline-none focus:ring-blue-400/50 focus:bg-white"
                type={`${showPassword ? "text" : "password"}`}
                placeholder="Password"
              />
              {showPassword && (
                <IoEyeOutline
                  onClick={() => {
                    setShowPassword(false);
                  }}
                  className=" cursor-pointer w-[20px] h-[30px] absolute top-1/2 -translate-y-1/2 right-3"
                />
              )}

              {!showPassword && (
                <IoEyeOffOutline
                  onClick={() => {
                    setShowPassword(true);
                  }}
                  className=" cursor-pointer w-[20px] h-[30px] absolute top-1/2 -translate-y-1/2 right-3"
                />
              )}
            </div>
          </div>
          <div className="flex  justify-between items-center my-[10px]">
            <div className="flex gap-[5px] items-center">
              <input type="checkbox"></input>
              <div className="">Remember me</div>
            </div>
            <div className="text-blue-600">Forgot password ?</div>
          </div>
          <button
            className="text-white text-[18px] text-center  w-full rounded-[5px] py-[5px] px-[20px]
           bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600   font-semibold transition-all duration-300   shadow-lg shadow-blue-500/30 "
          >
            Login
          </button>
          <button className="flex gap-[5px] mt-[10px]  w-full items-center bg-white/50 hover:bg-white/70 border border-2 border-gray-200 justify-center rounded-[5px] py-[5px] px-[20px]">
            <Image
              src="/Images/google.png"
              width={24}
              height={24}
              alt="google"
            />
            <div className="text-[18px] font-semibold">Log In with Google</div>
          </button>
          <div className="flex items-center gap-[5px] justify-center">
            <div>not a member ?</div>
            <Link className="text-blue-600" href="/Signup">
              Signup
            </Link>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-full flex justify-center items-center">
        <Image
          className="w-[90%] h-[70%] rounded-[20px]"
          src="/Images/loginphoto.jpg"
          width={400}
          height={400}
          alt="loginphoto"
        />
      </div>
    </div>
  );
};

export default page;
