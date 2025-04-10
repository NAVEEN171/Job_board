"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { FormEvent } from "react";
import { Authactions } from "@/store/Substores/Authslice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import store from "@/store";
import { Oval } from "react-loader-spinner";

const page = () => {
  const dispatch = useDispatch();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const [errorshow, seterrorshow] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  type loginErrorstype = {
    emailerror: string;
    passworderror: string;
    [key: string]: string;
  };

  const loginErrors: loginErrorstype = {
    emailerror: "",
    passworderror: "",
  };
  const [errors, setErrors] = useState<loginErrorstype>(loginErrors);
  const validateFields = (): {
    updatedErrors: loginErrorstype;
    isValid: boolean;
  } => {
    let updatedErrors: loginErrorstype = { ...errors };

    if (email.trim() === "" || password === "") {
      updatedErrors.emailerror = "Some fields are empty";
      setErrors(updatedErrors);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout((prevErrors: any) => {
        setErrors({ ...prevErrors, emailerror: "" });
      }, 3000);
      return { updatedErrors, isValid: false };
    } else {
      if (!email.includes("@") && email.trim().length > 0) {
        updatedErrors.emailerror = "Email id should contain @";
      }
      if (password.trim().length < 8) {
        updatedErrors.passworderror = "Password should be atleast 8 characters";
      }
      setErrors(updatedErrors);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout((prevErrors: any) => {
        setErrors({ ...prevErrors, emailerror: "", passworderror: "" });
      }, 3000);
      // console.log(updatedErrors);
      if (updatedErrors.emailerror || updatedErrors.passworderror) {
        return { updatedErrors, isValid: false };
      }
    }
    return { updatedErrors, isValid: true };
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { updatedErrors, isValid } = validateFields();
      setIsLoginLoading(true);
      // console.log(isValid);
      if (isValid) {
        let response = await fetch("/api/auth/Login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
        let data = await response.json();

        if (response.ok) {
          // console.log(data);

          if (dispatch(Authactions.getCookie("userId")).payload.length) {
            dispatch(Authactions.deleteCookie("userId"));
          }
          dispatch(
            Authactions.setCookie({
              name: "userId",
              value: data.user._id,
              expirationDays: 1,
            })
          );

          if (data.user._id?.length) {
            dispatch(Authactions.setUserId(data.user._id));
          }
          dispatch(
            Authactions.setCookie({
              name: "accessToken",
              value: data.user.accessToken,
              expirationDays: 1,
            })
          );
          dispatch(
            Authactions.setCookie({
              name: "refreshToken",
              value: data.user.refreshToken,
              expirationDays: 1,
            })
          );

          // console.log(data);

          // console.log("succesfully logged in");
          dispatch(Authactions.setloggedIn(true));
          router.push("/");
        } else {
          let data = await response.json();
          if (data.message) {
            seterrorshow(data.message);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
              seterrorshow("");
            }, 3000);
          }

          // console.log(data);
        }
      }
    } catch (err) {
      // console.log(err);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      try {
        const response = await fetch("/api/auth/[...nextauth]", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        const data = await response.json();

        if (data.status === 200) {
          if (Authactions.getCookie("userId")) {
            Authactions.deleteCookie("userId");
          }
          dispatch(
            Authactions.setCookie({
              name: "accessToken",
              value: data.user.accessToken,
              expirationDays: 1,
            })
          );
          dispatch(
            Authactions.setCookie({
              name: "refreshToken",
              value: data.user.refreshToken,
              expirationDays: 1,
            })
          );
          dispatch(
            Authactions.setCookie({
              name: "userId",
              value: data.user.id,
              expirationDays: 1,
            })
          );
          if (data.user?.id?.length) {
            dispatch(Authactions.setUserId(data.user.id));
          }
          dispatch(Authactions.setloggedIn(true));
          seterrorshow("Successfully logged in");
          router.push("/");
        } else {
          seterrorshow(data.message);
        }
      } catch (error) {
        seterrorshow("Network error");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    flow: "implicit",
    onError: () => {
      seterrorshow("Login Failed");
      setIsGoogleLoading(false);
    },
  });

  return (
    <div className="h-[100vh] relative w-full flex bg-gradient-to-r from-indigo-50 via-blue-100 to-purple-100 bg-opacity-90">
      <div className="errorsshower px-3 fixed w-full top-2 flex flex-col items-center gap-[10px]">
        {errorshow && (
          <div
            style={{
              zIndex: 10000,
            }}
            className="text-lg xs:text-base border-4 border-white w-fit bg-gradient-to-r from-blue-500/70 to-blue-600/70 py-4 px-8 text-white shadow-2xl rounded-[10px] backdrop-blur-sm"
          >
            {errorshow}
          </div>
        )}
        {errors.emailerror && (
          <div
            id="emailerrorshower"
            style={{
              zIndex: 10000,
            }}
            className="text-lg xs:text-base border-4 border-white w-fit bg-gradient-to-r from-blue-500/70 to-blue-600/70 py-4 px-8 text-white shadow-2xl rounded-[10px] backdrop-blur-sm"
          >
            {errors.emailerror}
          </div>
        )}
        {errors.passworderror && (
          <div
            id="passworderrorshower"
            style={{
              zIndex: 10000,
            }}
            className="text-lg xs:text-base border-4 border-white w-fit bg-gradient-to-r from-blue-500/70 to-blue-600/70 py-4 px-8 text-white shadow-2xl rounded-[10px] backdrop-blur-sm"
          >
            {errors.passworderror}
          </div>
        )}
      </div>
      <div className="w-full md:w-1/2 h-full flex items-center justify-center">
        <div className="bg-gradient-to-br w-[90%] sm:w-fit flex flex-col gap-[10px] from-white/50 to-white/30 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 px-[15px] sm:px-[30px] py-[20px]">
          <div className="text-[20px] sm:text-[25px] font-bold text-center">
            Welcome to FlexiBoard
          </div>
          <div className="flex gap-[20px] items-center">
            <div className="text-[20px] sm:text-[23px] font-semibold">
              Log In
            </div>
            <Link href="/">
              <div className="py-[5px] px-[5px] rounded-lg shadow-md bg-white">
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
            <div className="text-[15px] font-medium">Email</div>
            <input
              className="text-lg w-full sm:w-[350px] bg-white/70 px-[20px] py-[5px] rounded-lg placeholder-gray-400 focus:ring-2 focus:outline-none focus:ring-blue-400/50 focus:bg-white"
              type="text"
              onChange={(e) => setemail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="flex flex-col gap-[7px]">
            <div className="text-[15px] font-medium">Password</div>
            <div className="relative w-full">
              <input
                id="password"
                onChange={(e) => setpassword(e.target.value)}
                className="text-lg w-full sm:w-[350px] bg-white/70 pl-[20px] pr-[35px] py-[5px] rounded-lg placeholder-gray-400 focus:ring-2 focus:outline-none focus:ring-blue-400/50 focus:bg-white"
                type={`${showPassword ? "text" : "password"}`}
                placeholder="Password"
              />
              {showPassword && (
                <IoEyeOutline
                  onClick={() => {
                    setShowPassword(false);
                  }}
                  className="cursor-pointer w-[20px] h-[30px] absolute top-1/2 -translate-y-1/2 right-3"
                />
              )}

              {!showPassword && (
                <IoEyeOffOutline
                  onClick={() => {
                    setShowPassword(true);
                  }}
                  className="cursor-pointer w-[20px] h-[30px] absolute top-1/2 -translate-y-1/2 right-3"
                />
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center my-[10px] gap-2 sm:gap-0">
            <div className="flex gap-[5px] items-center">
              <input type="checkbox"></input>
              <div className="text-sm sm:text-base">Remember me</div>
            </div>
            <Link href="/Forgot-password">
              <div className="text-blue-600 cursor-pointer text-sm sm:text-base">
                Forgot password ?
              </div>
            </Link>
          </div>
          <button
            onClick={(e) => {
              submitHandler(e);
            }}
            disabled={isLoginLoading}
            className="text-white text-[16px] sm:text-[18px] text-center w-full rounded-[5px] py-[5px] px-[20px]
           bg-gradient-to-r flex gap-2 items-center justify-center from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30"
          >
            {isLoginLoading && (
              <Oval
                height={20}
                width={20}
                color="#FFFFFF"
                visible={true}
                secondaryColor="#4285F4"
                strokeWidth={4}
                ariaLabel="oval-loading"
              />
            )}
            Login
          </button>
          <button
            onClick={() => {
              handleSignIn();
            }}
            disabled={isGoogleLoading}
            className="flex gap-[5px] mt-[10px] w-full items-center bg-white/50 hover:bg-white/70 border-2 border-gray-200 justify-center rounded-[5px] py-[5px] px-[20px]"
          >
            {!isGoogleLoading ? (
              <Image
                src="/Images/google.png"
                width={24}
                height={24}
                alt="google"
              />
            ) : (
              <Oval
                height={24}
                width={24}
                color="#4285F4"
                visible={true}
                secondaryColor="#4285F4"
                strokeWidth={4}
                ariaLabel="oval-loading"
              />
            )}
            <div className="text-[16px] sm:text-[18px] font-semibold">
              Log In with Google
            </div>
          </button>
          <div className="flex items-center gap-[5px] justify-center">
            <div className="text-sm sm:text-base">not a member ?</div>
            <Link className="text-blue-600 text-sm sm:text-base" href="/Signup">
              Signup
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
