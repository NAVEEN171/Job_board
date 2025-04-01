import React from "react";
import { useRouter } from "next/navigation";

const Herosection = () => {
  const router = useRouter();
  return (
    <div className="w-full xs:px-4 px-14 xs:py-3 py-[20px] text-center break-words">
      <h1 className="text-5xl xs:text-2xl xs:mt-0  mt-[40px] font-semibold text-[#0066cc] ">
        Supercharge Your
        <span className="text-[#3a90ff]"> Job Search</span>
      </h1>
      <h6 className="text-gray-500  mt-[30px] xs:text-sm  text-xl font-medium">
        Find the right opportunity without the hassle, streamline your search
        and unlock the career you deserve!
      </h6>
      <button
        onClick={() => {
          router.push("/Resume-tailor");
        }}
        className="bg-[#4AA3FA] mt-6 xs:text-base text-lg px-7 py-3 font-semibold rounded-lg text-white cursor-pointer shadow-md"
      >
        AI Resume Tailor 📝
      </button>
    </div>
  );
};

export default Herosection;
