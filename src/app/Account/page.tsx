"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import store from "@/store";
import Navbar from "@/components/Navbar/Navbar";
import JobListing from "@/components/savedJobs/SavedJobs";
import Footer from "@/components/Footer/Footer";
const page = () => {
  type RootState = ReturnType<typeof store.getState>;
  const user = useSelector((state: RootState) => state.Auth.User);
  const [currentOption, setCurrentOption] = useState<string>("My Profile");

  return (
    <div className="flex items-center min-h-screen justify-between gap-10 flex-col">
      <div className="flex flex-col w-full items-center gap-10">
        <Navbar />
        <div className="w-[90%] md:flex-row flex flex-col ">
          <div className=" w-full md:w-[20%] flex flex-col gap-7">
            <div className="text-2xl font-bold cursor-pointer">My Account</div>
            <div
              onClick={() => {
                setCurrentOption("My Profile");
              }}
              className={`text-lg font-semibold px-3 py-1  cursor-pointer relative ${
                currentOption === "My Profile"
                  ? "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-500"
                  : ""
              }`}
            >
              My Profile
            </div>
            <div
              onClick={() => {
                setCurrentOption("My Wishlist");
              }}
              className={`text-lg font-semibold px-3 py-1  cursor-pointer relative ${
                currentOption === "My Wishlist"
                  ? "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-500"
                  : ""
              }`}
            >
              My Wishlist
            </div>
          </div>
          <div className="w-full lg:w-[80%]">
            {currentOption === "My Profile" ? (
              <div className="p-5 shadow-md rounded-md border border-gray-100">
                <div>email: {user?.email}</div>
                <div>userName: {user?.username}</div>
              </div>
            ) : (
              <JobListing />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
