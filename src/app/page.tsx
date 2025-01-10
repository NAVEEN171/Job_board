"use client";

import Image from "next/image";
import Navbar from "../components/Navbar/Navbar";
import Herosection from "../components/Herosection/Herosection";
import Filter from "../components/Filters/Filter";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <div className="w-[80%]">
        <div className="bottom-container w-full pb-[10px]">
          <Herosection />
          <Filter />
        </div>
      </div>
    </div>
  );
}
