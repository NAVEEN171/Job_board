"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { useSearchParams } from "next/navigation";

const page = () => {
  const [errorshow, seterrorshow] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [status, setstatus] = useState<boolean>(false);
  const [token, settoken] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const params = useSearchParams();
  const [showConfirmPassword, setConfirmShowPassword] =
    useState<boolean>(false);
  const [confirmpassword, setconfirmpassword] = useState<string>("");
  console.log("hi");

  useEffect(() => {
    console.log(params);
    if (params && params.has("token")) {
      settoken(params.get("token"));
    }
  }, [params]);
  useEffect(() => {
    console.log(token);
    const fetchData = async () => {
      let response = await fetch(`/api/auth/validate/${token}`);
      let data = await response.json();
      if (response.ok) {
        setstatus(true);
        seterrorshow(data.message);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          seterrorshow("");
        }, 3000);
      } else {
        seterrorshow(data.message);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          seterrorshow("");
        }, 3000);
      }
    };
    if (token) {
      fetchData();
    }
  }, [token]);
  return (
    <div className="h-screen relative  w-full flex bg-gradient-to-r from-indigo-50 via-blue-100 to-purple-100 bg-opacity-90">
      {errorshow && (
        <div
          style={{
            zIndex: 10000,
          }}
          className="   text-lg absolute top-[10px] left-1/2 -translate-x-1/2 border-4 border-white w-fit bg-gradient-to-r from-blue-500/70 to-blue-600/70 py-4  px-8 text-white shadow-2xl rounded-[10px] backdrop-blur-sm"
        >
          {errorshow}
        </div>
      )}
      <div className="w-1/2 h-full  flex items-center justify-center ">
        <div className="bg-gradient-to-br w-fit  flex flex-col gap-[10px] from-white/50  to-white/30 backdrop-blur-xl rounded-3xl  shadow-xl border border-white/50 px-[30px] py-[20px] ">
          <div className="text-[25px] font-bold text-center ">
            Forgot password
          </div>
          <div className="flex gap-[20px] items-center">
            <div className="text-[23px] font-semibold ">Reset password</div>
            <Link href="/">
              <div className=" py-[5px] px-[5px] rounded-lg shadow-md bg-white">
                <Image
                  src="/svgs/backsymbol.svg"
                  width={20}
                  height={20}
                  alt="back"
                />
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-[7px]">
            <div className="text-[15px]  font-medium ">Password</div>
            <div className="relative">
              <input
                id="password"
                onChange={(e) => setpassword(e.target.value)}
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
          <div className="flex flex-col gap-[7px]">
            <div className="text-[15px]  font-medium ">Confirm password</div>
            <div className="relative">
              <input
                id="confirmpassword"
                className="text-lg w-[350px] bg-white/70 pl-[20px] pr-[35px] py-[5px] rounded-lg placeholder-gray-400 focus:ring-2 focus:outline-none focus:ring-blue-400/50 focus:bg-white"
                type={`${showConfirmPassword ? "text" : "password"}`}
                onChange={(e) => setconfirmpassword(e.target.value)}
                placeholder="Password"
              />
              {showConfirmPassword && (
                <IoEyeOutline
                  onClick={() => {
                    setConfirmShowPassword(false);
                  }}
                  className=" cursor-pointer w-[20px] h-[30px] absolute top-1/2 -translate-y-1/2 right-3"
                />
              )}

              {!showConfirmPassword && (
                <IoEyeOffOutline
                  onClick={() => {
                    setConfirmShowPassword(true);
                  }}
                  className=" cursor-pointer w-[20px] h-[30px] absolute top-1/2 -translate-y-1/2 right-3"
                />
              )}
            </div>
          </div>
          <button
            onClick={(e) => {}}
            type="submit"
            disabled={!status}
            className={`text-white ${
              status ? "cursor-pointer" : "cursor-not-allowed"
            } text-[18px] text-center  w-full rounded-[5px] py-[5px] px-[20px]
           bg-gradient-to-r mt-[10px] from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600   font-semibold transition-all duration-300   shadow-lg shadow-blue-500/30 `}
          >
            {status ? "Submit" : "verifying ..."}
          </button>

          <div className="flex items-center gap-[5px] justify-center">
            <div>Already a member ?</div>
            <Link className="text-blue-600" href="/Login">
              Login
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
