"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const [errorshow, seterrorshow] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [status, setstatus] = useState<boolean>(false);
  const [token, settoken] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const params = useSearchParams();
  const [showConfirmPassword, setConfirmShowPassword] =
    useState<boolean>(false);
  const [confirmpassword, setconfirmpassword] = useState<string>("");
  type signupErrorstype = {
    passworderror: String;
    confirmpassworderror: String;
    [key: string]: String;
  };
  const signupErrors: signupErrorstype = {
    passworderror: "",
    confirmpassworderror: "",
  };
  const [errors, setErrors] = useState<signupErrorstype>(signupErrors);
  const validateFields = (): {
    updatedErrors: signupErrorstype;
    isValid: boolean;
  } => {
    let updatedErrors: signupErrorstype = { ...errors };
    if (password === "" || confirmpassword === "") {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      updatedErrors.passworderror = "Some fields are empty";
      setErrors(updatedErrors);

      timeoutRef.current = setTimeout((prevErrors: any) => {
        setErrors({ ...prevErrors, passworderror: "" });
      }, 3000);
      return { updatedErrors, isValid: false };
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (password.trim().length < 8) {
        updatedErrors.passworderror = "Password should be atleast 8 characters";
      }
      if (password.length > 7 && password !== confirmpassword) {
        updatedErrors.confirmpassworderror = "Passwords do not match";
      }

      setErrors(updatedErrors);
      timeoutRef.current = setTimeout((prevErrors: any) => {
        setErrors({
          ...prevErrors,
          passworderror: "",
          confirmpassworderror: "",
        });
      }, 3000);
      if (updatedErrors.confirmpassworderror || updatedErrors.passworderror) {
        return { updatedErrors, isValid: false };
      }
    }
    return { updatedErrors, isValid: true };
  };
  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    let valid = validateFields();

    if (valid.isValid && status) {
      let response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });
      let data = await response.json();
      if (response.ok) {
        seterrorshow(data.message);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          seterrorshow("");
          router.push("/Login");
        }, 2000);
      } else {
        seterrorshow(data.message);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          seterrorshow("");
          if (response.status === 404) {
            router.push("/Forgot-password");
          }
        }, 3000);
      }
    }
  };

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
    <div className="h-screen relative w-full flex bg-gradient-to-r from-indigo-50 via-blue-100 to-purple-100 bg-opacity-90">
      <div className="errorsshower px-3 w-full absolute top-2 flex flex-col items-center gap-[10px]">
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

        {errors.passworderror && (
          <div
            style={{
              zIndex: 10000,
            }}
            className="text-lg xs:text-base border-4 border-white w-fit bg-gradient-to-r from-blue-500/70 to-blue-600/70 py-4 px-8 text-white shadow-2xl rounded-[10px] backdrop-blur-sm"
          >
            {errors.passworderror}
          </div>
        )}
        {errors.confirmpassworderror && (
          <div
            style={{
              zIndex: 10000,
            }}
            className="text-lg xs:text-base border-4 border-white w-fit bg-gradient-to-r from-blue-500/70 to-blue-600/70 py-4 px-8 text-white shadow-2xl rounded-[10px] backdrop-blur-sm"
          >
            {errors.confirmpassworderror}
          </div>
        )}
      </div>
      <div className="md:w-1/2 h-full w-full flex items-center justify-center">
        <div className="bg-gradient-to-br w-[90%] sm:w-fit flex flex-col gap-[10px] from-white/50 to-white/30 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 px-[15px] sm:px-[30px] py-[20px]">
          <div className="text-[20px] sm:text-[25px] font-bold text-center">
            Forgot password
          </div>
          <div className="flex gap-[20px] items-center">
            <div className="text-[20px] sm:text-[23px] font-semibold">
              Reset password
            </div>
            <Link href="/Forgot-password">
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
          <div className="flex flex-col gap-[7px]">
            <div className="text-[15px] font-medium">Confirm password</div>
            <div className="relative w-full">
              <input
                id="confirmpassword"
                className="text-lg w-full sm:w-[350px] bg-white/70 pl-[20px] pr-[35px] py-[5px] rounded-lg placeholder-gray-400 focus:ring-2 focus:outline-none focus:ring-blue-400/50 focus:bg-white"
                type={`${showConfirmPassword ? "text" : "password"}`}
                onChange={(e) => setconfirmpassword(e.target.value)}
                placeholder="Password"
              />
              {showConfirmPassword && (
                <IoEyeOutline
                  onClick={() => {
                    setConfirmShowPassword(false);
                  }}
                  className="cursor-pointer w-[20px] h-[30px] absolute top-1/2 -translate-y-1/2 right-3"
                />
              )}

              {!showConfirmPassword && (
                <IoEyeOffOutline
                  onClick={() => {
                    setConfirmShowPassword(true);
                  }}
                  className="cursor-pointer w-[20px] h-[30px] absolute top-1/2 -translate-y-1/2 right-3"
                />
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              submitHandler(e);
            }}
            type="submit"
            disabled={!status}
            className={`text-white ${
              status ? "cursor-pointer" : "cursor-not-allowed"
            } text-[16px] sm:text-[18px] text-center w-full rounded-[5px] py-[5px] px-[20px]
           bg-gradient-to-r mt-[10px] from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30`}
          >
            {status ? "Submit" : "verifying ..."}
          </button>

          <div className="flex items-center gap-[5px] justify-center">
            <div className="text-sm sm:text-base">Already a member ?</div>
            <Link className="text-blue-600 text-sm sm:text-base" href="/Login">
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="md:flex h-full hidden justify-center items-center">
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
