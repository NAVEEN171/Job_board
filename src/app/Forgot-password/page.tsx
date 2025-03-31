"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState, useRef } from "react";
import { FormEvent } from "react";

const page = () => {
  const router = useRouter();

  const [email, setemail] = useState<string>("");
  const [errorshow, seterrorshow] = useState<string>("");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const submitHandler = async (e: FormEvent) => {
    if (!email.trim().length) {
      seterrorshow(" Email field is empty");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        seterrorshow("");
      }, 3000);
    } else if (!email.includes("@")) {
      seterrorshow(" Enter a valid email address");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        seterrorshow("");
      }, 3000);
    } else {
      let response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      let data = await response.json();
      console.log(data);
      if (response.ok) {
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
    }
  };
  return (
    <div className="h-screen relative w-full px-3 flex bg-gradient-to-r from-indigo-50 via-blue-100 to-purple-100 bg-opacity-90">
      {errorshow && (
        <div
          style={{
            zIndex: 10000,
          }}
          className="text-lg xs:text-base absolute top-[10px] left-1/2 -translate-x-1/2 border-4 border-white w-fit bg-gradient-to-r from-blue-500/70 to-blue-600/70 py-4 px-8 text-white shadow-2xl rounded-[10px] backdrop-blur-sm"
        >
          {errorshow}
        </div>
      )}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center">
        <div className="bg-gradient-to-br w-[90%] sm:w-fit flex flex-col gap-[10px] from-white/50 to-white/30 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 px-[15px] sm:px-[30px] py-[20px]">
          <div className="text-[20px] sm:text-[25px] font-bold text-center">
            Forgot password
          </div>
          <div className="flex gap-[20px] items-center">
            <div className="text-[20px] sm:text-[23px] font-semibold">
              Enter email
            </div>
            <button
              onClick={() => {
                router.back();
              }}
            >
              <div className="py-[5px] px-[5px] rounded-lg shadow-md bg-white">
                <Image
                  src="/svgs/backsymbol.svg"
                  width={20}
                  height={20}
                  alt="back"
                />
              </div>
            </button>
          </div>

          <div className="flex flex-col gap-[7px]">
            <div className="text-[15px] font-medium">Email</div>
            <input
              className="text-lg w-full sm:w-[350px] bg-white/70 px-[20px] py-[5px] rounded-lg placeholder-gray-400 focus:ring-2 focus:outline-none focus:ring-blue-400/50 focus:bg-white"
              type="text"
              onChange={(e) => setemail(e.target.value)}
              placeholder="Email"
            />
          </div>

          <button
            onClick={(e) => {
              submitHandler(e);
            }}
            type="submit"
            className={`text-white text-[16px] sm:text-[18px] text-center w-full rounded-[5px] py-[5px] px-[20px]
           bg-gradient-to-r mt-[10px] from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30`}
          >
            Send
          </button>

          <div className="flex items-center gap-[5px] justify-center">
            <div className="text-sm sm:text-base">Already a member ?</div>
            <Link className="text-blue-600 text-sm sm:text-base" href="/Login">
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden md:flex w-1/2 h-full justify-center items-center">
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
