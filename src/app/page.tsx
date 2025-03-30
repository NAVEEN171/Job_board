"use client";

import Image from "next/image";
import Navbar from "../components/Navbar/Navbar";
import Herosection from "../components/Herosection/Herosection";
import Filter from "../components/Filters/Filter";
import JobListing from "@/components/JobListing/JobListing";
import Pagination from "@/components/Pagination/pagination";
import Footer from "@/components/Footer/Footer";
import { useSelector } from "react-redux";
import { useState } from "react";
import store from "@/store";
import Errorscontainer from "@/components/ErrorShow/Errorscontainer";

export default function Home() {
  type RootState = ReturnType<typeof store.getState>;

  const errorshow = useSelector((state: RootState) => state.Auth.errorshow);
  return (
    <div className="flex flex-col relative    items-center">
      <Errorscontainer errorshow={errorshow} />
      <Navbar />
      <div className="w-[80%] xs:p-4 xs:w-full md-max:w-[90%] ">
        <div className="bottom-container   w-full pb-[10px]">
          <Herosection />
          <Filter />
          <JobListing />
          <Pagination />
        </div>
      </div>
      <Footer />
    </div>
  );
}
