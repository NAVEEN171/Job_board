"use client";

import Image from "next/image";
import Navbar from "../components/Navbar/Navbar";
import Herosection from "../components/Herosection/Herosection";
import Filter from "../components/Filters/Filter";
import JobListing from "@/components/JobListing/JobListing";
import Pagination from "@/components/Pagination/pagination";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <div className="w-[80%]">
        <div className="bottom-container w-full pb-[10px]">
          <Herosection />
          <Filter />
          <JobListing />
          <Pagination />
        </div>
      </div>
    </div>
  );
}
