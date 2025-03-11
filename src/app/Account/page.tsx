"use client";

import React, { Fragment, useState } from "react";
import { Authactions } from "@/store/Substores/Authslice";
import { useDispatch, useSelector } from "react-redux";
import store from "@/store";
import Navbar from "@/components/Navbar/Navbar";
import JobListing from "@/components/savedJobs/SavedJobs";

const page = () => {
  const dispatch = useDispatch();
  type RootState = ReturnType<typeof store.getState>;
  const user = useSelector((state: RootState) => state.Auth.User);
  const [currentOption, setCurrentOption] = useState<string>("My Profile");

  return (
    <div className="flex items-center gap-10 flex-col">
      <Navbar />
      <div className="w-[90%] flex  ">
        <div className="w-[30%] lg:w-[20%] flex flex-col gap-7">
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
        <div className="w-[70%] lg:w-[80%]">
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
  );
};

export default page;
