"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { signIn, signOut, useSession } from "next-auth/react";
import { FormEvent } from "react";

const page = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setConfirmShowPassword] =
    useState<boolean>(false);
  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [confirmpassword, setconfirmpassword] = useState<string>("");
  const [username, setusername] = useState<string>("");

  type signupErrorstype = {
    emailerror: String;
    passworderror: String;
    confirmpassworderror: String;
    usernameerror: String;
    [key: string]: String;
  };
  const signupErrors: signupErrorstype = {
    emailerror: "",
    passworderror: "",
    confirmpassworderror: "",
    usernameerror: "",
  };
  const [errors, setErrors] = useState<signupErrorstype>(signupErrors);
  const validateFields = (): {
    updatedErrors: signupErrorstype;
    isValid: boolean;
  } => {
    let updatedErrors: signupErrorstype = { ...errors };
    if (
      email.trim() === "" ||
      password === "" ||
      confirmpassword === "" ||
      username === ""
    ) {
      updatedErrors.emailerror = "Some fields are empty";
      setErrors(updatedErrors);
      setTimeout((prevErrors: any) => {
        setErrors({ ...prevErrors, emailerror: "" });
      }, 4000);
      return { updatedErrors, isValid: false };
    } else {
      if (!email.includes("@") && email.trim().length > 0) {
        updatedErrors.emailerror = "Email id should contain @";
      }
      if (password.trim().length < 8) {
        updatedErrors.passworderror = "Password should be atleast 8 characters";
      }
      if (password.length > 7 && password !== confirmpassword) {
        updatedErrors.confirmpassworderror = "Passwords do not match";
      }
      if (username.trim().length < 3) {
        updatedErrors.usernameerror = "Username should be atleast 3 characters";
      }
      setErrors(updatedErrors);
      setTimeout((prevErrors: any) => {
        setErrors({
          ...prevErrors,
          emailerror: "",
          passworderror: "",
          confirmpassworderror: "",
          usernameerror: "",
        });
      }, 4000);
      return { updatedErrors, isValid: false };
    }
    return { updatedErrors, isValid: true };
  };
  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    const { updatedErrors, isValid } = validateFields();
    console.log(isValid);
    if (!isValid) {
    }
  };

  return (
    <div className="h-[100vh] relative w-full flex bg-gradient-to-r from-indigo-50 via-blue-100 to-purple-100 bg-opacity-90">
      <div className="errorsshower w-full absolute top-2 flex flex-col items-center  gap-[10px]">
        {errors.usernameerror && (
          <div
            style={{
              zIndex: 10000,
            }}
            className=" text-lg border-4 border-white  w-fit bg-gradient-to-r from-blue-500/70 to-blue-600/70 py-4  px-8 text-white shadow-2xl rounded-[10px] backdrop-blur-sm"
          >
            {errors.usernameerror}
          </div>
        )}
        {errors.emailerror && (
          <div
            style={{
              zIndex: 10000,
            }}
            className="left-1/2 text-lg  border-4 border-white  w-fit bg-gradient-to-r from-blue-500/70 to-blue-600/70 py-4  px-8 text-white shadow-2xl rounded-[10px] backdrop-blur-sm"
          >
            {errors.emailerror}
          </div>
        )}
        {errors.passworderror && (
          <div
            style={{
              zIndex: 10000,
            }}
            className="  left-1/2 text-lg  border-4  border-white w-fit bg-gradient-to-r from-blue-500/70 to-blue-600/70 py-4  px-8 text-white shadow-2xl rounded-[10px] backdrop-blur-sm"
          >
            {errors.passworderror}
          </div>
        )}
        {errors.confirmpassworderror && (
          <div
            style={{
              zIndex: 10000,
            }}
            className="   left-1/2 text-lg   border-4 border-white w-fit bg-gradient-to-r from-blue-500/70 to-blue-600/70 py-4  px-8 text-white shadow-2xl rounded-[10px] backdrop-blur-sm"
          >
            {errors.confirmpassworderror}
          </div>
        )}
      </div>
      <div className="w-1/2 h-full  flex items-center justify-center ">
        <div className="bg-gradient-to-br w-fit  flex flex-col gap-[10px] from-white/50  to-white/30 backdrop-blur-xl rounded-3xl  shadow-xl border border-white/50 px-[30px] py-[20px] ">
          <div className="text-[25px] font-bold text-center ">
            Welcome to FlexiBoard
          </div>
          <div className="flex gap-[20px] items-center">
            <div className="text-[23px] font-semibold ">Sign Up</div>
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
            <div className="text-[15px] font-medium">User Name</div>
            <input
              className="text-lg w-[350px] bg-white/70 px-[20px] py-[5px] rounded-lg placeholder-gray-400 focus:ring-2 focus:outline-none focus:ring-blue-400/50 focus:bg-white"
              type="text"
              onChange={(e) => setusername(e.target.value)}
              placeholder="User Name"
            />
          </div>
          <div className="flex flex-col gap-[7px]">
            <div className="text-[15px] font-medium">Email</div>
            <input
              className="text-lg w-[350px] bg-white/70 px-[20px] py-[5px] rounded-lg placeholder-gray-400 focus:ring-2 focus:outline-none focus:ring-blue-400/50 focus:bg-white"
              type="text"
              onChange={(e) => setemail(e.target.value)}
              placeholder="Email"
            />
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
          <div className="flex  justify-between items-center my-[10px]">
            <div className="flex gap-[5px] items-center">
              <input type="checkbox"></input>
              <div className="">Remember me</div>
            </div>
            <div className="text-blue-600">Forgot password ?</div>
          </div>
          <button
            onClick={(e) => {
              submitHandler(e);
            }}
            type="submit"
            className="text-white text-[18px] text-center  w-full rounded-[5px] py-[5px] px-[20px]
           bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600   font-semibold transition-all duration-300   shadow-lg shadow-blue-500/30 "
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              signIn("google");
            }}
            className="flex gap-[5px] mt-[10px]  w-full items-center bg-white/50 hover:bg-white/70 border border-2 border-gray-200 justify-center rounded-[5px] py-[5px] px-[20px]"
          >
            <Image
              src="/Images/google.png"
              width={24}
              height={24}
              alt="google"
            />
            <div className="text-[18px] font-semibold">Sign Up with Google</div>
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
